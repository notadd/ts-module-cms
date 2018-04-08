import { ArticleCurdHandler } from "./article-curd.handler";
import { ClassifyCurdHandler } from "./classify-curd.handler";
import { CreateSitemapHandler } from "./create-sitemap.handler";
import { GetClassifyHandler } from "./get-classify.handler";
import { GetPageHandler } from "./get-page.handler";
import { CreatePageHandler } from "./page-curd.handler";
import { UpdateSitemapHandler } from "./update-sitemap.handler";

export const CommandHandlers = [ CreatePageHandler, CreateSitemapHandler,
    UpdateSitemapHandler, GetPageHandler, ClassifyCurdHandler, ArticleCurdHandler
    , GetClassifyHandler ];
