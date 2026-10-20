import { ProviderContext } from "../types";

export const DEFAULT_BASE_URL = "https://cinehd.vc";

export async function getBaseUrl(providerContext: ProviderContext): Promise<string> {
  const custom = await providerContext.kvStore.get<string>("baseUrl");
  const candidate = (custom || DEFAULT_BASE_URL).trim().replace(/\/$/, "");
  if (!/^https:\/\//i.test(candidate)) return DEFAULT_BASE_URL;
  return candidate;
}

export function absoluteUrl(href: string, base: string): string {
  try { return new URL(href, base).toString(); } catch { return ""; }
}

export function isSameHostUrl(url: string, base: string): boolean {
  try { return new URL(url).host === new URL(base).host; } catch { return false; }
}

export function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
