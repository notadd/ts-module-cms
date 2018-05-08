import { Component, HttpException, Inject } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleEntity } from "../../entity/article.entity";
import { ClassifyEntity } from "../../entity/classify.entity";
import { ImagePreProcessInfo } from "../common/error.interface";
import { MessageCodeError } from "../errorMessage/error.interface";
import { ClassifyService } from "./classify.service";

@Component()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) private readonly respository: Repository<ArticleEntity>,
        @InjectRepository(ClassifyEntity) private readonly claRespository: Repository<ClassifyEntity>,
        private readonly classifyService: ClassifyService,
        @Inject("StoreComponentToken") private storeService,
    ) {
    }

    /**
     * 返回所有数据,依据提供limit进行分页
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async getArticleAll(limit?: number, hidden?: boolean, pages?: number) {
        let title = 0;
        const resultAll: Array<ArticleEntity> = [];
        let newresult: Array<ArticleEntity> = [];
        let str: string;
        let num: string;
        if (hidden === true) {
            const newArray: Array<ArticleEntity> = [];
            const result = await this.respository
                .createQueryBuilder()
                .where("\"recycling\"<> :recycling and hidden=true", { recycling: true })
                .orderBy("ArticleEntity.publishedTime", "DESC")
                .skip(limit * (
                    pages - 1
                ))
                .take(limit)
                .getManyAndCount();
            str = JSON.stringify(result);
            newresult = Array.from(JSON.parse(str.substring(str.indexOf("[") + 1, str.lastIndexOf(","))));
            for (const t in newresult) {
                if (newresult[ t ].hidden) {
                    newArray.push(newresult[ t ]);
                }
            }
            num = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
            newresult = newArray;
        }
        if (hidden === false) {
            const result = await this.respository
                .createQueryBuilder()
                .where("\"recycling\"<> :recycling  and hidden=false", { recycling: true })
                .orderBy("ArticleEntity.publishedTime", "DESC")
                .skip(limit * (
                    pages - 1
                ))
                .take(limit)
                .getManyAndCount();
            str = JSON.stringify(result);
            num = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
            newresult = Array.from(JSON.parse(str.substring(str.indexOf("[") + 1, str.lastIndexOf(","))));
        }
        if (hidden === undefined) {
            const result = await this.respository
                .createQueryBuilder()
                .where("recycling=false or recycling is null")
                .orderBy(
                    "ArticleEntity.publishedTime",
                    "DESC",
                ).skip(limit * (
                    pages - 1
                )).take(limit).getManyAndCount();
            str = JSON.stringify(result);
            num = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
            newresult = Array.from(JSON.parse(str.substring(str.indexOf("[") + 1, str.lastIndexOf(","))));
        }
        title = Number(num);
        resultAll.push(...newresult);

        return { articles: resultAll, totalItems: title };
    }

    /**
     * 全局搜索
     * @param {string} name
     * @param {number} limit
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async searchArticles(name: string, limit?: number, pages?: number) {
        const strArt = `%${name}%`;
        const array: Array<number> = await this.classifyService.getClassifyIdForArt();
        if (array.length !== 0) {
            const result = await this.respository.createQueryBuilder()
                .where("\"classifyId\" in (:id)", { id: array })
                .andWhere("\"name\"like :name and \"recycling\" =\'false\' or recycling isnull ", { name: strArt })
                .orderBy("ArticleEntity.publishedTime", "DESC")
                .skip(limit * (
                    pages - 1
                ))
                .take(limit)
                .getManyAndCount();
            const str: string = JSON.stringify(result);
            const num: string = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
            const newresult: Array<ArticleEntity> = Array.from(JSON.parse(str.substring(str.indexOf("[")
                + 1, str.lastIndexOf(","))));
            return { articles: newresult, totalItems: Number(num) };
        } else {
            const newArticles: Array<ArticleEntity> = [];
            return { articles: newArticles, totalItems: 0 };
        }

    }

    /**
     * 修改数据状态为回收站
     * @param {[number]} array
     * @returns {Promise<number>}
     */
    async deleteArticles(array: Array<number>): Promise<number> {
        let count = 0;
        for (const t in array) {
            const article: ArticleEntity = await this.respository.findOneById(array[ t ]);
            if (article === null) { throw new MessageCodeError("delete:recycling:idMissing"); }
            article.recycling = true;
            article.updateAt = new Date();
            const newArticle: ArticleEntity = article;
            this.respository.updateById(newArticle.id, newArticle);
            count++;
        }
        return count;
    }

    /**
     * 添加文章
     * @param {ArticleEntity} article
     * @returns {Promise<void>}
     */
    async createArticle(article: ArticleEntity) {
        const entity: ClassifyEntity = await this.classifyService.findOneByIdArt(article.classifyId);
        if (article.classifyId !== null && article.classifyId !== 0 && entity === null) {
            throw new MessageCodeError("page:classify:classifyIdMissing");
        }
        const num: number = await this.classifyService.findLevel(article.classifyId);
        const level: string = this.classifyService.interfaceChange(num);
        if (article.topPlace === null) {
            article.topPlace = "cancel";
        }
        const levelGive: string = article.topPlace;
        if (level === "level1" && levelGive === "level2" || levelGive === "level3") {
            throw new MessageCodeError("create:level:lessThanLevel");
        }
        if (level === "level2" && levelGive === "level3") {
            throw new MessageCodeError("create:level:lessThanLevel");
        }
        article.recycling = false;
        await this.respository
            .createQueryBuilder()
            .insert()
            .into(ArticleEntity)
            .values(article)
            .output("id")
            .execute();
    }

    /**
     * 修改文章
     * @param {ArticleEntity} article
     *
     * @returns {Promise<void>}
     */
    async updateArticle(article: ArticleEntity) {
        const art: ArticleEntity = await this.respository.findOneById(article.id);
        if (art === null) { throw new MessageCodeError("delete:recycling:idMissing"); }
        const entity: ClassifyEntity = await this.classifyService.findOneByIdArt(article.classifyId);
        if (article.classifyId !== null && article.classifyId !== 0 && entity === null) {
            throw new MessageCodeError("page:classify:classifyIdMissing");
        }
        const num: number = await this.classifyService.findLevel(article.classifyId);
        const level: string = this.classifyService.interfaceChange(num);
        const levelGive: string = article.topPlace;
        if (level === "level1" && levelGive === "level2" || levelGive === "level3") {
            throw new MessageCodeError("create:level:lessThanLevel");
        }
        if (level === "level2" && levelGive === "level3") {
            throw new MessageCodeError("create:level:lessThanLevel");
        }
        article.updateAt = new Date();
        const newArt: ArticleEntity = article;
        await this.respository.updateById(newArt.id, newArt);
    }

    /**
     * 分页获取回收站内所有文章
     * @param {number} limit
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async recycleFind(limit?: number, pages?: number) {
        const result = await this.respository.createQueryBuilder()
            .where("recycling= :recycling", { recycling: true })
            .orderBy("ArticleEntity.publishedTime", "ASC")
            .skip(limit * (
                pages - 1
            )).take(limit).getManyAndCount();
        const str: string = JSON.stringify(result);
        const num: string = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
        const newresult: Array<ArticleEntity> = Array.from(
            JSON.parse(str.substring(str.indexOf("[") + 1, str.lastIndexOf(","))),
        );
        return { articles: newresult, totalItems: Number(num) };
    }

    /**
     * 回收站内删除数据
     * @param {[number]} array
     * @returns {Promise<number>}
     */
    async recycleDelete(array: Array<number>) {
        let result;
        try {
            result = await this.respository.createQueryBuilder().delete()
                .from(ArticleEntity).whereInIds(array)
                .output("id").execute()
                .then(a => {
                    return a;
                });
        } catch (err) {
            throw new HttpException("删除错误" + err.toString(), 401);
        }
        return result;
    }

    /**
     * 回收站内批量或者单个还原数据，目前限制分页为0
     * @param {[number]} array
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async reductionArticle(array: Array<number>): Promise<number> {
        let num = 0;
        for (const t in array) {
            const article: ArticleEntity = await this.respository.findOneById(array[ t ]);
            if (article === null) { throw new MessageCodeError("delete:recycling:idMissing"); }
            article.recycling = false;
            article.updateAt = new Date();
            const newArticle: ArticleEntity = article;
            this.respository.updateById(newArticle.id, newArticle);
            num++;
        }

        return num;
    }

    /**
     * 分批获取置顶文章
     * @param {number} limit
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async findTopPlace(limit?: number, pages?: number) {
        const result = await this.respository.createQueryBuilder()
            .where("\"topPlace\"= :topPlace", { topPlace: "global" })
            .orderBy("ArticleEntity.updateAt", "DESC")
            .skip(limit * (
                pages - 1
            )).take(limit).getManyAndCount();
        const str: string = JSON.stringify(result);
        const num: string = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
        const newresult: Array<ArticleEntity> = Array.from(
            JSON.parse(str.substring(str.indexOf("[") + 1, str.lastIndexOf(","))),
        );

        return { articles: newresult, totalItems: Number(num) };
    }

    /**
     * 回收站内根据分类查找当前分类及子分类下的文章
     * @param {number} id
     * @param {number} limit
     * @param {number} pages
     *
     * @returns {Promise<Array<ArticleEntity>>}
     */
    async reductionClassity(id: number, limit?: number, pages?: number) {
        const entity: ClassifyEntity = await this.classifyService.findOneByIdArt(id);
        if (entity === null) { throw new MessageCodeError("page:classify:classifyIdMissing"); }
        const array: Array<number> = await this.classifyService.getClassifyId(id);
        array.push(id);
        const newArray: Array<number> = Array.from(new Set(array));
        const result = await this.respository.createQueryBuilder()
            .where("\"classifyId\" in (:classifyId)  and recycling=true", { classifyId: newArray })
            .orderBy("id", "ASC")
            .skip(limit * (
                pages - 1
            )).take(limit).getManyAndCount();
        const str: string = JSON.stringify(result);
        const num: string = str.substring(str.lastIndexOf(",") + 1, str.lastIndexOf("]"));
        const newresult: Array<ArticleEntity> = Array.from(
            JSON.parse(str.substring(str.indexOf("[") + 1, str.lastIndexOf(","))),
        );

        return { articles: newresult, totalItems: Number(num) };
    }

    /**
     * 根据分类id获取层级
     * @param {number} id
     * @returns {Promise<string>}
     */
    async getLevelByClassifyId(id: number): Promise<string> {
        const entity: ClassifyEntity = await this.classifyService.findOneByIdArt(id);
        if (entity === null) { throw new MessageCodeError("delete:recycling:idMissing"); }
        const num: number = await this.classifyService.findLevel(entity.id);
        const level: string = this.classifyService.interfaceChange(num);
        let topPlace = "";
        if (level === "level1") {
            topPlace = `global,current`;
        } else if (level === "level2") {
            topPlace = `global,level1,current`;
        } else if (level === "level3") {
            topPlace = `global,level1,current,level2`;
        } else {
            topPlace = `global,level1,level2,level3,current`;
        }
        return topPlace;
    }

    /**
     * 文章修改基本校验
     * @param {number} classifyId
     * @param {number} id
     * @returns {Promise<{MessageCodeError: string; Continue: boolean}>}
     * @constructor
     */
    async CurdArticleCheck(classifyId?: number, id?: number) {
        let result: string;
        let update = true;
        if (id > 0) {
            const aliasEntity: ArticleEntity = await this.respository.findOneById(id);
            if (aliasEntity === null) { result = "当前文章不存在"; }
            update = false;
        }
        if (classifyId > 0) {
            const entity: ClassifyEntity = await this.classifyService.findOneByIdArt(classifyId);
            if (entity === null) { result = "对应分类不存在"; }
            update = false;
        }
        if (!result) {
            update = true;
        }

        return { MessageCodeError: result, Continue: update };
    }

    /**
     * 上传图片
     * @param {string} bucketName
     * @param {string} rawName
     * @param {string} base64
     * @returns {Promise<{bucketName: string; name: string; type: string}>}
     */
    async upLoadPicture(req: any, bucketName: string, rawName: string, base64: string, id?: number) {
        try {
            if (id > 0) {
                const entity: ArticleEntity = await this.respository.findOneById(id);
                /*删除图片*/
                if (entity && entity.bucketName !== null) {
                    const entitys: Array<ArticleEntity> = await this.respository.find({ pictureUrl: entity.pictureUrl });
                    if (entitys.length === 1) {
                        await this.storeService.delete(entity.bucketName, entity.pictureName, entity.type);
                    }
                }
            }
            const imagePreProcessInfo = new ImagePreProcessInfo();
            imagePreProcessInfo.watermark = false;
            /*上传图片*/
            const result = await this.storeService.upload(bucketName, rawName, base64, imagePreProcessInfo).then(a => {
                return a;
            });
            const map = this.objToStrMap(result);
            const bucket = map.get("bucketName");
            const name = map.get("name");
            const types = map.get("type");
            /*获取图片地址*/
            const url = await this.storeService.getUrl(
                req.get("obj"),
                bucket,
                name,
                types,
                imagePreProcessInfo,
            );

            return { pictureUrl: url, bucketName: bucket, pictureName: name, type: types, MessageCodeError: "上传成功" };
        } catch (err) {
            return { MessageCodeError: "上传失败" };
        }
    }

    /**
     * JSON----Map
     * @param obj
     * @returns {Map<string, string>}
     */
    objToStrMap(obj): Map<string, string> {
        const strMap = new Map();
        for (const k of Object.keys(obj)) {
            strMap.set(k, obj[ k ]);
        }

        return strMap;
    }

    /**
     * 根据id获取文章
     * @param {number} id
     * @returns {Promise<ArticleEntity>}
     */
    async getArticleById(id: number) {
        const array: Array<ArticleEntity> = [];
        const article: ArticleEntity = await this.respository.findOneById(id);
        if (article === null) { throw new MessageCodeError("delete:recycling:idMissing"); }
        array.push(article);

        return { articles: array };
    }

}
