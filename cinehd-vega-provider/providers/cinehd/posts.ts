import { Post, ProviderContext } from "../types";
import { absoluteUrl, cleanText, getBaseUrl, isSameHostUrl } from "./helpers";

function isContentPath(url: string): boolean {
  return /\/(movie|movies|tv|tv-show|tv-shows|series|anime|watch)\//i.test(url) || /[?&](id|movie|show)=/i.test(url);
}

async function scrapePosts(url: string, page: number, providerContext: ProviderContext, signal?: AbortSignal): Promise<Post[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const response = await axios.get(url, { headers: commonHeaders, signal, timeout: 15000 });
  const $ = cheerio.load(response.data);
  const base = new URL(url).origin;
  const seen = new Set<string>();
  const results: Post[] = [];

  // Generic card selectors: intentionally limited to public HTML links and metadata.
  $("a[href]").each((_index, element) => {
    const anchor = $(element);
    const href = absoluteUrl(anchor.attr("href") || "", base);
    if (!href || !isSameHostUrl(href, base) || !isContentPath(href) || seen.has(href)) return;
    const imageEl = anchor.find("img").first();
    const title = cleanText(anchor.attr("title") || imageEl.attr("alt") || anchor.find("h2,h3,h4,.title,[class*=title]").first().text() || anchor.text());
    const image = absoluteUrl(imageEl.attr("data-src") || imageEl.attr("data-lazy-src") || imageEl.attr("src") || "", base);
    if (!title || title.length < 2) return;
    seen.add(href);
    results.push({ title, link: href, image, provider: "cinehd" });
  });
  const start = Math.max(0, page - 1) * 40;
  return results.slice(start, start + 40);
}

export const getPosts = async function ({ filter, page, providerValue, signal, providerContext }: { filter: string; page: number; providerValue: string; signal: AbortSignal; providerContext: ProviderContext; }): Promise<Post[]> {
  const base = await getBaseUrl(providerContext);
  const safeFilter = filter.startsWith("/") ? filter : `/${filter}`;
  const url = new URL(safeFilter, base);
  if (page > 1) url.searchParams.set("page", String(page));
  return scrapePosts(url.toString(), page, providerContext, signal);
};

export const getSearchPosts = async function ({ searchQuery, page, providerValue, signal, providerContext }: { searchQuery: string; page: number; providerValue: string; signal: AbortSignal; providerContext: ProviderContext; }): Promise<Post[]> {
  const base = await getBaseUrl(providerContext);
  const query = encodeURIComponent(searchQuery.trim());
  const pageParam = page > 1 ? `&page=${page}` : "";
  // These are public navigation URL patterns, not private API endpoints.
  const candidates = [
    `${base}/search?type=movie&q=${query}${pageParam}`,
    `${base}/search?type=tv&q=${query}${pageParam}`,
    `${base}/search?type=movie&query=${query}${pageParam}`,
    `${base}/search/anime?q=${query}${page > 1 ? `?page=${page}` : ""}`,
  ];
  for (const url of candidates) {
    try {
      const items = await scrapePosts(url, page, providerContext, signal);
      if (items.length) return items;
    } catch { /* Try the next common public search URL pattern. */ }
  }
  return [];
};
