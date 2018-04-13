import { IEventHandler } from "@nestjs/cqrs";
import { SitemapService } from "../../../sitemap/sitemap.service";
import { SitemapCreateEvent } from "../impl/sitemap-create.event";
export declare class SitemapCreateHandler implements IEventHandler<SitemapCreateEvent> {
    readonly sitemapService: SitemapService;
    constructor(sitemapService: SitemapService);
    handle(event: SitemapCreateEvent): Promise<void>;
}
