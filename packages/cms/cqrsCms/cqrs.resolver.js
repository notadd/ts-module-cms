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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("@nestjs/graphql");
const page_content_entity_1 = require("../entity/page.content.entity");
const page_entity_1 = require("../entity/page.entity");
const common_paging_1 = require("../export/common.paging");
const cqrs_service_1 = require("./cqrs.service");
const error_interface_1 = require("./errorMessage/error.interface");
const article_curd_vm_1 = require("./models/view/article-curd.vm");
const classify_curd_vm_1 = require("./models/view/classify-curd.vm");
const create_page_vm_1 = require("./models/view/create-page.vm");
const get_page_vm_1 = require("./models/view/get-page.vm");
const classify_service_1 = require("./service/classify.service");
let CqrsResolver = class CqrsResolver {
    constructor(classifyService, sitemapService, pagerService) {
        this.classifyService = classifyService;
        this.sitemapService = sitemapService;
        this.pagerService = pagerService;
    }
    createFile(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            const bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            const createxml = map.get("buildxml");
            const result = this.sitemapService.createXml(createxml);
            return result;
        });
    }
    updateFile(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            const bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            const createxml = map.get("updateFile");
            const result = this.sitemapService.updateXml();
            return createxml;
        });
    }
    getArticlesLimit(obj, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { getArticleAll, recycleFind, reductionGetByClassifyId, findTopPlace, serachArticle, keywordSearch } = body;
            let result;
            const articleVM = new article_curd_vm_1.ArticleCurdVm();
            if (getArticleAll !== null && getArticleAll !== undefined) {
                articleVM.getArticles = { getArticleAll: true, hidden: getArticleAll.hidden };
                articleVM.limitNum = getArticleAll.limitNum;
                articleVM.pages = getArticleAll.pages;
            }
            if (recycleFind !== null && recycleFind !== undefined) {
                articleVM.getArticles = { recycleFind: true };
                articleVM.limitNum = recycleFind.limitNum;
                articleVM.pages = recycleFind.pages;
            }
            if (reductionGetByClassifyId !== null && reductionGetByClassifyId !== undefined) {
                articleVM.getArticles = { reductionGetByClassifyId: reductionGetByClassifyId.id };
                articleVM.limitNum = reductionGetByClassifyId.limitNum;
                articleVM.pages = reductionGetByClassifyId.pages;
            }
            if (findTopPlace !== null && findTopPlace !== undefined) {
                articleVM.getArticles = { findTopPlace: true };
                articleVM.limitNum = findTopPlace.limitNum;
                articleVM.pages = findTopPlace.pages;
            }
            if (serachArticle !== null && serachArticle !== undefined) {
                let keyWords = serachArticle.keyWords;
                const limitNum = serachArticle.limitNum;
                const pages = serachArticle.pages;
                const groupId = serachArticle.classifyId;
                const findTop = serachArticle.topPlace;
                if (!keyWords)
                    keyWords = "";
                articleVM.getArticles = { getArticleByClassifyId: { classifyId: groupId, top: findTop, name: keyWords } };
                articleVM.limitNum = limitNum;
                articleVM.pages = pages;
            }
            if (keywordSearch !== null && keywordSearch !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(keywordSearch);
                const keyWords = keywordSearch.keyWords;
                articleVM.getArticles = { keywordSearch: { keywords: keyWords } };
                articleVM.limitNum = keywordSearch.limitNum;
                articleVM.pages = keywordSearch.pages;
            }
            articleVM.getAllArticles = true;
            const resultArt = yield this.sitemapService.articleCurd(articleVM);
            const paging = this.pagerService.getPager(resultArt.totalItems, articleVM.pages, articleVM.limitNum);
            result = yield this.classifyService.TimestampArt(resultArt.articles);
            return { pagination: paging, articles: result };
        });
    }
    getArticlesNoLimit(obj, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { getArticleById, showNext, superiorArticle, getCurrentClassifyArticles } = body;
            let result;
            const articleVM = new article_curd_vm_1.ArticleCurdVm();
            if (showNext !== null && showNext !== undefined) {
                articleVM.getArticles = { showNext: showNext.id };
            }
            if (getArticleById !== null && getArticleById !== undefined) {
                articleVM.getArticles = { getArticleById: getArticleById.id };
            }
            if (superiorArticle !== null && superiorArticle !== undefined) {
                articleVM.getArticles = { superiorArticle: superiorArticle.id };
            }
            if (getCurrentClassifyArticles !== null && getCurrentClassifyArticles !== undefined) {
                articleVM.getArticles = { getCurrentClassifyArticles: getCurrentClassifyArticles.id };
            }
            articleVM.getAllArticles = true;
            const entity = yield this.sitemapService.articleCurd(articleVM);
            result = yield this.classifyService.TimestampArt(entity.articles);
            return result;
        });
    }
    getClassifys(obj, body) {
        const { getAllClassify } = body;
        let result;
        const classifyVM = new classify_curd_vm_1.ClassifyCurdVm();
        if (getAllClassify !== null && getAllClassify !== undefined) {
            const useFor = getAllClassify.useFor;
            let id = getAllClassify.id;
            if (id === null && id === 0) {
                id = 1;
            }
            classifyVM.useFor = useFor;
            classifyVM.getAllClassify = true;
        }
        result = this.sitemapService.getClassify(classifyVM);
        return result;
    }
    getClassifyById(obj, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { getClassifyById } = body;
            let result;
            const classifyVM = new classify_curd_vm_1.ClassifyCurdVm();
            if (getClassifyById !== null && getClassifyById !== undefined) {
                const usedFor = getClassifyById.useFor;
                let idNum = getClassifyById.id;
                if (idNum === null && idNum === 0) {
                    idNum = 1;
                }
                classifyVM.getClassifyById = { useFor: usedFor, id: idNum };
            }
            result = yield this.sitemapService.getClassify(classifyVM);
            return result;
        });
    }
    getPagesLimit(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            const bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            const getAllPage = map.get("getAllPage");
            const pageParam = new get_page_vm_1.GetPageVm();
            if (getAllPage !== null && getAllPage !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(getAllPage);
                pageParam.getAll = true;
                pageParam.limit = amap.get("limitNum");
                pageParam.pages = amap.get("pages");
            }
            const serachPages = map.get("serachPages");
            if (serachPages !== null && serachPages !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(serachPages);
                pageParam.keywords = amap.get("keywords");
                pageParam.limit = amap.get("limitNum");
                pageParam.pages = amap.get("pages");
            }
            const getPagesByClassifyId = map.get("getPagesByClassifyId");
            if (getPagesByClassifyId !== null && getPagesByClassifyId !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(getPagesByClassifyId);
                pageParam.classifyId = amap.get("id");
                pageParam.limit = amap.get("limitNum");
                pageParam.pages = amap.get("pages");
            }
            const resultPage = yield this.sitemapService.getPages(pageParam).then(a => {
                return a;
            });
            const paging = this.pagerService.getPager(resultPage.totalItems, pageParam.pages, pageParam.limit);
            return { pagination: paging, pages: resultPage.pages };
        });
    }
    getPageById(obj, arg) {
        const str = JSON.stringify(arg);
        const bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const findPageById = map.get("findPageById");
        if (findPageById !== null && findPageById !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(findPageById);
            const pageParam = new get_page_vm_1.GetPageVm();
            pageParam.id = amap.get("id");
            const result = this.sitemapService.getPages(pageParam);
            return result;
        }
    }
    ArticleCU(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            const bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            const createArt = map.get("createArt");
            const articleVM = new article_curd_vm_1.ArticleCurdVm();
            articleVM.limitNum = map.get("limitNum");
            articleVM.pages = map.get("pages");
            articleVM.hidden = map.get("hidden");
            if (createArt !== null && createArt !== undefined) {
                const art = createArt;
                if (art.publishedTime) {
                    const date = art.publishedTime.toString();
                    art.publishedTime = new Date(Date.parse(date.replace(/- /g, "/")));
                }
                else {
                    art.publishedTime = undefined;
                }
                if (art.endTime) {
                    const endTime = art.endTime.toString();
                    art.endTime = new Date(Date.parse(endTime.replace(/- /g, "/")));
                }
                if (art.startTime) {
                    const startTime = art.startTime.toString();
                    art.startTime = new Date(Date.parse(startTime.replace(/- /g, "/")));
                }
                const newArticle = art;
                articleVM.createArticle = { article: newArticle };
            }
            const updateArt = map.get("updateArt");
            if (updateArt !== null && updateArt !== undefined) {
                const art = updateArt;
                if (art.publishedTime) {
                    const date = art.publishedTime.toString();
                    art.publishedTime = new Date(Date.parse(date.replace(/- /g, "/")));
                }
                if (art.startTime) {
                    const startTime = art.startTime.toString();
                    art.startTime = new Date(Date.parse(startTime.replace(/- /g, "/")));
                }
                if (art.endTime) {
                    const endTime = art.endTime.toString();
                    art.endTime = new Date(Date.parse(endTime.replace(/- /g, "/")));
                }
                const newArticle = art;
                articleVM.updateArticle = { article: newArticle };
            }
            const deleteById = map.get("deleteById");
            if (deleteById !== null && deleteById !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(deleteById);
                const array = amap.get("id");
                articleVM.deleteById = array;
            }
            const recycleDelete = map.get("recycleDelete");
            if (recycleDelete !== null && recycleDelete !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(recycleDelete);
                const array = amap.get("id");
                articleVM.recycleDelete = array;
            }
            const reductionArticle = map.get("reductionArticle");
            if (reductionArticle !== null && reductionArticle !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(reductionArticle);
                const array = amap.get("id");
                articleVM.reductionArticle = array;
            }
            const classifyTopPlace = map.get("classifyTopPlace");
            if (classifyTopPlace !== null && classifyTopPlace !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(classifyTopPlace);
                const id = amap.get("id");
                const num = yield this.classifyService.classifyTopPlace(id, amap.get("display"));
                const result = `成功将${num}条数据置顶`;
                return result;
            }
            const pictureUpload = map.get("pictureUpload");
            if (pictureUpload !== null && pictureUpload !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(pictureUpload);
                const ws = new Map();
                ws.set("obj", obj);
                articleVM.pictureUpload = {
                    bucketName: amap.get("bucketName"),
                    rawName: amap.get("rawName"),
                    base64: amap.get("base64"),
                    url: ws,
                    id: amap.get("id")
                };
            }
            const result = yield this.sitemapService.articleCurd(articleVM);
            return JSON.stringify(result);
        });
    }
    ClassifyCU(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            const bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            const createArt = map.get("createClass");
            const classifyVM = new classify_curd_vm_1.ClassifyCurdVm();
            if (createArt !== null && createArt !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(createArt);
                const useFor = amap.get("useFor");
                let id = amap.get("id");
                if (id === null && id === 0) {
                    id = 1;
                }
                classifyVM.useFor = useFor;
                if (useFor === "art") {
                    classifyVM.createClassify = { art: amap.get("createClass") };
                }
                if (useFor === "page") {
                    classifyVM.createClassify = { page: amap.get("createClass") };
                }
            }
            const updateClass = map.get("updateClass");
            if (updateClass !== null && updateClass !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(updateClass);
                const useFor = amap.get("useFor");
                let id = amap.get("id");
                if (id === null && id === 0) {
                    id = 1;
                }
                classifyVM.useFor = useFor;
                if (useFor === "art") {
                    classifyVM.updateClassify = { art: amap.get("updateClass") };
                }
                if (useFor === "page") {
                    classifyVM.updateClassify = { page: amap.get("updateClass") };
                }
            }
            const deleteClassifyById = map.get("deleteClassifyById");
            if (deleteClassifyById !== null && deleteClassifyById !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(deleteClassifyById);
                const useFor = amap.get("useFor");
                let id = amap.get("id");
                if (id === null && id === 0) {
                    id = 1;
                }
                if (id === 1)
                    throw new error_interface_1.MessageCodeError("drop:table:ById1");
                classifyVM.useFor = useFor;
                classifyVM.deleteClassify = id;
            }
            const mobileTheClassify = map.get("mobileTheClassify");
            if (mobileTheClassify !== null && mobileTheClassify !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(mobileTheClassify);
                const useFor = amap.get("useFor");
                const idNum = amap.get("id");
                let parentIdNum = amap.get("parentId");
                if (parentIdNum === null && parentIdNum === 0) {
                    parentIdNum = 1;
                }
                classifyVM.useFor = useFor;
                classifyVM.mobileClassifyId = { id: idNum, parentId: parentIdNum };
            }
            const result = yield this.sitemapService.classifyCurd(classifyVM);
            return JSON.stringify(result);
        });
    }
    PageCUD(obj, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const str = JSON.stringify(arg);
            const bToJSon = JSON.parse(str);
            let map = new Map();
            map = this.objToStrMap(bToJSon);
            const createPages = map.get("createPages");
            const createParam = new create_page_vm_1.CreatePageVm();
            if (createPages !== null && createPages !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(createPages);
                const page = new page_entity_1.PageEntity();
                page.title = amap.get("title");
                page.alias = amap.get("alias");
                page.classify = amap.get("classify");
                page.classifyId = amap.get("classifyId");
                const contents = [];
                const strFinal = amap.get("content");
                for (const t in strFinal) {
                    const newContent = new page_content_entity_1.PageContentEntity();
                    newContent.content = strFinal[t];
                    contents.push(newContent);
                }
                createParam.page = page;
                createParam.content = contents;
                createParam.limit = amap.get("limitNum");
                createParam.pages = amap.get("pages");
            }
            const updatePages = map.get("updatePages");
            if (updatePages !== null && updatePages !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(updatePages);
                const page = new page_entity_1.PageEntity();
                page.id = amap.get("id");
                page.title = amap.get("title");
                page.alias = amap.get("alias");
                page.classify = amap.get("classify");
                page.classifyId = amap.get("classifyId");
                const contents = [];
                const strFinal = amap.get("content");
                for (const t in strFinal) {
                    const newContent = new page_content_entity_1.PageContentEntity();
                    let amap = new Map();
                    amap = this.objToStrMap(strFinal[t]);
                    newContent.content = amap.get("content");
                    newContent.id = amap.get("id");
                    contents.push(newContent);
                }
                createParam.page = page;
                createParam.content = contents;
                createParam.limit = amap.get("limitNum");
                createParam.pages = amap.get("pages");
            }
            const deletePages = map.get("deletePages");
            if (deletePages !== null && deletePages !== undefined) {
                let amap = new Map();
                amap = this.objToStrMap(deletePages);
                const array = amap.get("id");
                createParam.limit = amap.get("limitNum");
                createParam.pages = amap.get("pages");
                createParam.array = array;
            }
            const result = yield this.sitemapService.pageCurd(createParam);
            return JSON.stringify(result);
        });
    }
    objToStrMap(obj) {
        const strMap = new Map();
        if (obj) {
            for (const k of Object.keys(obj)) {
                strMap.set(k, obj[k]);
            }
        }
        return strMap;
    }
};
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "createFile", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "updateFile", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "getArticlesLimit", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "getArticlesNoLimit", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CqrsResolver.prototype, "getClassifys", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "getClassifyById", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "getPagesLimit", null);
__decorate([
    graphql_1.Query(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CqrsResolver.prototype, "getPageById", null);
__decorate([
    graphql_1.Mutation(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "ArticleCU", null);
__decorate([
    graphql_1.Mutation(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "ClassifyCU", null);
__decorate([
    graphql_1.Mutation(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CqrsResolver.prototype, "PageCUD", null);
CqrsResolver = __decorate([
    graphql_1.Resolver(),
    __metadata("design:paramtypes", [classify_service_1.ClassifyService,
        cqrs_service_1.CqrsService,
        common_paging_1.PagerService])
], CqrsResolver);
exports.CqrsResolver = CqrsResolver;
