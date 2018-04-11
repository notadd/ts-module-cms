import { ArticleEntity } from "../../../entity/article.entity";
export declare class ArticleCurdVm {
    createArticle?: {
        article: ArticleEntity;
    };
    updateArticle?: {
        article: ArticleEntity;
    };
    deleteById?: Array<number>;
    recycleDelete?: Array<number>;
    reductionArticle?: Array<number>;
    getAllArticles?: boolean;
    limitNum?: number;
    pages?: number;
    getArticles?: {
        getArticleAll?: boolean;
        recycleFind?: boolean;
        reductionGetByClassifyId?: number;
        getArticleByClassifyId?: {
            classifyId: number;
            top: boolean;
            name?: string;
        };
        findTopPlace?: boolean;
        showNext?: number;
        getArticleById?: number;
        superiorArticle?: number;
        getCurrentClassifyArticles?: number;
        hidden?: boolean;
        findTopPlace3?: {
            classifyId: number;
            top: boolean;
        };
        keywordSearch?: {
            keywords: string;
        };
    };
    pictureUpload?: {
        id?: number;
        bucketName: string;
        rawName: string;
        base64: string;
        url: any;
    };
    hidden?: boolean;
}
