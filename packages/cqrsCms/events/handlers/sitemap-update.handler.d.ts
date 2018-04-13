import { IEventHandler } from "@nestjs/cqrs";
import { SitemapService } from "../../../sitemap/sitemap.service";
import { SitemapUpdateEvent } from "../impl/sitemap-update.event";
export declare class SitemapUpdateHandler implements IEventHandler<SitemapUpdateEvent> {
    readonly sitemapService: SitemapService;
    constructor(sitemapService: SitemapService);
    handle(event: SitemapUpdateEvent): Promise<void>;
}
