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
exports.getImageBufferFromUrl = exports.isHtml = exports.isImage = void 0;
const isImage = (contentType) => contentType.startsWith("image/jpeg") ||
    contentType.startsWith("image/png") ||
    contentType.startsWith("image/gif") ||
    contentType.startsWith("image/webp") ||
    contentType.startsWith("image/avif") ||
    contentType.startsWith("image/heic");
exports.isImage = isImage;
const isHtml = (contentType) => contentType.startsWith("text/html");
exports.isHtml = isHtml;
const getImageBufferFromUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(url);
        if (!response.ok)
            return null;
        // check if response has content-type
        const contentType = response.headers.get("content-type");
        if (!contentType)
            return null;
        // check if the content type is an image
        const isSupportedImage = (0, exports.isImage)(contentType);
        if (!isSupportedImage)
            return null;
        const buffer = yield response.arrayBuffer();
        return buffer;
    }
    catch (e) {
        console.log("error in getting image buffer", e);
        return null;
    }
});
exports.getImageBufferFromUrl = getImageBufferFromUrl;
//# sourceMappingURL=content-type.js.map