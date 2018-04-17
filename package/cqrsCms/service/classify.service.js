"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const util_1 = require("util");
const article_entity_1 = require("../../entity/article.entity");
const classify_entity_1 = require("../../entity/classify.entity");
const page_entity_1 = require("../../entity/page.entity");
const pageClassify_entity_1 = require("../../entity/pageClassify.entity");
const error_interface_1 = require("../errorMessage/error.interface");
let ClassifyService = class ClassifyService {
    constructor(repository, artRepository, pageRepository, repositoryPage) {
        this.repository = repository;
        this.artRepository = artRepository;
        this.pageRepository = pageRepository;
        this.repositoryPage = repositoryPage;
    }
    createClassifyArt(entity, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const firstClass = yield this.repository.find();
            if (firstClass.length === 0) {
                const newClassify = new classify_entity_1.ClassifyEntity();
                newClassify.groupId = undefined;
                newClassify.classifyAlias = "无";
                newClassify.title = "无";
                const id = yield this.repository
                    .createQueryBuilder()
                    .insert()
                    .into(classify_entity_1.ClassifyEntity)
                    .values(newClassify)
                    .output("id")
                    .execute();
                const str = JSON.stringify(id).split(":")[1];
                const numb = str.substring(0, str.lastIndexOf("}"));
                const newId = Number(numb);
                entity.groupId = newId;
                yield this.repository.insert(entity);
            }
            else {
                const newClassify = yield this.repository.createQueryBuilder().where("\"classifyAlias\"= :classifyAlias", { classifyAlias: -entity.classifyAlias }).getMany();
                if (newClassify.length > 0)
                    throw new error_interface_1.MessageCodeError("create:classify:aliasRepeat");
                const parentClassify = yield this.repository.findOneById(entity.groupId);
                if (entity.groupId !== 0 && parentClassify === null) {
                    throw new error_interface_1.MessageCodeError("create:classify:parentIdMissing");
                }
                const first = yield this.repository.findOneById(1);
                if (entity.groupId === 0 && first === null) {
                    entity.groupId = undefined;
                }
                else if (entity.groupId === 0) {
                    entity.groupId = 1;
                }
                const classify = entity;
                yield this.repository.insert(classify);
            }
            return this.findAllClassifyArt(limit);
        });
    }
    createClassifyPage(entity, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const firstClass = yield this.pageRepository.find();
            if (firstClass.length === 0) {
                const newClassify = new pageClassify_entity_1.PageClassifyEntity();
                newClassify.groupId = undefined;
                newClassify.classifyAlias = "无";
                newClassify.title = "无";
                const id = yield this.pageRepository
                    .createQueryBuilder()
                    .insert()
                    .into(pageClassify_entity_1.PageClassifyEntity)
                    .values(newClassify)
                    .output("id")
                    .execute();
                const str = JSON.stringify(id).split(":")[1];
                const numb = str.substring(0, str.lastIndexOf("}"));
                const newId = Number(numb);
                entity.groupId = newId;
                yield this.pageRepository.insert(entity);
            }
            else {
                const newClassify = yield this.pageRepository
                    .createQueryBuilder()
                    .where("\"classifyAlias\"= :classifyAlias", { classifyAlias: -entity.classifyAlias })
                    .getMany();
                if (newClassify.length > 0)
                    throw new error_interface_1.MessageCodeError("create:classify:aliasRepeat");
                const parentClassify = yield this.pageRepository.findOneById(entity.groupId);
                if (entity.groupId !== 0 && entity.groupId !== null && parentClassify === null) {
                    throw new error_interface_1.MessageCodeError("create:classify:parentIdMissing");
                }
                const first = yield this.pageRepository.findOneById(1);
                if (entity.groupId === 0 && first === null) {
                    entity.groupId = undefined;
                }
                else if (entity.groupId === 0) {
                    entity.groupId = 1;
                }
                const classify = entity;
                yield this.pageRepository.insert(classify);
            }
            return this.findAllClassifyPage(limit);
        });
    }
    updateClassifyArt(entity, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.repository.findOneById(entity.id);
            if (classify === null)
                throw new error_interface_1.MessageCodeError("update:classify:updateById");
            if (entity.classifyAlias !== classify.classifyAlias) {
                const newClassify = yield this.repository
                    .createQueryBuilder()
                    .where("\"classifyAlias\"= :classifyAlias", { classifyAlias: entity.classifyAlias })
                    .getMany();
                if (newClassify.length > 0)
                    throw new error_interface_1.MessageCodeError("create:classify:aliasRepeat");
            }
            if (util_1.isNumber(entity.groupId)) {
                const parentClassify = yield this.repository.findOneById(entity.groupId);
                if (parentClassify === null)
                    throw new error_interface_1.MessageCodeError("create:classify:parentIdMissing");
            }
            entity.updateAt = new Date();
            const finalClassify = entity;
            yield this.repository.updateById(entity.id, finalClassify);
            return this.findAllClassifyArt(id);
        });
    }
    updateClassifyPage(entity, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.pageRepository.findOneById(entity.id);
            if (classify === null)
                throw new error_interface_1.MessageCodeError("update:classify:updateById");
            if (entity.classifyAlias !== classify.classifyAlias) {
                const newClassify = yield this.pageRepository
                    .createQueryBuilder()
                    .where("\"classifyAlias\"= :classifyAlias", { classifyAlias: entity.classifyAlias })
                    .getMany();
                if (newClassify.length > 0)
                    throw new error_interface_1.MessageCodeError("create:classify:aliasRepeat");
            }
            if (util_1.isNumber(entity.groupId)) {
                const parentClassify = yield this.pageRepository.findOneById(entity.groupId);
                if (parentClassify === null)
                    throw new error_interface_1.MessageCodeError("create:classify:parentIdMissing");
            }
            entity.updateAt = new Date();
            yield this.pageRepository.updateById(entity.id, entity);
            return this.findAllClassifyPage(id);
        });
    }
    findAllClassifyArt(idNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const idFindOne = yield this.repository
                .createQueryBuilder()
                .where("\"id\"= :id", { id: idNum })
                .getOne();
            if (idFindOne) {
                const list = yield this.repository
                    .createQueryBuilder()
                    .where("\"groupId\"= :groupId", { groupId: idNum })
                    .orderBy("id", "ASC")
                    .getMany();
                const result = [];
                const resultArray = yield this.Artrecursion(idNum, list);
                idFindOne.children = resultArray;
                const newPageClassify = idFindOne;
                result.push(newPageClassify);
                return result;
            }
            else {
                const newArt = yield this.repository.find();
                return newArt;
            }
        });
    }
    findAllClassifyPage(idNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const idFindOne = yield this.pageRepository
                .createQueryBuilder()
                .where("\"id\"= :id", { id: idNum })
                .getOne();
            if (idFindOne) {
                const list = yield this.pageRepository
                    .createQueryBuilder()
                    .where("\"groupId\"= :id", { id: idNum })
                    .orderBy("id", "ASC")
                    .getMany();
                const result = [];
                const resultArray = yield this.Pagerecursion(idNum, list);
                idFindOne.children = resultArray;
                const newPageClassify = idFindOne;
                result.push(newPageClassify);
                return result;
            }
            else {
                const newPage = yield this.pageRepository.find();
                return newPage;
            }
        });
    }
    Pagerecursion(id, listFirst) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = [];
            for (const t in listFirst) {
                const groupIdFirst = listFirst[t].id;
                let navigationArray = new pageClassify_entity_1.PageClassifyEntity();
                navigationArray = listFirst[t];
                const listSecond = yield this.pageRepository
                    .createQueryBuilder()
                    .where("\"groupId\"= :id", { id: groupIdFirst })
                    .orderBy("id", "ASC")
                    .getMany();
                if (listSecond.length > 0) {
                    for (const h in listSecond) {
                        const theEnd = yield this.Pagerecursion(listSecond[h].id, listSecond);
                        navigationArray.children = theEnd;
                    }
                }
                else {
                    navigationArray.children = [];
                }
                const navigationFinal = navigationArray;
                children.push(navigationFinal);
            }
            return children;
        });
    }
    Artrecursion(id, listFirst) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = [];
            for (const t in listFirst) {
                const groupIdFirst = listFirst[t].id;
                let navigationArray = new classify_entity_1.ClassifyEntity();
                navigationArray = listFirst[t];
                const listSecond = yield this.repository
                    .createQueryBuilder()
                    .where("\"groupId\"= :id", { id: groupIdFirst })
                    .orderBy("id", "ASC")
                    .getMany();
                if (listSecond.length > 0) {
                    for (const h in listSecond) {
                        const theEnd = yield this.Artrecursion(listSecond[h].id, listSecond);
                        navigationArray.children = theEnd;
                    }
                }
                else {
                    navigationArray.children = [];
                }
                const navigationFinal = navigationArray;
                children.push(navigationFinal);
            }
            return children;
        });
    }
    deleteClassifyArt(id, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteArray = [];
            for (const t in result) {
                const num = result[t].id;
                if (num === id) {
                    deleteArray.push(id);
                    const array = result[t].children;
                    if (array.length > 0) {
                        for (const h in array) {
                            const numH = array[h].id;
                            deleteArray.push(numH);
                            yield this.repository.deleteById(numH);
                            yield this.deleteClassifyArt(numH, result);
                        }
                    }
                    yield this.repository.deleteById(num);
                }
            }
            if (deleteArray.length === 0) {
                deleteArray.push(id);
            }
            yield this.repository.deleteById(id);
            return deleteArray;
        });
    }
    deleteMethodFirst(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.repository.findOneById(id);
            if (classify === null)
                throw new error_interface_1.MessageCodeError("update:classify:updateById");
            yield typeorm_2.getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
            const result = yield this.repository
                .createQueryBuilder("article_classify_table")
                .innerJoinAndSelect("article_classify_table.children", "children")
                .orderBy("article_classify_table.id")
                .getMany();
            const resultArray = result;
            yield typeorm_2.getManager().query("update public.article_classify_table set \"parentId\" = null");
            const array = yield this.getClassifyId(id);
            array.push(id);
            const newArray = Array.from(new Set(array));
            const artiicles = yield this.artRepository
                .createQueryBuilder()
                .where("\"classifyId\" in (:id)", { id: newArray })
                .getMany();
            if (artiicles.length > 0)
                throw new error_interface_1.MessageCodeError("delete:art:ClassifyIdIncludeArts");
            const res = yield this.deleteClassifyArt(id, result);
            return this.findAllClassifyArt(1);
        });
    }
    deleteMethodSecond(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.pageRepository.findOneById(id);
            if (classify === null)
                throw new error_interface_1.MessageCodeError("update:classify:updateById");
            yield typeorm_2.getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
            const result = yield this.pageRepository
                .createQueryBuilder("page_classify_table")
                .innerJoinAndSelect("page_classify_table.children", "children")
                .orderBy("page_classify_table.id")
                .getMany();
            yield typeorm_2.getManager().query("update public.page_classify_table set \"parentId\"=null");
            const array = yield this.getClassifyIdPage(id);
            array.push(id);
            const newArray = Array.from(new Set(array));
            const artiicles = yield this.repositoryPage.createQueryBuilder().where("\"classifyId\" in (:id)", { id: newArray }).getMany();
            if (artiicles.length > 0)
                throw new error_interface_1.MessageCodeError("delete:page:ClassifyIdIncludePages");
            const res = yield this.deleteClassifyPage(id, result);
            return this.findAllClassifyPage(1);
        });
    }
    deleteClassifyPage(id, result) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteArray = [];
            for (const t in result) {
                const num = result[t].id;
                if (num === id) {
                    deleteArray.push(id);
                    const array = result[t].children;
                    if (array.length > 0) {
                        for (const h in array) {
                            const numH = array[h].id;
                            deleteArray.push(numH);
                            yield this.pageRepository.deleteById(numH);
                            yield this.deleteClassifyPage(numH, result);
                        }
                    }
                    yield this.pageRepository.deleteById(num);
                }
            }
            if (deleteArray.length === 0) {
                deleteArray.push(id);
            }
            yield this.pageRepository.deleteById(id);
            return deleteArray;
        });
    }
    updateArticleClassify(classifyArray, useFor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (useFor === "art") {
                for (const t in classifyArray) {
                    const article = yield this.artRepository
                        .createQueryBuilder()
                        .where("\"classifyId\"= :classifyId", { classifyId: classifyArray[t] })
                        .getMany();
                    const id = yield this.findTheDefaultByAlias("默认分类", "art");
                    for (const h in article) {
                        const newArticle = article[h];
                        newArticle.classifyId = id;
                        newArticle.classify = "默认分类";
                        newArticle.updateAt = new Date();
                        this.artRepository.updateById(newArticle.id, newArticle);
                    }
                }
            }
            else if (useFor === "page") {
                for (const t in classifyArray) {
                    const article = yield this.repositoryPage
                        .createQueryBuilder()
                        .where("\"classifyId\"= :classifyId", { classifyId: classifyArray[t] })
                        .getMany();
                    const id = yield this.findTheDefaultByAlias("默认分类", "page");
                    for (const h in article) {
                        const newArticle = article[h];
                        newArticle.classify = "默认分类";
                        newArticle.classifyId = id;
                        newArticle.updateAt = new Date();
                        this.repositoryPage.updateById(newArticle.id, newArticle);
                    }
                }
            }
        });
    }
    findOneByIdArt(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.repository.findOneById(id);
            return entity;
        });
    }
    findOneByIdPage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.pageRepository.findOneById(id);
            return entity;
        });
    }
    showNextTitle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const articleArray = [];
            const arrayNum = [];
            const classifications = yield this.repository
                .createQueryBuilder()
                .where("\"groupId\"= :groupId", {
                groupId: id,
            })
                .getMany();
            for (const t in classifications) {
                arrayNum.push(classifications[t].id);
            }
            for (const h in arrayNum) {
                const art = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\"= :classifyId", {
                    classifyId: arrayNum[h],
                })
                    .orderBy("ArticleEntity.id", "ASC")
                    .getMany();
                articleArray.push(...art);
            }
            return { articles: articleArray };
        });
    }
    showBeforeTitle(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.repository.findOneById(id);
            if (classify === null)
                throw new error_interface_1.MessageCodeError("page:classify:classifyIdMissing");
            const articleArray = [];
            const currentArticle = yield this.artRepository
                .createQueryBuilder()
                .where("\"classifyId\"= :classifyId and \"topPlace\"=\'current\'", { classifyId: classify.groupId })
                .orderBy("ArticleEntity.updateAt", "ASC")
                .getMany();
            articleArray.push(...currentArticle);
            const array = yield this.getClassifyId(classify.groupId);
            array.push(id);
            const newArray = Array.from(new Set(array));
            const finalArray = [];
            for (const t in newArray) {
                if (newArray[t] !== classify.groupId) {
                    finalArray.push(newArray[t]);
                }
            }
            const level = yield this.findLevel(classify.groupId);
            if (level === 1) {
                const newArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\" in (:id)", { id: newArray })
                    .andWhere("\"topPlace\"= :topPlace", { topPlace: "level1" })
                    .orderBy("ArticleEntity.updateAt", "ASC")
                    .getMany();
                articleArray.push(...newArticles);
            }
            else if (level === 2) {
                const newArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\" in (:id)", { id: newArray })
                    .andWhere("\"topPlace\" :topPlace", { topPlace: "level2" })
                    .orderBy("ArticleEntity.updateAt", "ASC")
                    .getMany();
                articleArray.push(...newArticles);
            }
            else if (level === 3) {
                const newArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\" in (:id)", { id: newArray })
                    .andWhere("\"topPlace\" :topPlace", { topPlace: "level3" })
                    .orderBy("ArticleEntity.updateAt", "ASC")
                    .getMany();
                articleArray.push(...newArticles);
            }
            return { articles: articleArray };
        });
    }
    showCurrentArticles(idNum) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.repository.findOneById(idNum);
            if (classify === null)
                throw new error_interface_1.MessageCodeError("page:classify:classifyIdMissing");
            const articleArray = [];
            const current = yield this.artRepository.createQueryBuilder().where("\"classifyId\"=:id", { id: idNum }).orderBy("ArticleEntity.updateAt", "ASC").getMany();
            articleArray.push(...current);
            return { articles: articleArray };
        });
    }
    getArticelsByClassifyId(id, limit, show, pages, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = `%${name}%`;
            const articles = [];
            const entity = yield this.findOneByIdArt(id);
            if (entity === null)
                throw new error_interface_1.MessageCodeError("page:classify:classifyIdMissing");
            let level = yield this.findLevel(entity.id);
            const array = yield this.getClassifyId(id).then(a => {
                return a;
            });
            array.push(id);
            const newArray = Array.from(new Set(array));
            if (show === true) {
                const global = [];
                const globalArts = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"topPlace\"= :topPlace", { topPlace: "global" })
                    .andWhere("\"name\"like :name and recycling=false", { name: str })
                    .orderBy("ArticleEntity.publishedTime", "DESC")
                    .getMany();
                for (const t in globalArts) {
                    if (globalArts[t].display !== null) {
                        const newArray = globalArts[t].display.split(",");
                        const num = newArray.indexOf(id.toString());
                        if (num < 0) {
                            global.push(globalArts[t]);
                        }
                    }
                    else {
                        global.push(globalArts[t]);
                    }
                }
                articles.push(...global);
            }
            if (show === false) {
                const newArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\" in( :id)", { id: newArray })
                    .andWhere("\"topPlace\"=\"current\" or \"topPlace\"=\"cancel\"")
                    .andWhere("\"name\"like :name", { name: str })
                    .orderBy("ArticleEntity.publishedTime", "DESC")
                    .getMany();
                articles.push(...newArticles);
                level = 5;
            }
            if (show === undefined) {
                level = 4;
            }
            if (level === 1) {
                const newArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\" in ( :id)", { id: newArray })
                    .andWhere("\"topPlace\"= :topPlace", { topPlace: "level1" })
                    .andWhere("\"name\"like :name and recycling=false", { name: str })
                    .orderBy("ArticleEntity.publishedTime", "DESC")
                    .getMany();
                articles.push(...newArticles);
                const finalArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\"= :classifyId  and \"topPlace\"<>\"global\"", { classifyId: id })
                    .andWhere("\"name\"like :name and recycling=false", { name: str })
                    .orderBy("ArticleEntity.publishedTime", "DESC")
                    .getMany();
                articles.push(...finalArticles);
            }
            else if (level === 2) {
                const newArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\" in ( :id)", { id: newArray })
                    .andWhere("\"topPlace\"= :topPlace", { topPlace: "level2" })
                    .andWhere("\"name\"like :name and recycling=false", { name: str })
                    .orderBy("ArticleEntity.publishedTime", "DESC")
                    .getMany();
                articles.push(...newArticles);
                const finalArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\"= :classifyId and \"topPlace\"<>\"level1\" and \"topPlace\"<>\"global\"", { classifyId: id })
                    .andWhere("\"name\"like :name and recycling=false", { name: str })
                    .orderBy("ArticleEntity.publishedTime", "DESC")
                    .getMany();
                articles.push(...finalArticles);
            }
            else if (level === 3) {
                const newArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\" in (:id)", { id: newArray })
                    .andWhere("\"topPlace\"= :topPlace", { topPlace: "level3" })
                    .andWhere("\"name\"like :name and recycling=false", { name: str })
                    .orderBy("ArticleEntity.publishedTime", "DESC")
                    .getMany();
                articles.push(...newArticles);
                const finalArticles = yield this.artRepository.createQueryBuilder().where("\"classifyId\"= :classifyId and \"topPlace\"<>\"level2\" and \"topPlace\"<>\"global\"", { classifyId: id }).andWhere("\"name\"like :name and recycling=false", { name: str }).orderBy("ArticleEntity.publishedTime", "DESC").getMany();
                articles.push(...finalArticles);
            }
            else if (level === 4) {
                const newArticles = yield this.artRepository
                    .createQueryBuilder()
                    .where("\"classifyId\" in ( :id) and recycling=false", { id: newArray })
                    .andWhere("\"name\"like :name", { name: str })
                    .orderBy("ArticleEntity.publishedTime", "DESC")
                    .getMany();
                articles.push(...newArticles);
            }
            const num = articles.length;
            const returnArt = yield this.Fenji(articles, limit, pages);
            return { articles: returnArt, totalItems: num };
        });
    }
    Fenji(art, limit, pages) {
        return __awaiter(this, void 0, void 0, function* () {
            let newArt = [];
            if (limit) {
                newArt = art.splice(limit * (pages - 1), limit);
            }
            else {
                newArt = art;
            }
            return newArt;
        });
    }
    getClassifyIdForArt() {
        return __awaiter(this, void 0, void 0, function* () {
            const custom = yield this.repository.createQueryBuilder().where("\"classifyAlias\"=\'活动\' or \"classifyAlias\"=\'资讯\'").getMany();
            let customArray = [];
            for (const t in custom) {
                customArray.push(custom[t].id);
                customArray.push(...yield this.getClassifyId(custom[t].id).then(a => {
                    return a;
                }));
            }
            customArray = Array.from(new Set(customArray));
            return customArray;
        });
    }
    getClassifyId(idNum) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_2.getManager().query("update public.article_classify_table set \"parentId\" = \"groupId\"");
            const entity = yield this.repository
                .createQueryBuilder()
                .where("\"groupId\"= :groupId", { groupId: idNum })
                .getMany();
            const array = [];
            if (entity.length > 0) {
                const result = yield this.repository
                    .createQueryBuilder("article_classify_table")
                    .where("article_classify_table.id= :id", { id: idNum })
                    .innerJoinAndSelect("article_classify_table.children", "children")
                    .orderBy("article_classify_table.id").getMany();
                const firstArray = result;
                for (const t in firstArray) {
                    array.push(firstArray[t].id);
                    if (firstArray[t].children.length > 0) {
                        for (const h in firstArray[t].children) {
                            array.push(firstArray[t].children[h].id);
                            array.push(...yield this.getClassifyId(firstArray[t].children[h].id));
                        }
                    }
                }
            }
            array.push(idNum);
            return array;
        });
    }
    getClassifyIdPage(idNum) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_2.getManager().query("update public.page_classify_table set \"parentId\" = \"groupId\"");
            const array = [];
            const entity = yield this.pageRepository
                .createQueryBuilder()
                .where("\"groupId\"= :groupId", { groupId: idNum })
                .getMany();
            if (entity.length > 0) {
                const result = yield this.pageRepository.createQueryBuilder("page_classify_table").where("page_classify_table.id= :id", { id: idNum }).innerJoinAndSelect("page_classify_table.children", "children").getMany();
                const firstArray = result;
                for (const t in firstArray) {
                    array.push(firstArray[t].id);
                    if (firstArray[t].children.length > 0) {
                        for (const h in firstArray[t].children) {
                            array.push(firstArray[t].children[h].id);
                            array.push(...yield this.getClassifyIdPage(firstArray[t].children[h].id));
                        }
                    }
                }
            }
            array.push(idNum);
            return array;
        });
    }
    findLevel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const arr = yield this.repository.find();
            const final = yield this.showClassifyLevel(arr, id, 0);
            let num;
            for (const t in final) {
                if (final[t].id === 1) {
                    num = final[t].level;
                }
            }
            return num;
        });
    }
    showClassifyLevel(arr, id, level) {
        return __awaiter(this, void 0, void 0, function* () {
            const array = [];
            for (const t in arr) {
                if (arr[t].id === id) {
                    arr[t].level = level;
                    const newClas = arr[t];
                    array.push(newClas);
                    const arrayCla = yield this.showClassifyLevel(arr, arr[t].groupId, level + 1);
                    array.push(...arrayCla);
                }
            }
            return array;
        });
    }
    interfaceChange(level) {
        let finalLevel;
        if (level === 1) {
            finalLevel = "level1";
        }
        else if (level === 2) {
            finalLevel = "level2";
        }
        else if (level === 3) {
            finalLevel = "level3";
        }
        else if (level === 4) {
            finalLevel = "current";
        }
        return finalLevel;
    }
    mobileClassifyArt(id, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.repository.findOneById(id);
            if (classify === null)
                throw new error_interface_1.MessageCodeError("update:classify:updateById");
            if (groupId !== 0) {
                const parent = yield this.repository.findOneById(groupId);
                if (parent === null)
                    throw new error_interface_1.MessageCodeError("update:classify:updateById");
            }
            if (groupId === 0) {
                groupId = 1;
            }
            classify.groupId = groupId;
            const array = yield this.getClassifyId(id).then(a => {
                return a;
            });
            array.push(id);
            const newArray = Array.from(new Set(array));
            this.resetTheSetTop(newArray);
            classify.updateAt = new Date();
            const newClassify = classify;
            this.repository.updateById(newClassify.id, newClassify);
            return this.findAllClassifyArt(1);
        });
    }
    resetTheSetTop(arr) {
        return __awaiter(this, void 0, void 0, function* () {
            const articles = yield this.artRepository
                .createQueryBuilder()
                .where("\"classifyId\" in ( :id)", { id: arr })
                .getMany();
            for (const t in articles) {
                let arr = new article_entity_1.ArticleEntity();
                arr = articles[t];
                arr.topPlace = "cancel";
                arr.updateAt = new Date();
                yield this.artRepository.updateById(arr.id, arr);
            }
        });
    }
    mobileClassifyPage(id, groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const classify = yield this.pageRepository.findOneById(id);
            if (classify === null)
                throw new error_interface_1.MessageCodeError("update:classify:updateById");
            if (groupId !== 0) {
                const parent = yield this.pageRepository.findOneById(groupId);
                if (parent === null)
                    throw new error_interface_1.MessageCodeError("update:classify:updateById");
            }
            if (groupId === 0) {
                groupId = 1;
            }
            classify.groupId = groupId;
            classify.updateAt = new Date();
            const newClassify = classify;
            this.pageRepository.updateById(newClassify.id, newClassify);
            return this.findAllClassifyPage(1);
        });
    }
    findOnePageClassifyById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const final = yield this.pageRepository.findOneById(id);
            return final;
        });
    }
    findTheDefaultByAlias(alias, useFor) {
        return __awaiter(this, void 0, void 0, function* () {
            let numId = 0;
            if (useFor === "art") {
                const defaultArt = yield this.repository
                    .createQueryBuilder()
                    .where("\"classifyAlias\"= :classifyAlias", { classifyAlias: alias })
                    .getOne();
                if (defaultArt === null) {
                    const classify = new classify_entity_1.ClassifyEntity();
                    classify.groupId = 1;
                    classify.title = "默认分类";
                    classify.classifyAlias = "默认分类";
                    classify.describe = "默认分类";
                    const result = yield this.repository
                        .createQueryBuilder()
                        .insert()
                        .into(classify_entity_1.ClassifyEntity)
                        .values(classify)
                        .output("id")
                        .execute();
                    const str = JSON.stringify(result);
                    const newstr = str
                        .replace("{", "")
                        .replace("}", "")
                        .replace("[", "")
                        .replace("]", "");
                    const finalStr = newstr
                        .replace("'", "")
                        .replace("'", "")
                        .split(":");
                    numId = Number(finalStr[1]);
                }
                else {
                    numId = defaultArt.id;
                }
            }
            else if (useFor === "page") {
                const defaultPage = yield this.pageRepository
                    .createQueryBuilder()
                    .where("\"classifyAlias\"= :classifyAlias", { classifyAlias: alias })
                    .getOne();
                if (defaultPage === null) {
                    const classify = new pageClassify_entity_1.PageClassifyEntity();
                    classify.groupId = 1;
                    classify.title = "默认分类";
                    classify.classifyAlias = "默认分类";
                    classify.describe = "默认分类";
                    const result = yield this.pageRepository
                        .createQueryBuilder()
                        .insert()
                        .into(pageClassify_entity_1.PageClassifyEntity)
                        .values(classify)
                        .output("id")
                        .execute();
                    const str = JSON.stringify(result);
                    const newstr = str
                        .replace("{", "")
                        .replace("}", "")
                        .replace("[", "")
                        .replace("]", "");
                    const finalStr = newstr
                        .replace("'", "")
                        .replace("'", "")
                        .split(":");
                    numId = Number(finalStr[1]);
                }
                else {
                    numId = defaultPage.id;
                }
            }
            return numId;
        });
    }
    classifyTopPlace(id, display) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield this.repository.findOneById(id);
            if (entity === null)
                throw new error_interface_1.MessageCodeError("page:classify:classifyIdMissing");
            const array = yield this.getClassifyId(id);
            array.push(id);
            const newArray = Array.from(new Set(array));
            let num = 0;
            const result = yield this.artRepository
                .createQueryBuilder()
                .where("\"classifyId\" in ( :id)", { id: newArray })
                .andWhere("\"topPlace\"<> :topPlace", { topPlace: "global" })
                .getMany();
            const numArray = [];
            for (const t in display) {
                const array = yield this.getClassifyId(display[t]);
                const newArray = Array.from(new Set(array));
                numArray.push(...newArray);
            }
            numArray.push(...display);
            const finalArray = Array.from(new Set(numArray));
            for (const t in result) {
                let newArt = new article_entity_1.ArticleEntity();
                newArt = result[t];
                newArt.topPlace = "global";
                newArt.display = finalArray.toString();
                newArt.updateAt = new Date();
                this.artRepository.updateById(newArt.id, newArt);
                num++;
            }
            return num;
        });
    }
    findClassifyById(useFor, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let result, messageCodeError;
            const array = [];
            if (useFor === "art") {
                const entity = yield this.repository.findOneById(id);
                if (entity === null)
                    messageCodeError = "当前分类不存在";
                array.push(id);
                array.push(entity.groupId);
                result = yield this.repository
                    .createQueryBuilder()
                    .where("\"id\" in ( :id)", { id: array })
                    .orderBy("id", "ASC")
                    .getMany();
            }
            if (useFor === "page") {
                const entity = yield this.pageRepository.findOneById(id);
                if (entity === null)
                    messageCodeError = "当前分类不存在";
                array.push(id);
                array.push(entity.groupId);
                result = yield this.pageRepository
                    .createQueryBuilder()
                    .where("\"id\" in ( :id)", { id: array })
                    .orderBy("id", "ASC").getMany();
            }
            if (result !== null) {
                messageCodeError = "查找成功";
            }
            return { classifyEntity: result, MessageCodeError: messageCodeError };
        });
    }
    TimestampArt(art) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            for (const t in art) {
                const classify = yield this.repository.findOneById(art[t].classifyId);
                art[t].classify = classify.title;
                result.push(art[t]);
            }
            return result;
        });
    }
    classifyCheck(useFor, id, groupId, alias, deleteNum) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            let update = true;
            if (id > 0) {
                if (useFor === "art") {
                    const entity = yield this.repository.findOneById(id);
                    if (entity === null)
                        result = "当前文章分类不存在";
                    update = false;
                }
                else {
                    const entity = yield this.pageRepository.findOneById(id);
                    if (entity === null)
                        result = "当前页面分类不存在";
                    update = false;
                }
            }
            if (groupId > 0) {
                if (useFor === "art") {
                    const entityAll = yield this.repository.find();
                    if (entityAll.length > 0) {
                        const entity = yield this.repository.findOneById(groupId);
                        if (entity === null)
                            result = "当前文章分类父级分类不存在";
                        update = false;
                    }
                }
                else {
                    const entityAll = yield this.pageRepository.find();
                    if (entityAll.length > 0) {
                        const entity = yield this.pageRepository.findOneById(groupId);
                        if (entity === null)
                            result = "当前页面分类父级分类不存在";
                        update = false;
                    }
                }
            }
            if (alias) {
                if (useFor === "art") {
                    if (id) {
                        const classify = yield this.repository.findOneById(id);
                        if (classify.classifyAlias !== alias) {
                            const newClassify = yield this.repository
                                .createQueryBuilder()
                                .where("\"classifyAlias\"= :classifyAlias", { classifyAlias: alias })
                                .getMany();
                            if (newClassify.length > 0)
                                result = "别名不能重复";
                            update = false;
                        }
                    }
                    else {
                        const newClassify = yield this.repository.createQueryBuilder().where("\"classifyAlias\"= :classifyAlias", { classifyAlias: alias }).getMany();
                        if (newClassify.length > 0)
                            result = "别名不能重复";
                        update = false;
                    }
                }
                else {
                    if (id) {
                        const entity = yield this.pageRepository.findOneById(id);
                        if (entity.classifyAlias !== alias) {
                            const newClassify = yield this.pageRepository
                                .createQueryBuilder()
                                .where("\"classifyAlias\"= :classifyAlias", { classifyAlias: alias })
                                .getMany();
                            if (newClassify.length > 0)
                                result = "别名不能重复";
                            update = false;
                        }
                    }
                    else {
                        const newClassify = yield this.pageRepository
                            .createQueryBuilder()
                            .where("\"classifyAlias\"= :classifyAlias", { classifyAlias: alias })
                            .getMany();
                        if (newClassify.length > 0)
                            result = "别名不能重复";
                        update = false;
                    }
                }
            }
            if (deleteNum > 0) {
                if (useFor === "art") {
                    const entity = yield this.repository.findOneById(deleteNum);
                    if (entity === null) {
                        result = "当前分类不存在";
                        update = false;
                    }
                    else {
                        const array = yield this.getClassifyId(deleteNum);
                        const newArray = Array.from(new Set(array));
                        const artiicles = yield this.artRepository
                            .createQueryBuilder()
                            .where("\"classifyId\" in (:id)", { id: newArray }).getMany();
                        if (artiicles.length > 0)
                            result = "当前分类下有文章,不能删除";
                        update = false;
                    }
                }
                else {
                    const entity = yield this.pageRepository.findOneById(deleteNum);
                    if (entity === null) {
                        result = "当前分类不存在";
                        update = false;
                    }
                    else {
                        const array = yield this.getClassifyIdPage(deleteNum);
                        const newArray = Array.from(new Set(array));
                        const artiicles = yield this.repositoryPage
                            .createQueryBuilder()
                            .where("\"classifyId\" in (:id)", { id: newArray }).getMany();
                        if (artiicles.length > 0)
                            result = "当前分类下有页面,不能删除";
                        update = false;
                    }
                }
            }
            if (!result) {
                update = true;
            }
            return { MessageCodeError: result, Continue: update };
        });
    }
};
ClassifyService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(classify_entity_1.ClassifyEntity)),
    __param(1, typeorm_1.InjectRepository(article_entity_1.ArticleEntity)),
    __param(2, typeorm_1.InjectRepository(pageClassify_entity_1.PageClassifyEntity)),
    __param(3, typeorm_1.InjectRepository(page_entity_1.PageEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ClassifyService);
exports.ClassifyService = ClassifyService;
