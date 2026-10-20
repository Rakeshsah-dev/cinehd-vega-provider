import { ProviderContext, SettingsField } from "../types";
import { DEFAULT_BASE_URL } from "./helpers";

export const getSettingsSchema = async function ({ providerContext }: { providerContext: ProviderContext; }): Promise<SettingsField[]> {
  const current = await providerContext.kvStore.get<string>("baseUrl");
  return [
    {
      key: "baseUrl",
      type: "text",
      label: "CineHD website URL",
      description: "Public catalog base URL. Default: cinehd.vc. Use only a site you are authorized to access.",
      placeholder: DEFAULT_BASE_URL,
      defaultValue: current || DEFAULT_BASE_URL
    }
  ];
};
