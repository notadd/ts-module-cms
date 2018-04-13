import { ArticleEntity } from "../entity/article.entity";
import { PagerService } from "../export/common.paging";
import { CqrsService } from "./cqrs.service";
import { CreateXmlVm } from "./models/view/create-xml-vm";
import { ClassifyService } from "./service/classify.service";
export declare class CqrsResolver {
    private readonly classifyService;
    private readonly sitemapService;
    private readonly pagerService;
    constructor(classifyService: ClassifyService, sitemapService: CqrsService, pagerService: PagerService);
    createFile(obj: any, arg: any): Promise<any>;
    updateFile(obj: any, arg: any): Promise<CreateXmlVm>;
    getArticlesLimit(obj: any, body: {
        getArticleAll: {
            hidden: boolean;
            limitNum: number;
            pages: number;
        };
        recycleFind: {
            limitNum: number;
            pages: number;
        };
        reductionGetByClassifyId: {
            id: number;
            limitNum: number;
            pages: number;
        };
        findTopPlace: {
            limitNum: number;
            pages: number;
        };
        serachArticle: {
            keyWords: string;
            classifyId: number;
            topPlace: boolean;
            limitNum: number;
            pages: number;
        };
        keywordSearch: {
            keyWords: string;
            limitNum: number;
            pages: number;
        };
    }): Promise<{
        pagination: {
            totalItems: number;
            currentPage: number;
            pageSize: number;
            totalPages: number;
            startPage: number;
            endPage: number;
            startIndex: number;
            endIndex: number;
            pages: any;
        };
        articles: ArticleEntity[];
    }>;
    getArticlesNoLimit(obj: any, body: {
        getArticleById: {
            id: number;
        };
        showNext: {
            id: number;
        };
        superiorArticle: {
            id: number;
        };
        getCurrentClassifyArticles: {
            id: number;
        };
    }): Promise<ArticleEntity[]>;
    getClassifys(obj: any, body: {
        getAllClassify: {
            useFor: string;
            id: number;
        };
    }): any;
    getClassifyById(obj: any, body: {
        getClassifyById: {
            useFor: string;
            id: number;
        };
    }): Promise<any>;
    getPagesLimit(obj: any, arg: any): Promise<{
        pagination: {
            totalItems: number;
            currentPage: number;
            pageSize: number;
            totalPages: number;
            startPage: number;
            endPage: number;
            startIndex: number;
            endIndex: number;
            pages: any;
        };
        pages: any;
    }>;
    getPageById(obj: any, arg: any): Promise<any>;
    ArticleCU(obj: any, arg: any): Promise<string>;
    ClassifyCU(obj: any, arg: any): Promise<string>;
    PageCUD(obj: any, arg: any): Promise<string>;
    objToStrMap(obj: any): Map<string, string>;
}
