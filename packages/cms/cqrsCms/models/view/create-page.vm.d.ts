import { PageContentEntity } from "../../../entity/page.content.entity";
import { PageEntity } from "../../../entity/page.entity";
export declare class CreatePageVm {
    page?: PageEntity;
    content?: PageContentEntity[];
    limit: number;
    pages: number;
    array?: number[];
}
