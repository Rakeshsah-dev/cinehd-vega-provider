import { Info, ProviderContext } from "../types";
import { absoluteUrl, cleanText, getBaseUrl } from "./helpers";

export const getMeta = async function ({ link, providerContext }: { link: string; providerContext: ProviderContext; }): Promise<Info> {
  const { axios, cheerio, commonHeaders } = providerContext;
  const base = await getBaseUrl(providerContext);
  const url = absoluteUrl(link, base);
  if (!url || !url.startsWith("https://")) throw new Error("Invalid CineHD item URL");
  const response = await axios.get(url, { headers: commonHeaders, timeout: 15000 });
  const $ = cheerio.load(response.data);
  const pick = (...values: Array<string | undefined>) => values.map(v => (v || "").trim()).find(Boolean) || "";
  const title = cleanText(pick($("meta[property='og:title']").attr("content"), $("h1").first().text(), $("title").text()));
  const image = absoluteUrl(pick($("meta[property='og:image']").attr("content"), $("img[class*=poster]").first().attr("src"), $("img").first().attr("src")), base);
  const synopsis = cleanText(pick($("meta[name='description']").attr("content"), $("meta[property='og:description']").attr("content"), $(".description").first().text(), $(".overview").first().text()));
  const isSeries = /\/(tv|tv-show|tv-shows|series|anime)\//i.test(url);
  return {
    title: title || "CineHD title",
    image,
    synopsis,
    imdbId: "",
    type: isSeries ? "series" : "movie",
    webUrl: url,
    // Playback is deliberately not resolved from third-party embed hosts.
    // Add an authorized direct stream URL here only when you have permission to use it.
    linkList: [],
  };
};
