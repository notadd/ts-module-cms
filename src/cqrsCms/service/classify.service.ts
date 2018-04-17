import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getManager, Repository } from "typeorm";
import { isNumber } from "util";
import { ArticleEntity } from "../../entity/article.entity";
import { ClassifyEntity } from "../../entity/classify.entity";
import { PageEntity } from "../../entity/page.entity";
import { PageClassifyEntity } from "../../entity/pageClassify.entity";
import { MessageCodeError } from "../errorMessage/error.interface";

@Component()
export class ClassifyService {
    constructor(
        @InjectRepository(ClassifyEntity) private readonly repository: Repository<ClassifyEntity>,
        @InjectRepository(ArticleEntity) private readonly artRepository: Repository<ArticleEntity>,
        @InjectRepository(PageClassifyEntity) private readonly pageRepository: Repository<PageClassifyEntity>,
        @InjectRepository(PageEntity) private readonly repositoryPage: Repository<PageEntity>,
    ) {
    }

    /**
     * 新增文章分类
     * @param {ClassifyEntity} entity
     * @param {string} parent
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    async createClassifyArt(entity: ClassifyEntity, limit?: number): Promise<Array<ClassifyEntity>> {
        const firstClass: Array<ClassifyEntity> = await this.repository.find();
        if (firstClass.length === 0) {
            const newClassify = new ClassifyEntity();
            newClassify.groupId = undefined;
            newClassify.classifyAlias = "无";
            newClassify.title = "无";
            const id = await this.repository
                .createQueryBuilder()
                .insert()
                .into(ClassifyEntity)
                .values(newClassify)
                .output("id")
                .execute();
            const str: string = JSON.stringify(id).split(":")[ 1 ];
            const numb: string = str.substring(0, str.lastIndexOf("}"));
            const newId: number = Number(numb);
            entity.groupId = newId;
            await this.repository.insert(entity);
        } else {
            const newClassify: Array<ClassifyEntity> = await this.repository.createQueryBuilder().where(
                "\"classifyAlias\"= :classifyAlias",
                { classifyAlias: -entity.classifyAlias },
            ).getMany();
            /*别名不能重复*/
            if (newClassify.length > 0) throw new MessageCodeError("create:classify:aliasRepeat");
            const parentClassify: ClassifyEntity = await this.repository.findOneById(entity.groupId);
            /*通过父级id确定父级是否存在*/
            if (entity.groupId !== 0 && parentClassify === null) {
                throw new MessageCodeError("create:classify:parentIdMissing");
            }
            const first: ClassifyEntity = await this.repository.findOneById(1);
            if (entity.groupId === 0 && first === null) {
                entity.groupId = undefined;
            } else if (entity.groupId === 0) {
                entity.groupId = 1;
            }
            const classify: ClassifyEntity = entity;
            await this.repository.insert(classify);
        }

        return this.findAllClassifyArt(limit);
    }

    /**
     * 新增页面分类
     * @param {PageClassifyEntity} entity
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    async createClassifyPage(entity: PageClassifyEntity, limit?: number): Promise<Array<PageClassifyEntity>> {
        const firstClass: Array<PageClassifyEntity> = await this.pageRepository.find();
        if (firstClass.length === 0) {
            const newClassify = new PageClassifyEntity();
            newClassify.groupId = undefined;
            newClassify.classifyAlias = "无";
            newClassify.title = "无";
            const id = await this.pageRepository
                .createQueryBuilder()
                .insert()
                .into(PageClassifyEntity)
                .values(newClassify)
                .output("id")
                .execute();
            const str: string = JSON.stringify(id).split(":")[ 1 ];
            const numb: string = str.substring(0, str.lastIndexOf("}"));
            const newId: number = Number(numb);
            entity.groupId = newId;
            await this.pageRepository.insert(entity);
        } else {
            const newClassify: Array<PageClassifyEntity> = await this.pageRepository
                .createQueryBuilder()
                .where(
                    "\"classifyAlias\"= :classifyAlias",
                    { classifyAlias: -entity.classifyAlias },
                )
                .getMany();
            /*别名不能重复*/
            if (newClassify.length > 0) throw new MessageCodeError("create:classify:aliasRepeat");
            const parentClassify: PageClassifyEntity = await this.pageRepository.findOneById(entity.groupId);
            /*通过父级id确定父级是否存在*/
            if (entity.groupId !== 0 && entity.groupId !== null && parentClassify === null) {
                throw new MessageCodeError("create:classify:parentIdMissing");
            }
            const first: PageClassifyEntity = await this.pageRepository.findOneById(1);
            if (entity.groupId === 0 && first === null) {
                entity.groupId = undefined;
            } else if (entity.groupId === 0) {
                entity.groupId = 1;
            }
            const classify: PageClassifyEntity = entity;
            await this.pageRepository.insert(classify);
        }

        return this.findAllClassifyPage(limit);
    }

    /**
     * 修改文章分类
     * @param {ClassifyEntity} entity
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    async updateClassifyArt(entity: ClassifyEntity, id?: number): Promise<Array<ClassifyEntity>> {
        /*当前Id是否存在*/
        const classify: ClassifyEntity = await this.repository.findOneById(entity.id);
        if (classify === null) throw new MessageCodeError("update:classify:updateById");
        if (entity.classifyAlias !== classify.classifyAlias) {
            const newClassify: Array<ClassifyEntity> = await this.repository
                .createQueryBuilder()
                .where(
                    "\"classifyAlias\"= :classifyAlias",
                    { classifyAlias: entity.classifyAlias },
                )
                .getMany();
            /*别名不能重复*/
            if (newClassify.length > 0) throw new MessageCodeError("create:classify:aliasRepeat");
        }
        if (isNumber(entity.groupId)) {
            const parentClassify: ClassifyEntity = await this.repository.findOneById(entity.groupId);
            /*通过父级别名确定父级是否存在*/
            if (parentClassify === null) throw new MessageCodeError("create:classify:parentIdMissing");
        }
        entity.updateAt = new Date();
        const finalClassify: ClassifyEntity = entity;
        await this.repository.updateById(entity.id, finalClassify);

        return this.findAllClassifyArt(id);
    }

    /**
     * 修改页面分类
     * @param {PageClassifyEntity} entity
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    async updateClassifyPage(entity: PageClassifyEntity, id?: number): Promise<Array<PageClassifyEntity>> {
        const classify: PageClassifyEntity = await this.pageRepository.findOneById(entity.id);
        if (classify === null) throw new MessageCodeError("update:classify:updateById");
        if (entity.classifyAlias !== classify.classifyAlias) {
            const newClassify: Array<PageClassifyEntity> = await this.pageRepository
                .createQueryBuilder()
                .where(
                    "\"classifyAlias\"= :classifyAlias",
                    { classifyAlias: entity.classifyAlias },
                )
                .getMany();
            /*别名不能重复*/
            if (newClassify.length > 0) throw new MessageCodeError("create:classify:aliasRepeat");
        }
        if (isNumber(entity.groupId)) {
            const parentClassify: PageClassifyEntity = await this.pageRepository.findOneById(entity.groupId);
            /*通过父级别名确定父级是否存在*/
            if (parentClassify === null) throw new MessageCodeError("create:classify:parentIdMissing");
        }
        entity.updateAt = new Date();
        await this.pageRepository.updateById(entity.id, entity);
        return this.findAllClassifyPage(id);
    }

    /**
     * 查找文章所有分类
     * @param {number} id
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    async findAllClassifyArt(idNum: number): Promise<Array<ClassifyEntity>> {
        const idFindOne: ClassifyEntity = await this.repository
            .createQueryBuilder()
            .where(
                "\"id\"= :id",
                { id: idNum },
            )
            .getOne();
        if (idFindOne) {
            const list: Array<ClassifyEntity> = await this.repository
                .createQueryBuilder()
                .where(
                    "\"groupId\"= :groupId",
                    { groupId: idNum },
                )
                .orderBy("id", "ASC")
                .getMany();
            const result: Array<ClassifyEntity> = [];
            const resultArray: Array<ClassifyEntity> = await this.Artrecursion(idNum, list);
            idFindOne.children = resultArray;
            const newPageClassify: ClassifyEntity = idFindOne;
            result.push(newPageClassify);
            return result;
        } else {
            const newArt: Array<ClassifyEntity> = await this.repository.find();
            return newArt;
        }

    }

    /**
     * 查找页面所有分类
     * @returns {Promise<Array<PageClassifyEntity>>}
     */
    async findAllClassifyPage(idNum: number): Promise<Array<PageClassifyEntity>> {
        const idFindOne: PageClassifyEntity = await this.pageRepository
            .createQueryBuilder()
            .where(
                "\"id\"= :id",
                { id: idNum },
            )
            .getOne();
        if (idFindOne) {
            const list: Array<PageClassifyEntity> = await this.pageRepository
                .createQueryBuilder()
                .where(
                    "\"groupId\"= :id",
                    { id: idNum },
                )
                .orderBy("id", "ASC")
                .getMany();
            const result: Array<PageClassifyEntity> = [];
            const resultArray: Array<PageClassifyEntity> = await this.Pagerecursion(idNum, list);
            idFindOne.children = resultArray;
            const newPageClassify: PageClassifyEntity = idFindOne;
            result.push(newPageClassify);
            return result;
        } else {
            const newPage: Array<PageClassifyEntity> = await this.pageRepository.find();
            return newPage;
        }

    }

    /**
     * 页面无极限分类
     * @param {Array<ClassifyEntity>} entity
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    async Pagerecursion(id: number, listFirst: Array<PageClassifyEntity>): Promise<Array<PageClassifyEntity>> {
        const children: Array<PageClassifyEntity> = [];
        for (const t in listFirst) {
            const groupIdFirst: number = listFirst[ t ].id;
            let navigationArray = new PageClassifyEntity();
            navigationArray = listFirst[ t ];
            const listSecond: Array<PageClassifyEntity> = await this.pageRepository
                .createQueryBuilder()
                .where(
                    "\"groupId\"= :id",
                    { id: groupIdFirst },
                )
                .orderBy("id", "ASC")
                .getMany();
            if (listSecond.length > 0) {
                for (const h in listSecond) {
                    const theEnd: Array<PageClassifyEntity> = await this.Pagerecursion(listSecond[ h ].id, listSecond);
                    navigationArray.children = theEnd;
                }
            } else {
                navigationArray.children = [];
            }
            const navigationFinal: PageClassifyEntity = navigationArray;
            children.push(navigationFinal);
        }
        return children;
    }

    /**
     * 文章无极限分类
     * @param {number} id
     * @param {Array<ClassifyEntity>} listFirst
     * @returns {Promise<Array<ClassifyEntity>>}
     * @constructor
     */
    async Artrecursion(id: number, listFirst: Array<ClassifyEntity>): Promise<Array<ClassifyEntity>> {
        const children: Array<ClassifyEntity> = [];
        for (const t in listFirst) {
            const groupIdFirst: number = listFirst[ t ].id;
            let navigationArray = new ClassifyEntity();
            navigationArray = listFirst[ t ];
            const listSecond: Array<ClassifyEntity> = await this.repository
                .createQueryBuilder()
                .where(
                    "\"groupId\"= :id",
                    { id: groupIdFirst },
                )
                .orderBy("id", "ASC")
                .getMany();
            if (listSecond.length > 0) {
                for (const h in listSecond) {
                    const theEnd: Array<ClassifyEntity> = await this.Artrecursion(listSecond[ h ].id, listSecond);
                    navigationArray.children = theEnd;
                }
            } else {
                navigationArray.children = [];
            }
            const navigationFinal: ClassifyEntity = navigationArray;
            children.push(navigationFinal);
        }
        return children;
    }

    /**
     * 通过Id删除文章分类及对应的子分类
     * @param {number} id
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    async deleteClassifyArt(id: number, result: Array<ClassifyEntity>): Promise<Array<number>> {
        const deleteArray: Array<number> = [];
        for (const t in result) {
            const num = result[ t ].id;
            if (num === id) {
                deleteArray.push(id);
                const array: Array<ClassifyEntity> = result[ t ].children;
                if (array.length > 0) {
                    for (const h in array) {
                        const numH = array[ h ].id;
                        deleteArray.push(numH);
                        await this.repository.deleteById(numH);
                        await this.deleteClassifyArt(numH, result);
                    }
                }
                await this.repository.deleteById(num);
            }
        }
        if (deleteArray.length === 0) {
            deleteArray.push(id);
        }
        /* this.updateArticleClassify(deleteArray,"art");*/
        await this.repository.deleteById(id);
        return deleteArray;

    }

    async deleteMethodFirst(id: number) {
        const classify: ClassifyEntity = await this.repository.findOneById(id);
        if (classify === null) throw new MessageCodeError("update:classify:updateById");
        await getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
        const result = await this.repository
            .createQueryBuilder("article_classify_table")
            .innerJoinAndSelect("article_classify_table.children", "children")
            .orderBy("article_classify_table.id")
            .getMany();
        const resultArray: Array<ClassifyEntity> = result;
        await getManager().query("update public.article_classify_table set \"parentId\" = null");
        const array: Array<number> = await this.getClassifyId(id);
        array.push(id);
        const newArray: Array<number> = Array.from(new Set(array));
        const artiicles: Array<ArticleEntity> = await this.artRepository
            .createQueryBuilder()
            .where(
                "\"classifyId\" in (:id)",
                { id: newArray },
            )
            .getMany();
        if (artiicles.length > 0) throw new MessageCodeError("delete:art:ClassifyIdIncludeArts");
        const res: Array<number> = await this.deleteClassifyArt(id, result);
        return this.findAllClassifyArt(1);
    }

    /**
     * 通过id删除页面分类及对应的子分类
     * @param {number} id
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    async deleteMethodSecond(id: number): Promise<Array<PageClassifyEntity>> {
        const classify: PageClassifyEntity = await this.pageRepository.findOneById(id);
        if (classify === null) throw new MessageCodeError("update:classify:updateById");
        await getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
        const result = await this.pageRepository
            .createQueryBuilder("page_classify_table")
            .innerJoinAndSelect(
                "page_classify_table.children",
                "children",
            )
            .orderBy("page_classify_table.id")
            .getMany();
        await getManager().query("update public.page_classify_table set \"parentId\"=null");
        const array: Array<number> = await this.getClassifyIdPage(id);
        array.push(id);
        const newArray: Array<number> = Array.from(new Set(array));
        const artiicles: Array<PageEntity> = await this.repositoryPage.createQueryBuilder().where(
            "\"classifyId\" in (:id)",
            { id: newArray },
        ).getMany();
        if (artiicles.length > 0) throw new MessageCodeError("delete:page:ClassifyIdIncludePages");
        const res: Array<number> = await this.deleteClassifyPage(id, result);

        return this.findAllClassifyPage(1);
    }

    /**
     * 页面删除分类
     * @param {number} id
     * @param {Array<ClassifyEntity>} result
     * @returns {Promise<Array<number>>}
     */
    async deleteClassifyPage(id: number, result: Array<PageClassifyEntity>): Promise<Array<number>> {
        const deleteArray: Array<number> = [];
        for (const t in result) {
            const num = result[ t ].id;
            if (num === id) {
                deleteArray.push(id);
                const array: Array<PageClassifyEntity> = result[ t ].children;
                if (array.length > 0) {
                    for (const h in array) {
                        const numH = array[ h ].id;
                        deleteArray.push(numH);
                        await this.pageRepository.deleteById(numH);
                        await this.deleteClassifyPage(numH, result);
                    }
                }
                await this.pageRepository.deleteById(num);
            }
        }
        if (deleteArray.length === 0) {
            deleteArray.push(id);
        }
        /*this.updateArticleClassify(deleteArray,"page");*/
        await this.pageRepository.deleteById(id);
        return deleteArray;
    }

    /**
     * 删除分类后，修改文章状态为默认分类。需要新建一个分类为默认
     * @param {Array<number>} classifyArray
     * @returns {Promise<void>}
     */
    async updateArticleClassify(classifyArray: Array<number>, useFor: string) {
        if (useFor === "art") {
            for (const t in classifyArray) {
                const article: Array<ArticleEntity> = await this.artRepository
                    .createQueryBuilder()
                    .where(
                        "\"classifyId\"= :classifyId",
                        { classifyId: classifyArray[ t ] },
                    )
                    .getMany();
                const id: number = await this.findTheDefaultByAlias("默认分类", "art");
                for (const h in article) {
                    const newArticle: ArticleEntity = article[ h ];
                    newArticle.classifyId = id;
                    newArticle.classify = "默认分类";
                    newArticle.updateAt = new Date();
                    this.artRepository.updateById(newArticle.id, newArticle);
                }
            }
        } else if (useFor === "page") {
            for (const t in classifyArray) {
                const article: Array<PageEntity> = await this.repositoryPage
                    .createQueryBuilder()
                    .where(
                        "\"classifyId\"= :classifyId",
                        { classifyId: classifyArray[ t ] },
                    )
                    .getMany();
                const id = await this.findTheDefaultByAlias("默认分类", "page");
                for (const h in article) {
                    const newArticle: PageEntity = article[ h ];
                    newArticle.classify = "默认分类";
                    newArticle.classifyId = id;
                    newArticle.updateAt = new Date();
                    this.repositoryPage.updateById(newArticle.id, newArticle);
                }
            }
        }
    }

    /**
     * 根据id查找文章分类
     * @param {number} id
     * @param {string} useFor
     * @returns {Promise<ClassifyEntity>}
     */
    async findOneByIdArt(id: number): Promise<ClassifyEntity> {
        const entity: ClassifyEntity = await this.repository.findOneById(id);

        return entity;
    }

    /**
     * 根据id查找页面分类
     * @param {number} id
     * @returns {Promise<PageClassifyEntity>}
     */
    async findOneByIdPage(id: number): Promise<PageClassifyEntity> {
        const entity: PageClassifyEntity = await this.pageRepository.findOneById(id);

        return entity;
    }

    /**
     * 显示子级分类文章
     * @param {number} id
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async showNextTitle(id: number) {
        const articleArray: Array<ArticleEntity> = [];
        const arrayNum: Array<number> = [];
        const classifications: Array<ClassifyEntity> = await this.repository
            .createQueryBuilder()
            .where("\"groupId\"= :groupId", {
                groupId: id,
            })
            .getMany();
        for (const t in classifications) {
            arrayNum.push(classifications[ t ].id);
        }
        for (const h in arrayNum) {
            const art: Array<ArticleEntity> = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\"= :classifyId",
                    {
                        classifyId: arrayNum[ h ],
                    },
                )
                .orderBy("ArticleEntity.id", "ASC")
                .getMany();
            articleArray.push(...art);
        }
        return { articles: articleArray };
    }

    /**
     * 显示上级置顶文章
     * @param {number} id
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async showBeforeTitle(id: number) {
        const classify: ClassifyEntity = await this.repository.findOneById(id);
        if (classify === null) throw new MessageCodeError("page:classify:classifyIdMissing");
        const articleArray: Array<ArticleEntity> = [];
        const currentArticle: Array<ArticleEntity> = await this.artRepository
            .createQueryBuilder()
            .where(
                "\"classifyId\"= :classifyId and \"topPlace\"=\'current\'",
                { classifyId: classify.groupId },
            )
            .orderBy("ArticleEntity.updateAt", "ASC")
            .getMany();
        articleArray.push(...currentArticle);
        const array: Array<number> = await this.getClassifyId(classify.groupId);
        array.push(id);
        const newArray: Array<number> = Array.from(new Set(array));
        const finalArray: Array<number> = [];
        for (const t in newArray) {
            if (newArray[ t ] !== classify.groupId) {
                finalArray.push(newArray[ t ]);
            }
        }
        const level: number = await this.findLevel(classify.groupId);
        if (level === 1) {
            const newArticles: Array<ArticleEntity> = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\" in (:id)",
                    { id: newArray },
                )
                .andWhere("\"topPlace\"= :topPlace", { topPlace: "level1" })
                .orderBy(
                    "ArticleEntity.updateAt",
                    "ASC",
                )
                .getMany();
            articleArray.push(...newArticles);
        } else if (level === 2) {
            const newArticles = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\" in (:id)",
                    { id: newArray },
                )
                .andWhere("\"topPlace\" :topPlace", { topPlace: "level2" })
                .orderBy(
                    "ArticleEntity.updateAt",
                    "ASC",
                )
                .getMany();
            articleArray.push(...newArticles);
        } else if (level === 3) {
            const newArticles = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\" in (:id)",
                    { id: newArray },
                )
                .andWhere("\"topPlace\" :topPlace", { topPlace: "level3" })
                .orderBy(
                    "ArticleEntity.updateAt",
                    "ASC",
                )
                .getMany();
            articleArray.push(...newArticles);
        }
        return { articles: articleArray };
    }

    /**
     * 当前分类文章
     * @param {number} id
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async showCurrentArticles(idNum: number) {
        const classify: ClassifyEntity = await this.repository.findOneById(idNum);
        if (classify === null) throw new MessageCodeError("page:classify:classifyIdMissing");
        const articleArray: Array<ArticleEntity> = [];
        const current: Array<ArticleEntity> = await this.artRepository.createQueryBuilder().where(
            "\"classifyId\"=:id",
            { id: idNum },
        ).orderBy("ArticleEntity.updateAt", "ASC").getMany();
        articleArray.push(...current);
        return { articles: articleArray };
    }

    /**
     * 通过分类id获取文章(包含置顶)
     * @param {number} id
     */
    async getArticelsByClassifyId(id: number, limit?: number, show?: boolean, pages?: number, name?: string) {
        const str = `%${name}%`;
        const articles: Array<ArticleEntity> = [];
        const entity: ClassifyEntity = await this.findOneByIdArt(id);
        if (entity === null) throw new MessageCodeError("page:classify:classifyIdMissing");
        let level: number = await this.findLevel(entity.id);
        const array: Array<number> = await this.getClassifyId(id).then(a => {
            return a;
        });
        array.push(id);
        const newArray: Array<number> = Array.from(new Set(array));
        /*置顶：无 获取对应关键字或分类 对应的文章,是：获取对应分类下，置顶到1、2 、 3级分类的文章,否：获取对应分类下置顶到4、 5 分类的文章*/
        if (show === true) {
            const global: Array<ArticleEntity> = [];
            const globalArts: Array<ArticleEntity> = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"topPlace\"= :topPlace",
                    { topPlace: "global" },
                )
                .andWhere("\"name\"like :name and recycling=false", { name: str })
                .orderBy(
                    "ArticleEntity.publishedTime",
                    "DESC",
                )
                .getMany();
            for (const t in globalArts) {
                if (globalArts[ t ].display !== null) {
                    const newArray: Array<string> = globalArts[ t ].display.split(",");
                    const num: number = newArray.indexOf(id.toString());
                    if (num < 0) {
                        global.push(globalArts[ t ]);
                    }
                } else {
                    global.push(globalArts[ t ]);
                }

            }
            articles.push(...global);
        }
        if (show === false) {
            const newArticles: Array<ArticleEntity> = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\" in( :id)",
                    { id: newArray },
                )
                .andWhere("\"topPlace\"=\"current\" or \"topPlace\"=\"cancel\"")
                .andWhere(
                    "\"name\"like :name",
                    { name: str },
                )
                .orderBy("ArticleEntity.publishedTime", "DESC")
                .getMany();
            articles.push(...newArticles);
            level = 5;
        }
        if (show === undefined) {
            level = 4;
        }
        if (level === 1) {
            const newArticles: Array<ArticleEntity> = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\" in ( :id)",
                    { id: newArray },
                )
                .andWhere("\"topPlace\"= :topPlace", { topPlace: "level1" })
                .andWhere(
                    "\"name\"like :name and recycling=false",
                    { name: str },
                )
                .orderBy("ArticleEntity.publishedTime", "DESC")
                .getMany();
            articles.push(...newArticles);
            const finalArticles: Array<ArticleEntity> = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\"= :classifyId  and \"topPlace\"<>\"global\"",
                    { classifyId: id },
                )
                .andWhere("\"name\"like :name and recycling=false", { name: str })
                .orderBy(
                    "ArticleEntity.publishedTime",
                    "DESC",
                )
                .getMany();
            articles.push(...finalArticles);
        } else if (level === 2) {
            const newArticles = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\" in ( :id)",
                    { id: newArray },
                )
                .andWhere("\"topPlace\"= :topPlace", { topPlace: "level2" })
                .andWhere(
                    "\"name\"like :name and recycling=false",
                    { name: str },
                )
                .orderBy("ArticleEntity.publishedTime", "DESC")
                .getMany();
            articles.push(...newArticles);
            const finalArticles: Array<ArticleEntity> = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\"= :classifyId and \"topPlace\"<>\"level1\" and \"topPlace\"<>\"global\"",
                    { classifyId: id },
                )
                .andWhere("\"name\"like :name and recycling=false", { name: str })
                .orderBy(
                    "ArticleEntity.publishedTime",
                    "DESC",
                )
                .getMany();
            articles.push(...finalArticles);
        } else if (level === 3) {
            const newArticles = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\" in (:id)",
                    { id: newArray },
                )
                .andWhere("\"topPlace\"= :topPlace", { topPlace: "level3" })
                .andWhere(
                    "\"name\"like :name and recycling=false",
                    { name: str },
                )
                .orderBy("ArticleEntity.publishedTime", "DESC")
                .getMany();
            articles.push(...newArticles);
            const finalArticles: Array<ArticleEntity> = await this.artRepository.createQueryBuilder().where(
                "\"classifyId\"= :classifyId and \"topPlace\"<>\"level2\" and \"topPlace\"<>\"global\"",
                { classifyId: id },
            ).andWhere("\"name\"like :name and recycling=false", { name: str }).orderBy(
                "ArticleEntity.publishedTime",
                "DESC",
            ).getMany();
            articles.push(...finalArticles);
        } else if (level === 4) {
            const newArticles = await this.artRepository
                .createQueryBuilder()
                .where(
                    "\"classifyId\" in ( :id) and recycling=false",
                    { id: newArray },
                )
                .andWhere("\"name\"like :name", { name: str })
                .orderBy("ArticleEntity.publishedTime", "DESC")
                .getMany();
            articles.push(...newArticles);
        }
        const num: number = articles.length;
        const returnArt: Array<ArticleEntity> = await this.Fenji(articles, limit, pages);
        return { articles: returnArt, totalItems: num };
    }

    async Fenji(art: Array<ArticleEntity>, limit?: number, pages?: number): Promise<Array<ArticleEntity>> {
        let newArt: Array<ArticleEntity> = [];
        if (limit) {
            newArt = art.splice(limit * (
                pages - 1
            ), limit);
        } else {
            newArt = art;
        }
        return newArt;

    }

    /**
     * 文章关键字搜索---对应资讯和活动
     * @returns {Promise<Array<number>>}
     */
    async getClassifyIdForArt() {
        const custom: Array<ClassifyEntity> = await this.repository.createQueryBuilder().where(
            "\"classifyAlias\"=\'活动\' or \"classifyAlias\"=\'资讯\'").getMany();
        let customArray: Array<number> = [];
        for (const t in custom) {
            customArray.push(custom[ t ].id);
            customArray.push(...await this.getClassifyId(custom[ t ].id).then(a => {
                return a;
            }));
        }
        customArray = Array.from(new Set(customArray));
        return customArray;
    }

    /**
     * 获取当前分类所有子分类id
     * @param {number} id
     * @returns {Promise<Array<number>>}
     */
    async getClassifyId(idNum: number): Promise<Array<number>> {
        await getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
        const entity: Array<ClassifyEntity> = await this.repository
            .createQueryBuilder()
            .where(
                "\"groupId\"= :groupId",
                { groupId: idNum },
            )
            .getMany();
        const array: Array<number> = [];
        if (entity.length > 0) {
            const result = await this.repository
                .createQueryBuilder("article_classify_table")
                .where(
                    "article_classify_table.id= :id",
                    { id: idNum },
                )
                .innerJoinAndSelect(
                    "article_classify_table.children",
                    "children",
                )
                .orderBy("article_classify_table.id").getMany();
            const firstArray: Array<ClassifyEntity> = result;
            for (const t in firstArray) {
                array.push(firstArray[ t ].id);
                if (firstArray[ t ].children.length > 0) {
                    for (const h in firstArray[ t ].children) {
                        array.push(firstArray[ t ].children[ h ].id);
                        array.push(...await this.getClassifyId(firstArray[ t ].children[ h ].id));
                    }
                }
            }
        }
        array.push(idNum);
        return array;
    }

    /**
     * 获取当前分类所有子分类id
     * @param {number} id
     * @returns {Promise<Array<number>>}
     */
    async getClassifyIdPage(idNum: number): Promise<Array<number>> {
        await getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
        const array: Array<number> = [];
        const entity: Array<PageClassifyEntity> = await this.pageRepository
            .createQueryBuilder()
            .where(
                "\"groupId\"= :groupId",
                { groupId: idNum },
            )
            .getMany();
        if (entity.length > 0) {
            const result = await this.pageRepository.createQueryBuilder("page_classify_table").where(
                "page_classify_table.id= :id",
                { id: idNum },
            ).innerJoinAndSelect("page_classify_table.children", "children").getMany();
            const firstArray: Array<PageClassifyEntity> = result;
            for (const t in firstArray) {
                array.push(firstArray[ t ].id);
                if (firstArray[ t ].children.length > 0) {
                    for (const h in firstArray[ t ].children) {
                        array.push(firstArray[ t ].children[ h ].id);
                        array.push(...await this.getClassifyIdPage(firstArray[ t ].children[ h ].id));
                    }
                }
            }
        }
        array.push(idNum);
        return array;
    }

    /**
     * 获取当前分类级别
     * @param {number} id
     * @returns {Promise<void>}
     */
    public async findLevel(id: number): Promise<number> {
        const arr: Array<ClassifyEntity> = await this.repository.find();
        const final: Array<ClassifyEntity> = await this.showClassifyLevel(arr, id, 0);
        let num: number;
        for (const t in final) {
            if (final[ t ].id === 1) {
                num = final[ t ].level;
            }
        }

        return num;
    }

    /**
     * 找出分类级别
     * @param {number} ids
     * @returns {Promise<number>}
     */
    public async showClassifyLevel(arr: Array<ClassifyEntity>, id: number, level: number) {
        const array: Array<ClassifyEntity> = [];
        for (const t in arr) {
            if (arr[ t ].id === id) {
                arr[ t ].level = level;
                const newClas: ClassifyEntity = arr[ t ];
                array.push(newClas);
                const arrayCla: Array<ClassifyEntity> = await this.showClassifyLevel(arr, arr[ t ].groupId, level + 1);
                array.push(...arrayCla);

            }
        }
        return array;
    }

    /**
     * 级别转换
     * @param {number} level
     * @returns {string}
     */
    public interfaceChange(level?: number): string {
        let finalLevel: string;
        if (level === 1) {
            finalLevel = "level1";
        } else if (level === 2) {
            finalLevel = "level2";
        } else if (level === 3) {
            finalLevel = "level3";
        } else if (level === 4) {
            finalLevel = "current";
        }
        return finalLevel;
    }

    /**
     * 文章分类移动
     * @param {number} id
     * @param {number} groupId
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    public async mobileClassifyArt(id: number, groupId: number): Promise<Array<ClassifyEntity>> {
        const classify: ClassifyEntity = await this.repository.findOneById(id);
        if (classify === null) throw new MessageCodeError("update:classify:updateById");
        if (groupId !== 0) {
            const parent: ClassifyEntity = await this.repository.findOneById(groupId);
            if (parent === null) throw new MessageCodeError("update:classify:updateById");
        }
        if (groupId === 0) {
            groupId = 1;
        }

        classify.groupId = groupId;
        const array: Array<number> = await this.getClassifyId(id).then(a => {
            return a;
        });
        array.push(id);
        const newArray: Array<number> = Array.from(new Set(array));
        this.resetTheSetTop(newArray);
        classify.updateAt = new Date();
        const newClassify: ClassifyEntity = classify;
        this.repository.updateById(newClassify.id, newClassify);
        return this.findAllClassifyArt(1);

    }

    /**
     * 重置置顶关系
     * @param {Array<number>} arr
     *
     * @returns {Promise<void>}
     */
    public async resetTheSetTop(arr: Array<number>) {
        const articles: Array<ArticleEntity> = await this.artRepository
            .createQueryBuilder()
            .where(
                "\"classifyId\" in ( :id)",
                { id: arr },
            )
            .getMany();
        for (const t in articles) {
            let arr = new ArticleEntity();
            arr = articles[ t ];
            arr.topPlace = "cancel";
            arr.updateAt = new Date();
            await this.artRepository.updateById(arr.id, arr);
        }
    }

    /**
     * 页面分类移动
     * @param {number} id
     * @param {number} groupId
     * @returns {Promise<Array<ClassifyEntity>>}
     */
    public async mobileClassifyPage(id: number, groupId: number): Promise<Array<PageClassifyEntity>> {
        const classify: PageClassifyEntity = await this.pageRepository.findOneById(id);
        if (classify === null) throw new MessageCodeError("update:classify:updateById");
        if (groupId !== 0) {
            const parent: PageClassifyEntity = await this.pageRepository.findOneById(groupId);
            if (parent === null) throw new MessageCodeError("update:classify:updateById");
        }
        if (groupId === 0) {
            groupId = 1;
        }
        classify.groupId = groupId;
        classify.updateAt = new Date();
        const newClassify: PageClassifyEntity = classify;
        this.pageRepository.updateById(newClassify.id, newClassify);

        return this.findAllClassifyPage(1);
    }

    /**
     * 根据分类id查找页面分类本身
     * @param {number} id
     * @returns {Promise<PageClassifyEntity>}
     */
    public async findOnePageClassifyById(id: number): Promise<PageClassifyEntity> {
        const final: PageClassifyEntity = await this.pageRepository.findOneById(id);

        return final;
    }

    /**
     * 判断默认分类是否存在
     * @param {string} Alias
     * @param {string} useFor
     * @returns {Promise<number>}
     */
    public async findTheDefaultByAlias(alias: string, useFor: string) {
        let numId = 0;
        if (useFor === "art") {
            const defaultArt: ClassifyEntity = await this.repository
                .createQueryBuilder()
                .where(
                    "\"classifyAlias\"= :classifyAlias",
                    { classifyAlias: alias },
                )
                .getOne();
            if (defaultArt === null) {
                const classify = new ClassifyEntity();
                classify.groupId = 1;
                classify.title = "默认分类";
                classify.classifyAlias = "默认分类";
                classify.describe = "默认分类";
                const result: string = await this.repository
                    .createQueryBuilder()
                    .insert()
                    .into(ClassifyEntity)
                    .values(classify)
                    .output("id")
                    .execute();
                const str: string = JSON.stringify(result);
                const newstr: string = str
                    .replace("{", "")
                    .replace("}", "")
                    .replace("[", "")
                    .replace("]", "");
                const finalStr: Array<string> = newstr
                    .replace("'", "")
                    .replace("'", "")
                    .split(":");
                numId = Number(finalStr[ 1 ]);
            } else {
                numId = defaultArt.id;
            }
        } else if (useFor === "page") {
            const defaultPage: PageClassifyEntity = await this.pageRepository
                .createQueryBuilder()
                .where(
                    "\"classifyAlias\"= :classifyAlias",
                    { classifyAlias: alias },
                )
                .getOne();
            if (defaultPage === null) {
                const classify = new PageClassifyEntity();
                classify.groupId = 1;
                classify.title = "默认分类";
                classify.classifyAlias = "默认分类";
                classify.describe = "默认分类";
                const result = await this.pageRepository
                    .createQueryBuilder()
                    .insert()
                    .into(PageClassifyEntity)
                    .values(classify)
                    .output("id")
                    .execute();
                const str: string = JSON.stringify(result);
                const newstr: string = str
                    .replace("{", "")
                    .replace("}", "")
                    .replace("[", "")
                    .replace("]", "");
                const finalStr: Array<string> = newstr
                    .replace("'", "")
                    .replace("'", "")
                    .split(":");
                numId = Number(finalStr[ 1 ]);
            } else {
                numId = defaultPage.id;
            }
        }
        return numId;
    }

    /**
     * 分类批量置顶到全局
     * @param {number} id
     * @returns {Promise<number>}
     */
    async classifyTopPlace(id: number, display?: Array<number>) {
        const entity: ClassifyEntity = await this.repository.findOneById(id);
        if (entity === null) throw new MessageCodeError("page:classify:classifyIdMissing");
        const array: Array<number> = await this.getClassifyId(id);
        array.push(id);
        const newArray: Array<number> = Array.from(new Set(array));
        let num = 0;
        const result: Array<ArticleEntity> = await this.artRepository
            .createQueryBuilder()
            .where(
                "\"classifyId\" in ( :id)",
                { id: newArray },
            )
            .andWhere("\"topPlace\"<> :topPlace", { topPlace: "global" })
            .getMany();
        const numArray: Array<number> = [];
        for (const t in display) {
            const array: Array<number> = await this.getClassifyId(display[ t ]);
            const newArray: Array<number> = Array.from(new Set(array));
            numArray.push(...newArray);
        }
        numArray.push(...display);
        const finalArray: Array<number> = Array.from(new Set(numArray));
        for (const t in result) {
            let newArt = new ArticleEntity();
            newArt = result[ t ];
            newArt.topPlace = "global";
            newArt.display = finalArray.toString();
            newArt.updateAt = new Date();
            this.artRepository.updateById(newArt.id, newArt);
            num++;
        }
        return num;
    }

    /**
     * 获取单个具体分类
     * @param {string} useFor
     * @param {number} id
     * @returns {Promise<{classify: any; MessageCodeError: any}>}
     */
    async findClassifyById(useFor: string, id: number) {
        let result, messageCodeError;
        const array: Array<number> = [];
        if (useFor === "art") {
            const entity: ClassifyEntity = await this.repository.findOneById(id);
            if (entity === null) messageCodeError = "当前分类不存在";
            array.push(id);
            array.push(entity.groupId);
            result = await this.repository
                .createQueryBuilder()
                .where("\"id\" in ( :id)", { id: array })
                .orderBy(
                    "id",
                    "ASC",
                )
                .getMany();
        }
        if (useFor === "page") {
            const entity: PageClassifyEntity = await this.pageRepository.findOneById(id);
            if (entity === null) messageCodeError = "当前分类不存在";
            array.push(id);
            array.push(entity.groupId);
            result = await this.pageRepository
                .createQueryBuilder()
                .where("\"id\" in ( :id)", { id: array })
                .orderBy(
                    "id",
                    "ASC",
                ).getMany();
        }
        if (result !== null) {
            messageCodeError = "查找成功";
        }
        return { classifyEntity: result, MessageCodeError: messageCodeError };
    }

    /**
     * 文章时间格式转化
     * @param {Array<ArticleEntity>} art
     * @returns {Promise<Article[]>}
     * @constructor
     */
    async TimestampArt(art: Array<ArticleEntity>) {
        const result: Array<ArticleEntity> = [];
        for (const t in art) {
            const classify: ClassifyEntity = await this.repository.findOneById(art[ t ].classifyId);
            art[ t ].classify = classify.title;
            result.push(art[ t ]);
        }

        return result;
    }

    /**
     *
     * @param {string} useFor
     * @param {number} id
     * @param {string} alias
     * @param {number} deleteNum
     * @returns {Promise<{MessageCodeError: any; Continue: boolean}>}
     */
    async classifyCheck(useFor: string, id?: number, groupId?: number, alias?: string, deleteNum?: number) {
        let result;
        let update = true;
        if (id > 0) {
            if (useFor === "art") {
                const entity: ClassifyEntity = await this.repository.findOneById(id);
                if (entity === null) result = "当前文章分类不存在";
                update = false;
            } else {
                const entity: PageClassifyEntity = await this.pageRepository.findOneById(id);
                if (entity === null) result = "当前页面分类不存在";
                update = false;
            }
        }
        if (groupId > 0) {
            if (useFor === "art") {
                const entityAll: Array<ClassifyEntity> = await this.repository.find();
                if (entityAll.length > 0) {
                    const entity: ClassifyEntity = await this.repository.findOneById(groupId);
                    if (entity === null) result = "当前文章分类父级分类不存在";
                    update = false;
                }

            } else {
                const entityAll: Array<PageClassifyEntity> = await this.pageRepository.find();
                if (entityAll.length > 0) {
                    const entity: PageClassifyEntity = await this.pageRepository.findOneById(groupId);
                    if (entity === null) result = "当前页面分类父级分类不存在";
                    update = false;
                }
            }
        }
        if (alias) {
            if (useFor === "art") {
                if (id) {/*修改文章分类*/
                    const classify: ClassifyEntity = await this.repository.findOneById(id);
                    if (classify.classifyAlias !== alias) {
                        const newClassify: Array<ClassifyEntity> = await this.repository
                            .createQueryBuilder()
                            .where(
                                "\"classifyAlias\"= :classifyAlias",
                                { classifyAlias: alias },
                            )
                            .getMany();
                        if (newClassify.length > 0) result = "别名不能重复";
                        update = false;
                    }
                } else {/*增加文章分类*/
                    const newClassify: Array<ClassifyEntity> = await this.repository.createQueryBuilder().where(
                        "\"classifyAlias\"= :classifyAlias",
                        { classifyAlias: alias },
                    ).getMany();
                    if (newClassify.length > 0) result = "别名不能重复";
                    update = false;
                }

            } else {
                if (id) {/*修改页面分类*/
                    const entity: PageClassifyEntity = await this.pageRepository.findOneById(id);
                    if (entity.classifyAlias !== alias) {
                        const newClassify: Array<PageClassifyEntity> = await this.pageRepository
                            .createQueryBuilder()
                            .where(
                                "\"classifyAlias\"= :classifyAlias",
                                { classifyAlias: alias },
                            )
                            .getMany();
                        if (newClassify.length > 0) result = "别名不能重复";
                        update = false;
                    }
                } else {/*添加页面分类*/
                    const newClassify: Array<PageClassifyEntity> = await this.pageRepository
                        .createQueryBuilder()
                        .where(
                            "\"classifyAlias\"= :classifyAlias",
                            { classifyAlias: alias },
                        )
                        .getMany();
                    if (newClassify.length > 0) result = "别名不能重复";
                    update = false;
                }

            }
        }
        if (deleteNum > 0) {
            if (useFor === "art") {
                const entity = await this.repository.findOneById(deleteNum);
                if (entity === null) {
                    result = "当前分类不存在";
                    update = false;
                } else {
                    const array: Array<number> = await this.getClassifyId(deleteNum);
                    const newArray: Array<number> = Array.from(new Set(array));
                    const artiicles: Array<ArticleEntity> = await this.artRepository
                        .createQueryBuilder()
                        .where(
                            "\"classifyId\" in (:id)",
                            { id: newArray },
                        ).getMany();
                    if (artiicles.length > 0) result = "当前分类下有文章,不能删除";
                    update = false;
                }

            } else {
                const entity = await this.pageRepository.findOneById(deleteNum);
                if (entity === null) {
                    result = "当前分类不存在";
                    update = false;
                } else {
                    const array: Array<number> = await this.getClassifyIdPage(deleteNum);
                    const newArray: Array<number> = Array.from(new Set(array));
                    const artiicles: Array<PageEntity> = await this.repositoryPage
                        .createQueryBuilder()
                        .where(
                            "\"classifyId\" in (:id)",
                            { id: newArray },
                        ).getMany();
                    if (artiicles.length > 0) result = "当前分类下有页面,不能删除";
                    update = false;
                }
            }
        }
        if (!result) {
            update = true;
        }

        return { MessageCodeError: result, Continue: update };
    }
}
