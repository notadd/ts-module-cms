import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { SitemapService } from "../../../sitemap/sitemap.service";
import { SitemapCreateEvent } from "../impl/sitemap-create.event";

@EventsHandler(SitemapCreateEvent)
export class SitemapCreateHandler implements IEventHandler<SitemapCreateEvent> {
    constructor(readonly sitemapService: SitemapService) {
    }

    async handle(event: SitemapCreateEvent) {
        const url = "www.baidu.com";
        const arrayBaiduSiteMapOptions = {
            xmlFileName: event.createXml.xmlFileName,
            xmlSiteMap: event.createXml.xmlSiteMap,
            updateWhenPost: event.createXml.updateWhenPost,
            postLimit1000: event.createXml.postLimit1000,
            pageSelect: event.createXml.pageSelect,
            postSelect: event.createXml.postSelect
        };
        this.sitemapService.commitXML(arrayBaiduSiteMapOptions, url);
    }
}
