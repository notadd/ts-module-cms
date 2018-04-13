import { Repository } from "typeorm";
import { PageContentEntity } from "../../entity/page.content.entity";
import { PageEntity } from "../../entity/page.entity";
import { PageClassifyEntity } from "../../entity/pageClassify.entity";
import { ClassifyService } from "./classify.service";
export declare class PageService {
    private readonly repository;
    private readonly classifyService;
    private readonly contentRepository;
    private readonly pageRepository;
    constructor(repository: Repository<PageEntity>, classifyService: ClassifyService, contentRepository: Repository<PageContentEntity>, pageRepository: Repository<PageClassifyEntity>);
    getAllPage(limit?: number, page?: number): Promise<{
        pages: PageEntity[];
        totalItems: number;
    }>;
    serachKeywords(keywords: string, limit?: number, page?: number): Promise<{
        pages: PageEntity[];
        totalItems: number;
    }>;
    deletePages(array: Array<number>, limit?: number, page?: number): Promise<void>;
    createPages(page: PageEntity, contents: Array<PageContentEntity>, limit?: number, pages?: number): Promise<void>;
    curdCheck(aliasName?: string, classifyId?: number): Promise<{
        MessageCodeError: string;
        Continue: boolean;
    }>;
    updatePages(page: PageEntity, content: Array<PageContentEntity>, limit?: number, pages?: number): Promise<void>;
    findPageById(id: number): Promise<PageEntity>;
    findPageByClassifyId(id: number, limit?: number, page?: number): Promise<{
        pages: PageEntity[];
        totalItems: number;
    }>;
    getClassifyId(idNum: number): Promise<Array<number>>;
}
