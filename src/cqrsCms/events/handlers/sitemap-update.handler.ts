import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SitemapService } from "../../../sitemap/sitemap.service";
import { SitemapUpdateEvent } from "../impl/sitemap-update.event";

@EventsHandler(SitemapUpdateEvent)
export class SitemapUpdateHandler implements IEventHandler<SitemapUpdateEvent> {
    constructor(readonly sitemapService: SitemapService) {
    }

    async handle(event: SitemapUpdateEvent) {
        const url = "www.baidu.com";
        await this.sitemapService.UpdateXMLFile(0, url);
    }

}
