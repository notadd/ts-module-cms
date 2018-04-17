import { CreatePageVm } from "../../models/view/create-page.vm";

export class PageCurdEvent {
    constructor(
        public  pageEntity: CreatePageVm,
    ) {
    }
}
