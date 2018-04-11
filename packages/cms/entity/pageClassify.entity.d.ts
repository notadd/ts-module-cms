import { PageEntity } from "./page.entity";
export declare class PageClassifyEntity {
    id: number;
    title: string;
    classifyAlias: string;
    chainUrl: string;
    describe: string;
    color: string;
    groupId: number;
    children: Array<PageClassifyEntity>;
    parent: PageClassifyEntity;
    createAt: Date;
    updateAt: Date;
    pages: PageEntity;
}
