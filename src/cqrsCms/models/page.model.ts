import { AggregateRoot } from "@nestjs/cqrs";
import { ArticleCurdEvents } from "../events/impl/article-curd.events";
import { ClassifyCurdEvents } from "../events/impl/classify-curd.events";
import { PageCurdEvent } from "../events/impl/page-curd.event";
import { SitemapUpdateEvent } from "../events/impl/sitemap-update.event";
import { ArticleCurdVm } from "./view/article-curd.vm";
import { ClassifyCurdVm } from "./view/classify-curd.vm";
import { CreatePageVm } from "./view/create-page.vm";

export class Page extends AggregateRoot {
    constructor(private readonly id: string) {
        super();
    }

    /*页面*/
    createPage(data: CreatePageVm) {
        this.apply(new PageCurdEvent(data));
        this.apply(new SitemapUpdateEvent("0"));
    }

    /*分类*/
    createClassify(data: ClassifyCurdVm) {
        this.apply(new ClassifyCurdEvents(data));
    }

    /*文章*/
    createArticle(data: ArticleCurdVm) {
        this.apply(new ArticleCurdEvents(data));
        this.apply(new SitemapUpdateEvent("0"));
    }
}
