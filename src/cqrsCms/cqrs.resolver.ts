import { Mutation, Query, Resolver } from "@nestjs/graphql";
import { ArticleEntity } from "../entity/article.entity";
import { PageContentEntity } from "../entity/page.content.entity";
import { PageEntity } from "../entity/page.entity";
import { PagerService } from "../export/common.paging";
import { ContentMap } from "./common/param.dto";
import { CqrsService } from "./cqrs.service";
import { MessageCodeError } from "./errorMessage/error.interface";
import { ArticleCurdVm } from "./models/view/article-curd.vm";
import { ClassifyCurdVm } from "./models/view/classify-curd.vm";
import { CreatePageVm } from "./models/view/create-page.vm";
import { CreateXmlVm } from "./models/view/create-xml-vm";
import { GetPageVm } from "./models/view/get-page.vm";
import { ClassifyService } from "./service/classify.service";

@Resolver()
export class CqrsResolver {
    constructor(
        private readonly classifyService: ClassifyService,
        private readonly sitemapService: CqrsService,
        private readonly pagerService: PagerService) {
    }

    /**
     * 创建地图xml文件
     * @param obj
     * @param arg
     * @returns {Promise<CreateParamDto>}
     */
    @Query()
    async createFile(obj, arg) {
        const str: string = JSON.stringify(arg);
        const bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const createxml: CreateXmlVm = map.get("buildxml");
        const result = this.sitemapService.createXml(createxml);
        return result;
    }

    /**
     * 修改地图xml文件
     * @param obj
     * @param arg
     * @returns {Promise<CreateParamDto>}
     */
    @Query()
    async updateFile(obj, arg) {
        const str: string = JSON.stringify(arg);
        const bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const createxml: CreateXmlVm = map.get("updateFile");
        const result = this.sitemapService.updateXml();
        return createxml;
    }

    /**
     * 文章分页的查询方法
     * @param obj
     * @param arg
     * @returns {Promise<ArticleEntity[]>}
     */

    @Query()
    async getArticlesLimit(obj, body: {
        getArticleAll: { hidden: boolean, limitNum: number, pages: number },
        recycleFind: { limitNum: number, pages: number }, reductionGetByClassifyId: { id: number, limitNum: number, pages: number },
        findTopPlace: { limitNum: number, pages: number }, serachArticle: { keyWords: string, classifyId: number, topPlace: boolean, limitNum: number, pages: number },
        keywordSearch: { keyWords: string, limitNum: number, pages: number }
    }) {
        const { getArticleAll, recycleFind, reductionGetByClassifyId, findTopPlace, serachArticle, keywordSearch } = body;
        let result: Array<ArticleEntity>;
        const articleVM: ArticleCurdVm = new ArticleCurdVm();
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
            let keyWords: string = serachArticle.keyWords;
            const limitNum: number = serachArticle.limitNum;
            const pages: number = serachArticle.pages;
            const groupId: number = serachArticle.classifyId;
            const findTop: boolean = serachArticle.topPlace;
            if (!keyWords) keyWords = "";
            articleVM.getArticles = { getArticleByClassifyId: { classifyId: groupId, top: findTop, name: keyWords } };
            articleVM.limitNum = limitNum;
            articleVM.pages = pages;
        }
        if (keywordSearch !== null && keywordSearch !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(keywordSearch);
            const keyWords: string = keywordSearch.keyWords;
            articleVM.getArticles = { keywordSearch: { keywords: keyWords } };
            articleVM.limitNum = keywordSearch.limitNum;
            articleVM.pages = keywordSearch.pages;
        }
        articleVM.getAllArticles = true;
        const resultArt = await this.sitemapService.articleCurd(articleVM);
        const paging = this.pagerService.getPager(resultArt.totalItems, articleVM.pages, articleVM.limitNum);
        result = await this.classifyService.TimestampArt(resultArt.articles);
        return { pagination: paging, articles: result };

    }

    /**
     * 不分页获取文章
     * @param obj
     * @param argclassify_curd
     * @returns {Promise<any>}
     */
    @Query()
    async getArticlesNoLimit(obj, body: { getArticleById: { id: number }, showNext: { id: number }, superiorArticle: { id: number }, getCurrentClassifyArticles: { id: number } }) {
        const { getArticleById, showNext, superiorArticle, getCurrentClassifyArticles } = body;
        let result: Array<ArticleEntity>;
        const articleVM: ArticleCurdVm = new ArticleCurdVm();
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
        /*未定是否开放*/
        /*  let getLevelByClassifyId=map.get("getLevelByClassifyId");
          if(getLevelByClassifyId!==null && getLevelByClassifyId !==undefined){
              let amap=new Map();
              amap=this.objToStrMap(getLevelByClassifyId);
              articleVM.getArticles={getLevelByClassifyId:amap.get("id")};
             /!* const result=this.articleService.getLevelByClassifyId(amap.get("id"));
              return result;*!/
          }*/
        articleVM.getAllArticles = true;
        const entity = await this.sitemapService.articleCurd(articleVM);
        result = await this.classifyService.TimestampArt(entity.articles);
        return result;

    }

    /**
     * 获取分类
     * @param obj
     * @param arg
     * @returns {any}
     */
    @Query()
    getClassifys(obj, body: { getAllClassify: { useFor: string, id: number } }) {
        const { getAllClassify } = body;
        let result;
        const classifyVM: ClassifyCurdVm = new ClassifyCurdVm();
        if (getAllClassify !== null && getAllClassify !== undefined) {
            const useFor: string = getAllClassify.useFor;
            let id: number = getAllClassify.id;
            if (id === null && id === 0) {
                id = 1;
            }
            classifyVM.useFor = useFor;
            classifyVM.getAllClassify = true;
        }
        result = this.sitemapService.getClassify(classifyVM);
        return result;
    }

    @Query()
    async getClassifyById(obj, body: { getClassifyById: { useFor: string, id: number } }) {
        const { getClassifyById } = body;
        let result;
        const classifyVM: ClassifyCurdVm = new ClassifyCurdVm();
        if (getClassifyById !== null && getClassifyById !== undefined) {
            const usedFor: string = getClassifyById.useFor;
            let idNum: number = getClassifyById.id;
            if (idNum === null && idNum === 0) {
                idNum = 1;
            }
            classifyVM.getClassifyById = { useFor: usedFor, id: idNum };
        }
        result = await this.sitemapService.getClassify(classifyVM);
        return result;
    }

    /**
     * 获取页面
     * @param obj
     * @param arg
     * @returns {Promise<PageEntity[]>}
     */
    @Query()
    async getPagesLimit(obj, arg) {
        const str: string = JSON.stringify(arg);
        const bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const getAllPage = map.get("getAllPage");
        const pageParam: GetPageVm = new GetPageVm();
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

        const resultPage = await this.sitemapService.getPages(pageParam).then(a => {
            return a;
        });
        const paging = this.pagerService.getPager(resultPage.totalItems, pageParam.pages, pageParam.limit);
        return { pagination: paging, pages: resultPage.pages };
    }

    /**
     * 获取单个页面
     * @param obj
     * @param arg
     * @returns {Promise<PageEntity[]>}
     */
    @Query()
    getPageById(obj, arg) {
        const str: string = JSON.stringify(arg);
        const bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const findPageById = map.get("findPageById");
        if (findPageById !== null && findPageById !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(findPageById);
            const pageParam: GetPageVm = new GetPageVm();
            pageParam.id = amap.get("id");
            const result = this.sitemapService.getPages(pageParam);
            return result;
        }
    }

    /**
     * 文章的增加和修改
     * @param obj
     * @param arg
     * @returns {Promise<string>}
     * @constructor
     */
    @Mutation()
    async ArticleCU(obj, arg) {
        const str: string = JSON.stringify(arg);
        const bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const createArt = map.get("createArt");
        const articleVM: ArticleCurdVm = new ArticleCurdVm();
        articleVM.limitNum = map.get("limitNum");
        articleVM.pages = map.get("pages");
        articleVM.hidden = map.get("hidden");
        if (createArt !== null && createArt !== undefined) {
            const art: ArticleEntity = createArt;
            if (art.publishedTime) {
                const date: string = art.publishedTime.toString();
                art.publishedTime = new Date(Date.parse(date.replace(/- /g, "/")));
            } else {
                art.publishedTime = undefined;
            }
            if (art.endTime) {
                const endTime: string = art.endTime.toString();
                art.endTime = new Date(Date.parse(endTime.replace(/- /g, "/")));
            }
            if (art.startTime) {
                const startTime: string = art.startTime.toString();
                art.startTime = new Date(Date.parse(startTime.replace(/- /g, "/")));
            }
            const newArticle: ArticleEntity = art;
            articleVM.createArticle = { article: newArticle };
        }
        const updateArt = map.get("updateArt");
        if (updateArt !== null && updateArt !== undefined) {
            const art: ArticleEntity = updateArt;
            if (art.publishedTime) {
                const date: string = art.publishedTime.toString();
                art.publishedTime = new Date(Date.parse(date.replace(/- /g, "/")));
            }
            if (art.startTime) {
                const startTime: string = art.startTime.toString();
                art.startTime = new Date(Date.parse(startTime.replace(/- /g, "/")));
            }
            if (art.endTime) {
                const endTime: string = art.endTime.toString();
                art.endTime = new Date(Date.parse(endTime.replace(/- /g, "/")));
            }
            const newArticle: ArticleEntity = art;
            articleVM.updateArticle = { article: newArticle };

        }
        const deleteById = map.get("deleteById");
        if (deleteById !== null && deleteById !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(deleteById);
            const array: [ number ] = amap.get("id");
            articleVM.deleteById = array;
        }
        const recycleDelete = map.get("recycleDelete");
        if (recycleDelete !== null && recycleDelete !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(recycleDelete);
            const array: [ number ] = amap.get("id");
            articleVM.recycleDelete = array;
        }
        const reductionArticle = map.get("reductionArticle");
        if (reductionArticle !== null && reductionArticle !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(reductionArticle);
            const array: [ number ] = amap.get("id");
            articleVM.reductionArticle = array;
        }
        /*批量反向置顶,暂不修改*/
        const classifyTopPlace = map.get("classifyTopPlace");
        if (classifyTopPlace !== null && classifyTopPlace !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(classifyTopPlace);
            const id = amap.get("id");
            const num = await this.classifyService.classifyTopPlace(id, amap.get("display"));
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
                id: amap.get("id"),
            };
        }
        const result = await this.sitemapService.articleCurd(articleVM);
        return JSON.stringify(result);
    }

    /**
     * 分类的增加、修改 分文章和页面两种
     * @param obj
     * @param arg
     * @returns {any}
     * @constructor
     */
    @Mutation()
    async ClassifyCU(obj, arg) {
        const str: string = JSON.stringify(arg);
        const bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const createArt = map.get("createClass");
        const classifyVM: ClassifyCurdVm = new ClassifyCurdVm();
        if (createArt !== null && createArt !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(createArt);
            const useFor: string = amap.get("useFor");
            let id: number = amap.get("id");
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
            const useFor: string = amap.get("useFor");
            let id: number = amap.get("id");
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
            const useFor: string = amap.get("useFor");
            let id: number = amap.get("id");
            if (id === null && id === 0) {
                id = 1;
            }
            if (id === 1) throw new MessageCodeError("drop:table:ById1");
            classifyVM.useFor = useFor;
            classifyVM.deleteClassify = id;
        }
        const mobileTheClassify = map.get("mobileTheClassify");
        if (mobileTheClassify !== null && mobileTheClassify !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(mobileTheClassify);
            const useFor: string = amap.get("useFor");
            const idNum: number = amap.get("id");
            let parentIdNum: number = amap.get("parentId");
            if (parentIdNum === null && parentIdNum === 0) {
                parentIdNum = 1;
            }
            classifyVM.useFor = useFor;
            classifyVM.mobileClassifyId = { id: idNum, parentId: parentIdNum };
        }
        const result = await this.sitemapService.classifyCurd(classifyVM);
        return JSON.stringify(result);
    }

    @Mutation()
    async PageCUD(obj, arg) {
        const str: string = JSON.stringify(arg);
        const bToJSon = JSON.parse(str);
        let map = new Map();
        map = this.objToStrMap(bToJSon);
        const createPages = map.get("createPages");
        const createParam: CreatePageVm = new CreatePageVm();
        if (createPages !== null && createPages !== undefined) {
            let amap = new Map();
            amap = this.objToStrMap(createPages);
            const page = new PageEntity();
            page.title = amap.get("title");
            page.alias = amap.get("alias");
            page.classify = amap.get("classify");
            page.classifyId = amap.get("classifyId");
            const contents: Array<PageContentEntity> = [];
            const strFinal: Array<string> = amap.get("content");
            for (const t in strFinal) {
                const newContent: PageContentEntity = new PageContentEntity();
                newContent.content = strFinal[ t ];
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
            const page: PageEntity = new PageEntity();
            page.id = amap.get("id");
            page.title = amap.get("title");
            page.alias = amap.get("alias");
            page.classify = amap.get("classify");
            page.classifyId = amap.get("classifyId");
            const contents: Array<PageContentEntity> = [];
            const strFinal: Array<ContentMap> = amap.get("content");
            for (const t in strFinal) {
                const newContent: PageContentEntity = new PageContentEntity();
                let amap = new Map();
                amap = this.objToStrMap(strFinal[ t ]);
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
            const array: [ number ] = amap.get("id");
            createParam.limit = amap.get("limitNum");
            createParam.pages = amap.get("pages");
            createParam.array = array;
        }
        const result = await this.sitemapService.pageCurd(createParam);
        return JSON.stringify(result);
    }

    /**
     * JSON----Map
     * @param obj
     * @returns {Map<string, string>}
     */
    objToStrMap(obj): Map<string, string> {
        const strMap = new Map();
        if (obj) {
            for (const k of Object.keys(obj)) {
                strMap.set(k, obj[ k ]);
            }
        }
        return strMap;
    }

}
