export declare class PagerService {
    getPager(totalItem: number, currentPages?: number, pagesSize?: number): {
        totalItems: number;
        currentPage: number;
        pageSize: number;
        totalPages: number;
        startPage: number;
        endPage: number;
        startIndex: number;
        endIndex: number;
        pages: any;
    };
}
