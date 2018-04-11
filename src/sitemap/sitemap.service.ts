import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleEntity } from "../entity/article.entity";
import { PageEntity } from "../entity/page.entity";
import { SitemapEntity } from "../entity/sitemap.entity";
import builder from "xmlbuilder";

@Component()
export class SitemapService {
    constructor(@InjectRepository(ArticleEntity) private readonly artRepository: Repository<ArticleEntity>,
                @InjectRepository(PageEntity) private readonly pageRepository: Repository<PageEntity>,
                @InjectRepository(SitemapEntity) private readonly siteRepository: Repository<SitemapEntity>
    ) {
    }

    /**
     * 设置参数
     * @param arrayOptions
     * @param {string} url
     * @returns {Promise<void>}
     */
    public async commitXML(arrayOptions, url: string) {
        let sitemap: SitemapEntity = await this.siteRepository.findOneById(1);
        if (sitemap === null) {
            sitemap = arrayOptions;
            let fileName: string;
            if (arrayOptions.xmlFileName) {
                fileName = "sitemap_baidu";
            } else {
                fileName = "sitemap";
            }
            sitemap.xmlFileName = fileName;
            await this.siteRepository.insert(sitemap);
        } else {
            sitemap = arrayOptions;
            let fileName: string;
            if (arrayOptions.xmlFileName) {
                fileName = "sitemap_baidu";
            } else {
                fileName = "sitemap";
            }
            sitemap.xmlFileName = fileName;
            if (arrayOptions.xmlSiteMap) sitemap.xmlSiteMap = arrayOptions.xmlSiteMap;
            if (arrayOptions.pageSelect) sitemap.pageSelect = arrayOptions.pageSelect;
            if (arrayOptions.postSelect) sitemap.postSelect = arrayOptions.postSelect;
            if (arrayOptions.updateWhenPost) sitemap.updateWhenPost = arrayOptions.updateWhenPost;
            if (arrayOptions.postLimit1000) sitemap.postLimit1000 = arrayOptions.postLimit1000;
            await this.siteRepository.updateById(1, sitemap);
        }
    }

    public async UpdateXMLFile($mes = 0, url: string) {
        const sitemap: SitemapEntity = await this.siteRepository.findOneById(1);
        if (sitemap.xmlSiteMap) {
            this.buildSitemapXml(url);
        }
    }

    /**
     * 函数判断
     * @returns {any[]}
     */
    public async getBaiduOptions(getBaiduOptions?) {
        getBaiduOptions = await this.siteRepository.findOneById(1);
        let arrayOptions = new SitemapEntity();
        if (getBaiduOptions) {
            arrayOptions = getBaiduOptions;
        } else {
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
    }

    /**
     * 生成xml文件
     * @param $xml_contents
     * @param $mes
     */
    public async buildSitemapXml(url: string) {
        const arrayOptions = await this.getBaiduOptions().then(a => {
            return a;
        });
        let limit: number;
        /*只更新最近1000篇文章*/
        if (arrayOptions.postLimit1000) {
            limit = 1000;
        } else {
            limit = 10000;
        }
        const fs = require("fs");
        const file = `${(__dirname).substring(0, (__dirname).lastIndexOf("/"))}/public/`;
        const ws = fs.createWriteStream(`${file}${arrayOptions.xmlFileName}.xml`);
        const builder = require("xmlbuilder");
        const root = builder.create("urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"");
        let num = 1;
        /*链接包括文章*/
        if (arrayOptions.postSelect) {
            const mini: Array<ArticleEntity> = await this.artRepository.createQueryBuilder("art").orderBy("art.updateAt", "DESC").limit(limit / 2).getMany();
            for (const t in mini) {
                const newTime: Date = mini[ t ].updateAt;
                const update: Date = newTime;
                const item = root.ele("url");
                const sequence = num++;
                item.ele("sequence", sequence);
                item.ele("loc", `${url.replace("'", "").replace("'", "")}/${mini[ t ].name}`);
                /*item.ele("loc","https:/*docs.nestjs.com/recipes/cqrs");*/
                item.ele("changefreq", "weekly");
                item.ele("lastmod", `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`);
            }
        }
        /*链接包括页面*/
        if (arrayOptions.pageSelect) {
            const mini: Array<PageEntity> = await this.pageRepository.createQueryBuilder("page").orderBy("page.updateAt", "DESC").limit(limit / 2).getMany();
            for (const t in mini) {
                const newTime: Date = mini[ t ].updateAt;
                const update: Date = newTime;
                const item = root.ele("url");
                const sequence = num++;
                item.ele("sequence", sequence);
                item.ele("loc", `${url.replace("'", "").replace("'", "")}/${mini[ t ].title}`);
                /* item.ele("loc","https:/*docs.nestjs.com/recipes/cqrs");*/
                item.ele("changefreq", "weekly");
                item.ele("lastmod", `${update.toLocaleDateString()} ${update.toLocaleTimeString()}`);
            }
        }
        root.end({ pretty: false });
        ws.write(`<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="./sitemap.xsl"?>\n${root.toString().substring(0, root.toString().lastIndexOf("urlset") + 6)}>`);
        ws.end();
    }
}
