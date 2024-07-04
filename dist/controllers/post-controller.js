"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePost = void 0;
const firebase_1 = require("../lib/firebase");
const network_1 = require("../utils/network");
const content_type_1 = require("../utils/content-type");
const link_preview_1 = require("../utils/link-preview");
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type } = req.body;
        if (type === "link") {
            const { url, uid } = req.body;
            const response = yield fetch(url, { method: "GET", headers: network_1.browserHeaders });
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
                    tags: [],
                    notes: "",
                    created_at: (0, network_1.getFirebaseTimestamp)(),
                    updated_at: (0, network_1.getFirebaseTimestamp)(),
                    user_id: uid,
                    image: null,
                    space_ids: [],
                };
                const docRef = firebase_1.db.collection("posts").doc();
                yield docRef.set(newPost);
                return res.status(201).json(Object.assign({ id: docRef.id }, newPost));
            }
            // get content type of the response
            const contentType = response.headers.get("content-type");
            if (!contentType)
                return res.status(500).json({ error: "Failed to get content type" });
            if ((0, content_type_1.isHtml)(contentType)) {
                const html = yield response.text();
                const linkPreview = yield (0, link_preview_1.getLinkPreview)(html, url);
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
                    tags: [], // TODO: generate tags using AI in future
                    notes: "",
                    created_at: (0, network_1.getFirebaseTimestamp)(),
                    updated_at: (0, network_1.getFirebaseTimestamp)(),
                    user_id: uid,
                    image: null,
                    space_ids: [],
                };
                const docRef = firebase_1.db.collection("posts").doc();
                if (linkPreview.image) {
                    // upload to firebase storage
                    const fileName = `${uid}/${docRef.id}.${linkPreview.image.extension}`;
                    const file = firebase_1.bucket.file(fileName);
                    const buffer = Buffer.from(linkPreview.image.buffer);
                    yield file.save(buffer);
                    const imageURL = yield file.getSignedUrl({
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
                yield docRef.set(newPost);
                return res.status(201).json(Object.assign({ id: docRef.id }, newPost));
            }
            else if ((0, content_type_1.isImage)(contentType)) {
                // TODO: handle image
                return res.status(415).json({ contentType, message: "content type not supported" });
            }
            else {
                return res.status(415).json({ contentType, message: "content type not supported" });
            }
        }
        return res.status(400).json({ error: "Invalid request type" });
    }
    catch (error) {
        console.error("Error saving post:", error);
        return res.status(500).json({ error: "Failed to save post" });
    }
});
exports.savePost = savePost;
//# sourceMappingURL=post-controller.js.map