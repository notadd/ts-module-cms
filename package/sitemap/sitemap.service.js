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
const article_entity_1 = require("../entity/article.entity");
const page_entity_1 = require("../entity/page.entity");
const sitemap_entity_1 = require("../entity/sitemap.entity");
let SitemapService = class SitemapService {
    constructor(artRepository, pageRepository, siteRepository) {
        this.artRepository = artRepository;
        this.pageRepository = pageRepository;
        this.siteRepository = siteRepository;
    }
    commitXML(arrayOptions, url) {
        return __awaiter(this, void 0, void 0, function* () {
            let sitemap = yield this.siteRepository.findOneById(1);
            if (sitemap === null) {
                sitemap = arrayOptions;
                let fileName;
                if (arrayOptions.xmlFileName) {
                    fileName = "sitemap_baidu";
                }
                else {
                    fileName = "sitemap";
                }
                sitemap.xmlFileName = fileName;
                yield this.siteRepository.insert(sitemap);
            }
            else {
                sitemap = arrayOptions;
                let fileName;
                if (arrayOptions.xmlFileName) {
                    fileName = "sitemap_baidu";
                }
                else {
                    fileName = "sitemap";
                }
                sitemap.xmlFileName = fileName;
                if (arrayOptions.xmlSiteMap)
                    sitemap.xmlSiteMap = arrayOptions.xmlSiteMap;
                if (arrayOptions.pageSelect)
                    sitemap.pageSelect = arrayOptions.pageSelect;
                if (arrayOptions.postSelect)
                    sitemap.postSelect = arrayOptions.postSelect;
                if (arrayOptions.updateWhenPost)
                    sitemap.updateWhenPost = arrayOptions.updateWhenPost;
                if (arrayOptions.postLimit1000)
                    sitemap.postLimit1000 = arrayOptions.postLimit1000;
                yield this.siteRepository.updateById(1, sitemap);
            }
        });
    }
    UpdateXMLFile($mes = 0, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const sitemap = yield this.siteRepository.findOneById(1);
            if (sitemap.xmlSiteMap) {
                this.buildSitemapXml(url);
            }
        });
    }
    getBaiduOptions(getBaiduOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            getBaiduOptions = yield this.siteRepository.findOneById(1);
            let arrayOptions = new sitemap_entity_1.SitemapEntity();
            if (getBaiduOptions) {
                arrayOptions = getBaiduOptions;
            }
            else {
                if (!arrayOptions) {
                    arrayOptions.xmlFileName = "sitemap_baidu";
                }
                if (!arrayOptions.xmlSiteMap) {
                    arrayOptions.xmlSiteMap = true;
                }
                if (!arrayOptions.updateWhenPost) {
                    arrayOptions.updateWhenPost = true;
                }
                if (!arrayOptions.postLimit1000) {
                    arrayOptions.postLimit1000 = false;
                }
                if (!arrayOptions.postSelect) {
                    arrayOptions.postSelect = true;
                }
                if (!arrayOptions.pageSelect) {
                    arrayOptions.pageSelect = true;
                }
            }
            return arrayOptions;
        });
    }
    buildSitemapXml(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const arrayOptions = yield this.getBaiduOptions().then(a => {
                return a;
            });
            let limit;
            if (arrayOptions.postLimit1000) {
                limit = 1000;
            }
            else {
                limit = 10000;
            }
            const fs = require("fs");
            const file = `${(process.cwd()).substring(0, (process.cwd()).lastIndexOf("/"))}/public/`;
            const ws = fs.createWriteStream(`${file}${arrayOptions.xmlFileName}.xml`);
            const builder = require("xmlbuilder");
            const root = builder.create("urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"");
            let num = 1;
            if (arrayOptions.postSelect) {
                const mini = yield this.artRepository.createQueryBuilder("art").orderBy("art.updateAt", "DESC").limit(limit / 2).getMany();
                for (const t in mini) {
                    const newTime = mini[t].updateAt;
                    const update = newTime;
                    const item = root.ele("url");
                    const sequence = num++;
                    item.ele("sequence", sequence);
                    item.ele("loc", `${url.replace("'", "").replace("'", "")}/${mini[t].name}`);
                    item.ele("changefreq", "weekly");
                    item.ele("lastmod", `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`);
                }
            }
            if (arrayOptions.pageSelect) {
                const mini = yield this.pageRepository.createQueryBuilder("page").orderBy("page.updateAt", "DESC").limit(limit / 2).getMany();
                for (const t in mini) {
                    const newTime = mini[t].updateAt;
                    const update = newTime;
                    const item = root.ele("url");
                    const sequence = num++;
                    item.ele("sequence", sequence);
                    item.ele("loc", `${url.replace("'", "").replace("'", "")}/${mini[t].title}`);
                    item.ele("changefreq", "weekly");
                    item.ele("lastmod", `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`);
                }
            }
            root.end({ pretty: false });
            ws.write(`<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="./sitemap.xsl"?>\n${root.toString().substring(0, root.toString().lastIndexOf("urlset") + 6)}>`);
            ws.end();
        });
    }
};
SitemapService = __decorate([
    common_1.Component(),
    __param(0, typeorm_1.InjectRepository(article_entity_1.ArticleEntity)),
    __param(1, typeorm_1.InjectRepository(page_entity_1.PageEntity)),
    __param(2, typeorm_1.InjectRepository(sitemap_entity_1.SitemapEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SitemapService);
exports.SitemapService = SitemapService;
