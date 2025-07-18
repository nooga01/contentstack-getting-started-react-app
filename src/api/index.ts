import { Dispatch } from "react";
import { CONTENT_TYPES } from "../constants";
import {
  setFooterData,
  setHeaderData,
  setHomePageData,
  // COMMENT: Uncomment below line
  setMenuPageData,
  // COMMENT: About us page
  setAboutusPageData,
  // COMMENT: Page
  setPageData,
  // COMMENT: PageWithHeroBanner
  setPageWithHeroBannerData,
} from "../reducer";
import { initializeContentstackSdk } from "../sdk/utils";
import * as Utils from "@contentstack/utils";

const Stack = initializeContentstackSdk();

type GetEntryByUrl = {
  entryUrl: string | undefined;
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

type GetEntryById = {
  uid: string | undefined;
  contentTypeUid: string;
  referenceFieldPath: string[] | undefined;
  jsonRtePath: string[] | undefined;
};

const renderOption = {
  span: (node: any, next: any) => next(node.children),
};

export const getEntry = (contentType: string) => {
  const Query = Stack.ContentType(contentType).Query();
  return Query.toJSON()
    .find()
    .then((entry) => {
      return entry;
    })
    .catch((err: any) => {
      return {};
    });
};

export const getEntryByUrl = ({
  contentTypeUid,
  entryUrl,
  referenceFieldPath,
  jsonRtePath,
}: GetEntryByUrl) => {
  return new Promise((resolve, reject) => {
    const blogQuery = Stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) blogQuery.includeReference(referenceFieldPath);
    blogQuery.toJSON();
    const data = blogQuery.where("url", `${entryUrl}`).find();
    data.then(
      (result) => {
        jsonRtePath &&
          Utils.jsonToHTML({
            entry: result,
            paths: jsonRtePath,
            renderOption,
          });
        resolve(result[0]);
      },
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });
};

export const fetchHeaderData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getEntry(CONTENT_TYPES.HEADER);
  dispatch(setHeaderData(data[0][0]));
};

export const fetchFooterData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getEntry(CONTENT_TYPES.FOOTER);
  dispatch(setFooterData(data[0][0]));
};

export const fetchHomePageData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data: any = await getEntryByUrl({
    contentTypeUid: CONTENT_TYPES.PAGE,
    entryUrl: "/",
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  });
  dispatch(setHomePageData(data[0]));
};

export const fetchInitialData = async (
  dispatch: Dispatch<any>,
  setLoading: (status: boolean) => void
): Promise<void> => {
  try {
    await Promise.all([
      fetchHeaderData(dispatch),
      fetchFooterData(dispatch),
      fetchHomePageData(dispatch),
      fetchAboutusPageData(dispatch),
      fetchPageData(dispatch),
      fetchPageWithHeroBannerData(dispatch),
    ]);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// COMMENT: Uncomment below code

export const fetchMenuPageData = async (
  dispatch: Dispatch<any>,
  setLoading: (status: boolean) => void
): Promise<void> => {
  const data: any = await getEntryByUrl({
    contentTypeUid: CONTENT_TYPES.PAGE,
    entryUrl: "/menu",
    referenceFieldPath: ["sections.menu.course.dishes"],
    jsonRtePath: undefined,
  });
  dispatch(setMenuPageData(data[0].sections[0].menu.course));
  setLoading(false);
};

export const fetchAboutusPageData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data: any = await getEntryByUrl({
    contentTypeUid: CONTENT_TYPES.PAGE,
    entryUrl: "/about-us",
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  });
  dispatch(setAboutusPageData(data[0]));
};

export const fetchPageData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data = await getEntry(CONTENT_TYPES.PAGE);
  dispatch(setPageData(data[0]));
};

export const fetchPageWithHeroBannerData = async (
  dispatch: Dispatch<any>
): Promise<void> => {
  const data: any = await getEntryByUrl({
    contentTypeUid: CONTENT_TYPES.PAGEWITHHEROBANNER,
    entryUrl: "/contact-us",
    referenceFieldPath: undefined,
    jsonRtePath: undefined,
  });
  dispatch(setPageWithHeroBannerData(data[0]));
};

/**
 *fetches specific entry from a content-type
 *
 * @param {* content-type uid} contentTypeUid
 * @param {* uuid for uuid to be fetched} entryId
 * @param {* reference field name} referenceFieldPath
 * @param {* Json RTE path} jsonRtePath
 * @returns
 */
export const getEntryById = ({
  contentTypeUid,
  uid,
  referenceFieldPath,
  jsonRtePath,
}: GetEntryById) => {
  return new Promise((resolve, reject) => {
    const entryQuery = Stack.ContentType(contentTypeUid).Query();
    if (referenceFieldPath) entryQuery.includeReference(referenceFieldPath);
    entryQuery.toJSON();
    const data = entryQuery.where("uid", `${uid}`).find();
    data.then(
      (result) => {
        jsonRtePath &&
          Utils.jsonToHTML({
            entry: result,
            paths: jsonRtePath,
            renderOption,
          });
        resolve(result[0]);
      },
      (error) => {
        console.error(error);
        reject(error);
      }
    );
  });
};
