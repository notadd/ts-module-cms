"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const article_curd_handler_1 = require("./article-curd.handler");
const classify_curd_handler_1 = require("./classify-curd.handler");
const page_curd_handler_1 = require("./page-curd.handler");
const sitemap_create_handler_1 = require("./sitemap-create.handler");
const sitemap_update_handler_1 = require("./sitemap-update.handler");
exports.EventHandlers = [
    sitemap_create_handler_1.SitemapCreateHandler,
    sitemap_update_handler_1.SitemapUpdateHandler,
    page_curd_handler_1.PageCurdHandle,
    classify_curd_handler_1.ClassifyCurdEvent,
    article_curd_handler_1.ArticleCurdEvent,
];

//# sourceMappingURL=index.js.map
