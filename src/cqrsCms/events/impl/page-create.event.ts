import { IEvent } from "@nestjs/cqrs";
import { PageContentEntity } from "../../../entity/page.content.entity";
import { PageEntity } from "../../../entity/page.entity";

export class PageCreateEvent implements IEvent {
    constructor(
        public  page: PageEntity,
        public content: Array<PageContentEntity>,
    ) {
    }
}
