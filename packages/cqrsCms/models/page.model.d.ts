import { AggregateRoot } from "@nestjs/cqrs";
import { ArticleCurdVm } from "./view/article-curd.vm";
import { ClassifyCurdVm } from "./view/classify-curd.vm";
import { CreatePageVm } from "./view/create-page.vm";
export declare class Page extends AggregateRoot {
    private readonly id;
    constructor(id: string);
    createPage(data: CreatePageVm): void;
    createClassify(data: ClassifyCurdVm): void;
    createArticle(data: ArticleCurdVm): void;
}
