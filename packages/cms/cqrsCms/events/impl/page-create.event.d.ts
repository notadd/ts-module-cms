import { IEvent } from "@nestjs/cqrs";
import { PageContentEntity } from "../../../entity/page.content.entity";
import { PageEntity } from "../../../entity/page.entity";
export declare class PageCreateEvent implements IEvent {
    page: PageEntity;
    content: Array<PageContentEntity>;
    constructor(page: PageEntity, content: Array<PageContentEntity>);
}
