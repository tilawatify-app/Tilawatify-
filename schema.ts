import { pgTable, text, integer, timestamp, boolean, primaryKey } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull().default('Quran Listener'),
  email: text('email').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const playlists = pgTable('playlists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
export const playlistItems = pgTable('playlist_items', {
  playlistId: text('playlist_id').notNull(),
  trackId: text('track_id').notNull(),
  addedAt: timestamp('added_at').defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.playlistId, table.trackId] })]);
export const savedTracks = pgTable('saved_tracks', {
  userId: text('user_id').notNull(),
  trackId: text('track_id').notNull(),
  kind: text('kind').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.trackId, table.kind] })]);
export const history = pgTable('listening_history', {
  userId: text('user_id').notNull(),
  trackId: text('track_id').notNull(),
  progress: integer('progress').notNull().default(0),
  plays: integer('plays').notNull().default(1),
  lastPlayed: timestamp('last_played').defaultNow().notNull(),
}, (table) => [primaryKey({ columns: [table.userId, table.trackId] })]);
export const preferences = pgTable('preferences', {
  userId: text('user_id').primaryKey(),
  language: text('language').notNull().default('English'),
  theme: text('theme').notNull().default('Dark'),
  speed: text('speed').notNull().default('1'),
  repeat: boolean('repeat').notNull().default(false),
  sleepMinutes: integer('sleep_minutes').notNull().default(0),
});
