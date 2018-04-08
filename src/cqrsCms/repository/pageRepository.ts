import { Component } from "@nestjs/common";
import { SitemapService } from "../../sitemap/sitemap.service";
import { Page } from "../models/page.model";
import { Sitemap } from "../models/sitemap.model";
import { siteMap, userPage } from "./fixtures/page";

@Component()
export class PageRepository {
    constructor(readonly sitemapService: SitemapService) {
    }

    async find(id: string): Promise<Page> {
        return userPage;
    }

    async siteMap(): Promise<Sitemap> {
        return siteMap;
    }
}
