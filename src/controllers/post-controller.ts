import type { Request, Response } from "express";
import type { ImageProperties, SaveRequest } from "../utils/types";

import { bucket, db } from "../lib/firebase";
import { browserHeaders, getFirebaseTimestamp } from "../utils/network";
import { getImageBufferFromUrl, isHtml, isImage } from "../utils/content-type";
import { getLinkPreview } from "../utils/link-preview";
import imageSize from "image-size";

export const savePost = async (req: Request, res: Response) => {
  try {
    const { type } = req.body as SaveRequest;

    if (type === "link") {
      const { url, uid } = req.body;

      const response = await fetch(url, { method: "GET", headers: browserHeaders });

      // unable to get the response - most likely return FORBIDDEN
      if (!response.ok) {
        // TODO: for now, we are setting just the url and saving it firestore, in the future use puppeteer
        const newPost = {
          type: "link",
          title: new URL(url).hostname.replace("www.", ""),
          title_lower: new URL(url).hostname.replace("www.", "").toLowerCase(),
          description: "",
          url: url,
          domain: new URL(url).hostname.replace("www.", ""),
          tags: [] as string[],
          notes: "",
          created_at: getFirebaseTimestamp(),
          updated_at: getFirebaseTimestamp(),
          user_id: uid,
          image: null as ImageProperties | null,
          space_ids: [] as string[],
        };

        const docRef = db.collection("posts").doc();
        await docRef.set(newPost);
        return res.status(201).json({ id: docRef.id, ...newPost });
      }

      // get content type of the response
      const contentType = response.headers.get("content-type");
      if (!contentType) return res.status(500).json({ error: "Failed to get content type" });

      if (isHtml(contentType)) {
        const html = await response.text();
        const linkPreview = await getLinkPreview(html, url);
        // TODO
        // if no description or image, it is most likely a client side rendering page
        // use puppeteer to load the page in browser and get description and image

        const newPost = {
          type: "link",
          title: linkPreview.title,
          title_lower: linkPreview.title.toLowerCase(),
          description: linkPreview.description,
          url: url,
          domain: linkPreview.domain,
          tags: [] as string[], // TODO: generate tags using AI in future
          notes: "",
          created_at: getFirebaseTimestamp(),
          updated_at: getFirebaseTimestamp(),
          user_id: uid,
          image: null as ImageProperties | null,
          space_ids: [] as string[],
        };

        const docRef = db.collection("posts").doc();

        if (linkPreview.image) {
          // upload to firebase storage
          const fileName = `${uid}/${docRef.id}.${linkPreview.image.extension}`;
          const file = bucket.file(fileName);
          const buffer = Buffer.from(linkPreview.image.buffer);
          await file.save(buffer);
          const imageURL = await file.getSignedUrl({
            action: "read",
            expires: "03-01-2500",
          });

          newPost.image = {
            url: imageURL[0],
            width: linkPreview.image.width,
            height: linkPreview.image.height,
            alt: linkPreview.title,
            fileName,
          };
        }

        // save to firestore
        await docRef.set(newPost);

        return res.status(201).json({ id: docRef.id, ...newPost });
      } else if (isImage(contentType)) {
        const imageBuffer = await getImageBufferFromUrl(url);
        if (imageBuffer) {
          const _imageBuffer = new Uint8Array(imageBuffer);
          const dimensions = imageSize(_imageBuffer);

          const imageMetaData = {
            url: url,
            buffer: imageBuffer,
            width: dimensions.width,
            height: dimensions.height,
            extension: dimensions.type,
          };

          const docRef = db.collection("posts").doc();
          // upload to firebase storage
          const fileName = `${uid}/${docRef.id}.${imageMetaData.extension}`;
          const file = bucket.file(fileName);
          const buffer = Buffer.from(imageMetaData.buffer);
          await file.save(buffer);
          const imageURL = await file.getSignedUrl({
            action: "read",
            expires: "03-01-2500",
          });

          const image = {
            url: imageURL[0],
            width: imageMetaData.width,
            height: imageMetaData.height,
            alt: "",
            fileName,
          };

          const newPost = {
            type: "image",
            title: "",
            title_lower: "",
            description: "",
            url: url,
            domain: new URL(url).hostname.replace("www.", ""),
            tags: [] as string[],
            notes: "",
            created_at: getFirebaseTimestamp(),
            updated_at: getFirebaseTimestamp(),
            user_id: uid,
            image: image,
            space_ids: [] as string[],
          };

          await docRef.set(newPost);
          return res.status(201).json({ id: docRef.id, ...newPost });
        }

        return res.status(415).json({ contentType, message: "content type not supported" });
      } else {
        return res.status(415).json({ contentType, message: "content type not supported" });
      }
    }

    return res.status(400).json({ error: "Invalid request type" });
  } catch (error) {
    console.error("Error saving post:", error);
    return res.status(500).json({ error: "Failed to save post" });
  }
};
