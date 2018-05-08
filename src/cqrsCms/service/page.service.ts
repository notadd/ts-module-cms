import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, Repository } from "typeorm";
import { PageContentEntity } from "../../entity/page.content.entity";
import { PageEntity } from "../../entity/page.entity";
import { PageClassifyEntity } from "../../entity/pageClassify.entity";
import { MessageCodeError } from "../errorMessage/error.interface";
import { ClassifyService } from "./classify.service";

@Component()
export class PageService {
    constructor(
        @InjectRepository(PageEntity) private readonly repository: Repository<PageEntity>,
        private readonly classifyService: ClassifyService,
        @InjectRepository(PageContentEntity) private readonly contentRepository: Repository<PageContentEntity>,
        @InjectRepository(PageClassifyEntity) private readonly pageRepository: Repository<PageClassifyEntity>,
    ) {
    }

    /**
     * 获取所有页面
     * @returns {Promise<Array<PageEntity>>}
     */
    async getAllPage(limit?: number, page?: number) {
        const result = await this.repository
            .createQueryBuilder()
            .orderBy("PageEntity.updateAt", "DESC")
            .skip(limit * (
                page - 1
            ))
            .take(limit)
            .getManyAndCount();
        const str: string = JSON.stringify(result);
        const num: string = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
        const pageEntitys: Array<PageEntity> = Array.from(
            JSON.parse(str.substring(str.indexOf("[") + 1, str.lastIndexOf(","))),
        );

        return { pages: pageEntitys, totalItems: Number(num) };
    }

    /**
     * 根据页面名称搜索
     * @param {string} keywords
     * @returns {Promise<Array<PageEntity>>}
     */
    async serachKeywords(keywords: string, limit?: number, page?: number) {
        const words = `%${keywords}%`;
        const result = await this.repository.createQueryBuilder()
            .where("\"title\"like :title", { title: words })
            .orderBy("PageEntity.updateAt", "DESC")
            .skip(limit * (
                page - 1
            )).take(limit).getManyAndCount();
        const str: string = JSON.stringify(result);
        const num: string = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
        const pageEntitys: Array<PageEntity> = Array.from(JSON.parse(str.substring(str.indexOf("[")
            + 1, str.lastIndexOf(","))));
        return { pages: pageEntitys, totalItems: Number(num) };
    }

    /**
     * 批量或者单个删除页面
     * @param {Array<number>} array
     * @returns {Promise<number>}
     */
    async deletePages(array: Array<number>, limit?: number, page?: number) {
        for (const t in array) {
            const page: PageEntity = await this.repository.findOneById(array[ t ]);
            if (page === null) { throw new MessageCodeError("delete:page:deleteById"); }
            await this.contentRepository.createQueryBuilder()
                .delete().from(PageContentEntity)
                .where("\"parentId\"= :parentId", { parentId: page.id }).execute();
            this.repository.deleteById(page.id);
        }
    }

    /**
     * 新增页面,别名不能重复
     * @param {PageEntity} page
     * @returns {Promise<Array<PageEntity>>}
     */
    async createPages(page: PageEntity, contents: Array<PageContentEntity>, limit?: number, pages?: number) {
        if (page.title === null) { throw new MessageCodeError("create:page:missingTitle"); }
        if (page.alias === null) { throw new MessageCodeError("create:page:missingAlias"); }
        const entity: PageClassifyEntity = await this.classifyService.findOneByIdPage(page.classifyId);
        if (page.classifyId !== null && page.classifyId !== 0 && entity === null) {
            throw new MessageCodeError("page:classify:classifyIdMissing");
        }
        if (entity === null) { throw new MessageCodeError("update:classify:updateById"); }
        const aliasEntity: Array<PageEntity> = await this.repository.createQueryBuilder().where(
            "\"alias\"= :alias",
            { alias: page.alias },
        ).getMany();
        if (aliasEntity.length > 0) { throw new MessageCodeError("create:classify:aliasRepeat"); }
        const id: number = await this.repository.save(page).then(a => {
            return a.id;
        });
        for (const t in contents) {
            let newContent: PageContentEntity = new PageContentEntity();
            newContent = contents[ t ];
            newContent.parentId = id;
            await this.contentRepository.save(newContent);
        }
    }

    /**
     * 基本校验
     * @param {string} alias
     * @param {number} classifyId
     * @returns {Promise<void>}
     */
    async curdCheck(aliasName?: string, classifyId?: number) {
        let result: string;
        let update = true;
        if (aliasName) {
            const aliasEntity: Array<PageEntity> = await this.repository.createQueryBuilder()
                .where("\"alias\"= :alias", { alias: aliasName }).getMany();
            if (aliasEntity.length > 0) { result = "别名不能重复"; }
            update = false;
        }
        if (classifyId) {
            const entity: PageClassifyEntity = await this.classifyService.findOneByIdPage(classifyId);
            if (entity === null) { result = "对应分类不存在"; }
            update = false;
        }
        if (!result) {
            update = true;
        }
        return { MessageCodeError: result, Continue: update };
    }

    /**
     * 修改页面,别名不可重复
     * @param {PageEntity} page
     *
     * @returns {Promise<Array<PageEntity>>}
     */
    async updatePages(page: PageEntity, content: Array<PageContentEntity>, limit?: number, pages?: number) {
        const entityPage: PageEntity = await this.repository.findOneById(page.id);
        if (entityPage === null) {
            throw new MessageCodeError("delete:page:deleteById");
        }
        const aliasEntity: Array<PageEntity> = await this.repository.createQueryBuilder().where(
            "\"alias\"= :alias",
            { alias: page.alias },
        ).getMany();
        if (aliasEntity.length > 0) {
            throw new MessageCodeError("create:classify:aliasRepeat");
        }
        const entity: PageClassifyEntity = await this.classifyService.findOneByIdPage(page.classifyId);
        if (page.classifyId !== null && page.classifyId !== 0 && entity === null) {
            throw new MessageCodeError("page:classify:classifyIdMissing");
        }
        page.updateAt = new Date();
        for (const t in content) {
            if (content[ t ].id === 0) {
                let newContent: PageContentEntity = new PageContentEntity();
                newContent = content[ t ];
                newContent.parentId = page.id;
                await this.contentRepository.insert(newContent);
            } else {
                let newContent: PageContentEntity = new PageContentEntity();
                newContent = content[ t ];
                newContent.parentId = page.id;
                newContent.updateAt = new Date();
                await this.contentRepository.updateById(newContent.id, newContent);
            }
        }
        if (page.alias === undefined || page.alias === null) { page.alias = entityPage.alias; }
        if (page.title === null || page.title === undefined) { page.title = entityPage.title; }
        if (page.classifyId === null || page.classifyId === undefined) { page.classifyId = entityPage.classifyId; }
        if (page.classify === null || page.classify === undefined) { page.classify = entityPage.classify; }
        try {
            await this.repository.updateById(entityPage.id, page);
        } catch (error) {
            throw new MessageCodeError("dataBase:curd:error");
        }
    }

    /**
     * 根据id查找页面及对应内容
     * @param {number} id
     * @returns {Promise<PageEntity>}
     */
    async findPageById(id: number): Promise<PageEntity> {
        return this.repository.findOneById(id, { relations: [ "contents" ] });
    }

    /**
     * 通过分类id查找页面
     * @param {number} id
     * @param {number} limit
     * @returns {Promise<Array<PageEntity>>}
     */
    async findPageByClassifyId(id: number, limit?: number, page?: number) {
        const entityClassify: PageClassifyEntity = await this.classifyService.findOnePageClassifyById(id);
        if (entityClassify === null) { throw new MessageCodeError("delete:page:deleteById"); }
        const array: Array<number> = await this.getClassifyId(id).then(a => {
            return a;
        });
        array.push(id);
        const newArray: Array<number> = Array.from(new Set(array));
        const result = await this.repository.createQueryBuilder()
            .where("\"classifyId\" in (:id)", { id: newArray })
            .orderBy("PageEntity.updateAt", "DESC").skip(limit * (
                page - 1
            )).take(limit).getManyAndCount();
        const str: string = JSON.stringify(result);
        const num: string = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
        const pageEntities: Array<PageEntity> = Array.from(JSON.parse(str.substring(str.indexOf("[")
            + 1, str.lastIndexOf(","))));
        return { pages: pageEntities, totalItems: Number(num) };
    }

    /**
     * 获取子级分类
     * @param {number} id
     * @returns {Promise<Array<number>>}
     */
    async getClassifyId(idNum: number): Promise<Array<number>> {
        await getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
        const result = await this.pageRepository.createQueryBuilder("page_classify_table")
            .where("page_classify_table.id= :id", { id: idNum })
            .innerJoinAndSelect("page_classify_table.children", "children")
            .orderBy("page_classify_table.id").getMany();
        const firstArray: Array<PageClassifyEntity> = result;
        const array: Array<number> = [];
        for (const t in firstArray) {
            array.push(firstArray[ t ].id);
            if (firstArray[ t ].children.length > 0) {
                for (const h in firstArray[ t ].children) {
                    array.push(firstArray[ t ].children[ h ].id);
                    array.push(...await this.getClassifyId(firstArray[ t ].children[ h ].id));
                }
            }
        }
        return array;
    }
}
