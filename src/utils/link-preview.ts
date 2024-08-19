import * as cheerio from "cheerio";
import imageSize from "image-size";

import { getBaseURL, getImageBufferFromUrl } from "./content-type";
import { RichLinkImage } from "./types";

const getTitle = ($: cheerio.CheerioAPI): string => {
  // get open graph title
  const ogTitle = $("meta[property='og:title']").attr("content");
  if (ogTitle && ogTitle.length > 0) return ogTitle;

  // get twitter title
  const twitterTitle = $("meta[name='twitter:title']").attr("content");
  if (twitterTitle && twitterTitle.length > 0) return twitterTitle;

  // get title tag
  const title = $("title").text();
  if (title) return title;

  return "";
};

const getDescription = ($: cheerio.CheerioAPI): string => {
  // get open graph description
  const ogDescription = $("meta[property='og:description']").attr("content");
  if (ogDescription && ogDescription.length > 0) return ogDescription;

  // get twitter description
  const twitterDescription = $("meta[name='twitter:description']").attr("content");
  if (twitterDescription && twitterDescription.length > 0) return twitterDescription;

  // get meta description
  const description = $("meta[name='description']").attr("content");
  if (description && description.length > 0) return description;

  return "";
};

const getImage = async ($: cheerio.CheerioAPI, url: string): Promise<RichLinkImage | null> => {
  const baseURL = getBaseURL(url);

  // get open graph image
  let ogImage = $("meta[property='og:image']").attr("content");
  if (ogImage && ogImage.length > 0) {
    if (ogImage.startsWith("/")) ogImage = baseURL + ogImage;
    const imageBuffer = await getImageBufferFromUrl(ogImage);
    if (imageBuffer) {
      const _imageBuffer = new Uint8Array(imageBuffer);
      const dimensions = imageSize(_imageBuffer);

      return {
        url: ogImage,
        buffer: imageBuffer,
        width: dimensions.width,
        height: dimensions.height,
        extension: dimensions.type,
      };
    }
  }

  // get image rel link
  let relImage = $("link[rel='image_src']").attr("href");
  if (relImage && relImage.length > 0) {
    if (relImage.startsWith("/")) relImage = baseURL + relImage;
    const imageBuffer = await getImageBufferFromUrl(relImage);
    if (imageBuffer) {
      const _imageBuffer = new Uint8Array(imageBuffer);
      const dimensions = imageSize(_imageBuffer);
      return {
        url: relImage,
        buffer: imageBuffer,
        width: dimensions.width,
        height: dimensions.height,
        extension: dimensions.type,
      };
    }
  }

  // get twitter image
  let twitterImage = $("meta[name='twitter:image']").attr("content");
  if (twitterImage && twitterImage.length > 0) {
    if (twitterImage.startsWith("/")) twitterImage = baseURL + twitterImage;
    const imageBuffer = await getImageBufferFromUrl(twitterImage);
    if (imageBuffer) {
      const _imageBuffer = new Uint8Array(imageBuffer);
      const dimensions = imageSize(_imageBuffer);
      return {
        url: twitterImage,
        buffer: imageBuffer,
        width: dimensions.width,
        height: dimensions.height,
        extension: dimensions.type,
      };
    }
  }

  return null;
};

const getDomain = ($: cheerio.CheerioAPI, url: string): string => {
  // default domain name
  let domainName = new URL(url).hostname.replace("www.", "");

  // get canonical url
  const canonical = $("link[rel='canonical']").attr("href");
  if (canonical && canonical.length > 0)
    domainName = new URL(canonical).hostname.replace("www.", "");

  // get og url
  const ogUrl = $("meta[property='og:url']").attr("content");
  if (ogUrl && ogUrl.length > 0) domainName = new URL(ogUrl).hostname.replace("www.", "");

  return domainName;
};

export const getLinkPreview = async (html: string, url: string) => {
  const $ = cheerio.load(html);
  const title = getTitle($);
  const description = getDescription($);
  const image = await getImage($, url);
  const domain = getDomain($, url);

  const linkPreview = { title, description, image, domain };

  return linkPreview;
};
