"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const is_user_authenticated_1 = require("../middlewares/is-user-authenticated");
const post_controller_1 = require("../controllers/post-controller");
const router = express_1.default.Router();
router.post("/save-post", is_user_authenticated_1.isUserAuthenticated, post_controller_1.savePost);
exports.default = router;
//# sourceMappingURL=post-routes.js.map