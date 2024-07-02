export const isImage = (contentType: string) =>
  contentType.startsWith("image/jpeg") ||
  contentType.startsWith("image/png") ||
  contentType.startsWith("image/gif") ||
  contentType.startsWith("image/webp") ||
  contentType.startsWith("image/avif") ||
  contentType.startsWith("image/heic");

export const isHtml = (contentType: string) => contentType.startsWith("text/html");

export const getImageBufferFromUrl = async (url: string): Promise<ArrayBuffer | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    // check if response has content-type
    const contentType = response.headers.get("content-type");
    if (!contentType) return null;

    // check if the content type is an image
    const isSupportedImage = isImage(contentType);
    if (!isSupportedImage) return null;

    const buffer = await response.arrayBuffer();
    return buffer;
  } catch (e) {
    console.log("error in getting image buffer", e);
    return null;
  }
};
