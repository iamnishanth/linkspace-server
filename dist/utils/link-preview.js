"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinkPreview = void 0;
const cheerio = __importStar(require("cheerio"));
const image_size_1 = __importDefault(require("image-size"));
const content_type_1 = require("./content-type");
const getTitle = ($) => {
    // get open graph title
    const ogTitle = $("meta[property='og:title']").attr("content");
    if (ogTitle && ogTitle.length > 0)
        return ogTitle;
    // get twitter title
    const twitterTitle = $("meta[name='twitter:title']").attr("content");
    if (twitterTitle && twitterTitle.length > 0)
        return twitterTitle;
    // get title tag
    const title = $("title").text();
    if (title)
        return title;
    return "";
};
const getDescription = ($) => {
    // get open graph description
    const ogDescription = $("meta[property='og:description']").attr("content");
    if (ogDescription && ogDescription.length > 0)
        return ogDescription;
    // get twitter description
    const twitterDescription = $("meta[name='twitter:description']").attr("content");
    if (twitterDescription && twitterDescription.length > 0)
        return twitterDescription;
    // get meta description
    const description = $("meta[name='description']").attr("content");
    if (description && description.length > 0)
        return description;
    return "";
};
const getImage = ($) => __awaiter(void 0, void 0, void 0, function* () {
    // get open graph image
    const ogImage = $("meta[property='og:image']").attr("content");
    if (ogImage && ogImage.length > 0) {
        const imageBuffer = yield (0, content_type_1.getImageBufferFromUrl)(ogImage);
        if (imageBuffer) {
            const _imageBuffer = new Uint8Array(imageBuffer);
            const dimensions = (0, image_size_1.default)(_imageBuffer);
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
    const relImage = $("link[rel='image_src']").attr("href");
    if (relImage && relImage.length > 0) {
        const imageBuffer = yield (0, content_type_1.getImageBufferFromUrl)(relImage);
        if (imageBuffer) {
            const _imageBuffer = new Uint8Array(imageBuffer);
            const dimensions = (0, image_size_1.default)(_imageBuffer);
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
    const twitterImage = $("meta[name='twitter:image']").attr("content");
    if (twitterImage && twitterImage.length > 0) {
        const imageBuffer = yield (0, content_type_1.getImageBufferFromUrl)(twitterImage);
        if (imageBuffer) {
            const _imageBuffer = new Uint8Array(imageBuffer);
            const dimensions = (0, image_size_1.default)(_imageBuffer);
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
});
const getDomain = ($, url) => {
    // default domain name
    let domainName = new URL(url).hostname.replace("www.", "");
    // get canonical url
    const canonical = $("link[rel='canonical']").attr("href");
    if (canonical && canonical.length > 0)
        domainName = new URL(canonical).hostname.replace("www.", "");
    // get og url
    const ogUrl = $("meta[property='og:url']").attr("content");
    if (ogUrl && ogUrl.length > 0)
        domainName = new URL(ogUrl).hostname.replace("www.", "");
    return domainName;
};
const getLinkPreview = (html, url) => __awaiter(void 0, void 0, void 0, function* () {
    const $ = cheerio.load(html);
    const title = getTitle($);
    const description = getDescription($);
    const image = yield getImage($);
    const domain = getDomain($, url);
    const linkPreview = { title, description, image, domain };
    return linkPreview;
});
exports.getLinkPreview = getLinkPreview;
//# sourceMappingURL=link-preview.js.map