import { AxiosStatic } from "axios";
import * as cheerio from "cheerio";
export interface Post { title: string; link: string; image: string; provider?: string; aspectRatio?: number | string; borderRadius?: number; tag?: string; cornerTag?: string; }
export type TextTracks = { title: string; language: string; type: "application/x-subrip" | "application/ttml+xml" | "text/vtt"; uri: string }[];
export interface Stream { server: string; link: string; type: string; quality?: string; tag?: string; tags?: string[]; subtitles?: TextTracks; headers?: any; }
export interface Info { title: string; image: string; poster?: string; logo?: string; synopsis: string; imdbId: string; tmdbId?: string; type: string; tags?: string[]; cast?: string[]; rating?: string; linkList: Link[]; webUrl?: string; }
export interface EpisodeLink { title: string; link: string; description?: string; image?: string; }
export interface Link { title: string; quality?: string; episodesLink?: string; directLinks?: { title: string; link: string; type?: "movie" | "series"; description?: string; image?: string; }[]; }
export interface ProviderContext { axios: AxiosStatic; commonHeaders: Record<string, string>; cheerio: typeof cheerio; openWebView: (url: string, options?: any) => Promise<any>; kvStore: { get: <T = unknown>(key: string) => Promise<T | undefined>; set: (key: string, value: unknown) => Promise<void>; delete: (key: string) => Promise<boolean>; keys: () => Promise<string[]>; clear: () => Promise<void>; }; }
export interface SettingsField { key: string; label: string; description?: string; type: "text" | "toggle" | "select" | "multiselect" | "number"; defaultValue?: any; placeholder?: string; options?: { label: string; value: string }[]; min?: number; max?: number; }
