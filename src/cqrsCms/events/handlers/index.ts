import { ArticleCurdEvent } from "./article-curd.handler";
import { ClassifyCurdEvent } from "./classify-curd.handler";
import { PageCurdHandle } from "./page-curd.handler";
import { SitemapCreateHandler } from "./sitemap-create.handler";
import { SitemapUpdateHandler } from "./sitemap-update.handler";

export const EventHandlers = [
    SitemapCreateHandler,
    SitemapUpdateHandler,
    PageCurdHandle,
    ClassifyCurdEvent,
    ArticleCurdEvent,
];
