import { Repository } from "typeorm";
import { ArticleEntity } from "../../entity/article.entity";
import { ClassifyEntity } from "../../entity/classify.entity";
import { PageEntity } from "../../entity/page.entity";
import { PageClassifyEntity } from "../../entity/pageClassify.entity";
export declare class ClassifyService {
    private readonly repository;
    private readonly artRepository;
    private readonly pageRepository;
    private readonly repositoryPage;
    constructor(repository: Repository<ClassifyEntity>, artRepository: Repository<ArticleEntity>, pageRepository: Repository<PageClassifyEntity>, repositoryPage: Repository<PageEntity>);
    createClassifyArt(entity: ClassifyEntity, limit?: number): Promise<Array<ClassifyEntity>>;
    createClassifyPage(entity: PageClassifyEntity, limit?: number): Promise<Array<PageClassifyEntity>>;
    updateClassifyArt(entity: ClassifyEntity, id?: number): Promise<Array<ClassifyEntity>>;
    updateClassifyPage(entity: PageClassifyEntity, id?: number): Promise<Array<PageClassifyEntity>>;
    findAllClassifyArt(idNum: number): Promise<Array<ClassifyEntity>>;
    findAllClassifyPage(idNum: number): Promise<Array<PageClassifyEntity>>;
    Pagerecursion(id: number, listFirst: Array<PageClassifyEntity>): Promise<Array<PageClassifyEntity>>;
    Artrecursion(id: number, listFirst: Array<ClassifyEntity>): Promise<Array<ClassifyEntity>>;
    deleteClassifyArt(id: number, result: Array<ClassifyEntity>): Promise<Array<number>>;
    deleteMethodFirst(id: number): Promise<ClassifyEntity[]>;
    deleteMethodSecond(id: number): Promise<Array<PageClassifyEntity>>;
    deleteClassifyPage(id: number, result: Array<PageClassifyEntity>): Promise<Array<number>>;
    updateArticleClassify(classifyArray: Array<number>, useFor: string): Promise<void>;
    findOneByIdArt(id: number): Promise<ClassifyEntity>;
    findOneByIdPage(id: number): Promise<PageClassifyEntity>;
    showNextTitle(id: number): Promise<{
        articles: ArticleEntity[];
    }>;
    showBeforeTitle(id: number): Promise<{
        articles: ArticleEntity[];
    }>;
    showCurrentArticles(idNum: number): Promise<{
        articles: ArticleEntity[];
    }>;
    getArticelsByClassifyId(id: number, limit?: number, show?: boolean, pages?: number, name?: string): Promise<{
        articles: ArticleEntity[];
        totalItems: number;
    }>;
    Fenji(art: Array<ArticleEntity>, limit?: number, pages?: number): Promise<Array<ArticleEntity>>;
    getClassifyIdForArt(): Promise<number[]>;
    getClassifyId(idNum: number): Promise<Array<number>>;
    getClassifyIdPage(idNum: number): Promise<Array<number>>;
    findLevel(id: number): Promise<number>;
    showClassifyLevel(arr: Array<ClassifyEntity>, id: number, level: number): Promise<ClassifyEntity[]>;
    interfaceChange(level?: number): string;
    mobileClassifyArt(id: number, groupId: number): Promise<Array<ClassifyEntity>>;
    resetTheSetTop(arr: Array<number>): Promise<void>;
    mobileClassifyPage(id: number, groupId: number): Promise<Array<PageClassifyEntity>>;
    findOnePageClassifyById(id: number): Promise<PageClassifyEntity>;
    findTheDefaultByAlias(alias: string, useFor: string): Promise<number>;
    classifyTopPlace(id: number, display?: Array<number>): Promise<number>;
    findClassifyById(useFor: string, id: number): Promise<{
        classifyEntity: any;
        MessageCodeError: any;
    }>;
    TimestampArt(art: Array<ArticleEntity>): Promise<ArticleEntity[]>;
    classifyCheck(useFor: string, id?: number, groupId?: number, alias?: string, deleteNum?: number): Promise<{
        MessageCodeError: any;
        Continue: boolean;
    }>;
}
