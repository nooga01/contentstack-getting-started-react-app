import { THeroBanner } from "../types";
import { getEntryById } from "../api";

export const getHeroBannerById = async (
  uid: string
): Promise<THeroBanner> => {
  const response = (await getEntryById({
    contentTypeUid: "hero_banner",
    uid,
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  })) as THeroBanner;
  return response;
};