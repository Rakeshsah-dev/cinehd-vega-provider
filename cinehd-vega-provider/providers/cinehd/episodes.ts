import { EpisodeLink, ProviderContext } from "../types";
import { absoluteUrl, cleanText, getBaseUrl } from "./helpers";

export const getEpisodes = async function ({ url, providerContext }: { url: string; providerContext: ProviderContext; }): Promise<EpisodeLink[]> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const base = await getBaseUrl(providerContext);
  const target = absoluteUrl(url, base);
  if (!target || !target.startsWith("https://")) return [];
  const response = await axios.get(target, { headers: commonHeaders, timeout: 15000 });
  const $ = cheerio.load(response.data);
  const results: EpisodeLink[] = [];
  $("a[href]").each((_i, el) => {
    const a = $(el);
    const href = absoluteUrl(a.attr("href") || "", base);
    const title = cleanText(a.attr("title") || a.text());
    if (href && title && /episode|\/ep\d+|\/season\//i.test(`${href} ${title}`) && !results.some(x => x.link === href)) {
      results.push({ title, link: href });
    }
  });
  return results;
};
