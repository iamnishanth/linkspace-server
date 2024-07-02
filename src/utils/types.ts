export type BaseSaveRequest = {
  type: "link" | "image" | "text";
  uid: string;
};

export type LinkSaveRequest = BaseSaveRequest & {
  url: string;
};

export type ImageSaveRequest = BaseSaveRequest & {};

export type TextSaveRequest = BaseSaveRequest & {
  content: string;
};

export type SaveRequest = LinkSaveRequest;

export type RichLinkImage = {
  url: string;
  buffer: ArrayBuffer;
  width: number | undefined;
  height: number | undefined;
  extension: string | undefined;
};

export type ImageProperties = {
  url: string;
  alt: string;
  width: number;
  height: number;
  fileName: string;
};
