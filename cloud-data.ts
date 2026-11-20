import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase';

type Payload = Record<string, unknown>;
const store = () => { if (!firestore) throw new Error('Firebase is not configured.'); return firestore; };
const userPath = (uid: string) => doc(store(), 'users', uid);

export async function loadCloudData(uid: string) {
  const root = userPath(uid);
  const [profile, lists, saved, history, prefs] = await Promise.all([
    getDoc(root), getDocs(collection(root, 'playlists')), getDocs(collection(root, 'saved')),
    getDocs(collection(root, 'history')), getDoc(doc(root, 'settings', 'preferences')),
  ]);
  return {
    profile: profile.exists() ? { name: String(profile.data().name || 'Quran Listener'), email: String(profile.data().email || '') } : null,
    playlists: lists.docs.map(d => ({ id: d.id, name: String(d.data().name || 'Untitled playlist'), description: String(d.data().description || ''), trackIds: Array.isArray(d.data().trackIds) ? d.data().trackIds as string[] : [] })),
    saved: saved.docs.map(d => ({ trackId: String(d.data().trackId), kind: String(d.data().kind) })),
    history: history.docs.map(d => ({ trackId: String(d.data().trackId), progress: Number(d.data().progress || 0), plays: Number(d.data().plays || 1), lastPlayed: d.data().lastPlayed?.toDate?.()?.toISOString?.() || new Date().toISOString() })).sort((a,b) => b.lastPlayed.localeCompare(a.lastPlayed)),
    preferences: prefs.exists() ? { language: String(prefs.data().language || 'English'), theme: String(prefs.data().theme || 'Dark'), speed: String(prefs.data().speed || '1'), repeat: Boolean(prefs.data().repeat), sleepMinutes: Number(prefs.data().sleepMinutes || 0) } : null,
  };
}

export async function mutateCloudData(uid: string, action: string, body: Payload) {
  const root = userPath(uid);
  const playlists = collection(root, 'playlists');
  if (action === 'profile') await setDoc(root, { name: String(body.name || 'Quran Listener').slice(0,80), email: String(body.email || '').slice(0,200), updatedAt: serverTimestamp() }, { merge: true });
  else if (action === 'playlist-create') await setDoc(doc(playlists), { name: String(body.name || '').slice(0,60), description: String(body.description || ''), trackIds: [], createdAt: serverTimestamp() });
  else if (action === 'playlist-rename' || action === 'playlist-delete' || action === 'playlist-item') {
    const target = doc(playlists, String(body.id));
    if (action === 'playlist-delete') await deleteDoc(target);
    else if (action === 'playlist-rename') await setDoc(target, { name: String(body.name || '').slice(0,60) }, { merge: true });
    else { const snapshot = await getDoc(target); if (!snapshot.exists()) throw new Error('Playlist not found.'); const previous: string[] = snapshot.data().trackIds || []; const trackId = String(body.trackId); await setDoc(target, { trackIds: body.remove ? previous.filter(id => id !== trackId) : [...new Set([...previous, trackId])] }, { merge: true }); }
  } else if (action === 'save') {
    const target = doc(root, 'saved', `${String(body.kind)}_${String(body.trackId)}`);
    if (body.remove) await deleteDoc(target);
    else await setDoc(target, { kind: body.kind, trackId: body.trackId, createdAt: serverTimestamp() });
  } else if (action === 'progress') {
    await setDoc(doc(root, 'history', String(body.trackId)), { trackId: body.trackId, progress: Number(body.progress || 0), plays: 1, lastPlayed: serverTimestamp() }, { merge: true });
  } else if (action === 'preferences') {
    await setDoc(doc(root, 'settings', 'preferences'), { language: body.language, theme: body.theme, speed: body.speed, repeat: body.repeat, sleepMinutes: body.sleepMinutes }, { merge: true });
  } else throw new Error('Unknown action.');
}
