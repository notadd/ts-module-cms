import * as _ from "underscore";

export class PagerService {
    getPager(totalItem: number, currentPages?: number, pagesSize?: number) {
        /* calculate total pages*/
        if (pagesSize === null || pagesSize === 0) {
            pagesSize = 1;
        }
        if (currentPages === null || currentPages === 0) {
            currentPages = 1;
        }
        const totalPage = Math.ceil(totalItem / pagesSize);
        let startPages: number, endPages: number;
        if (totalPage <= 10) {
            /* less than 10 total pages so show all*/
            startPages = 1;
            endPages = totalPage;
        } else {
            /* more than 10 total pages so calculate start and end pages*/
            if (currentPages <= 6) {
                startPages = 1;
                endPages = 10;
            } else if (currentPages + 4 >= totalPage) {
                startPages = totalPage - 9;
                endPages = totalPage;
            } else {
                startPages = currentPages - 5;
                endPages = currentPages + 4;
            }
        }

        /* calculate start and end item indexes*/
        const startIndexPage = (currentPages - 1) * pagesSize;
        const endIndexPage = Math.min(startIndexPage + pagesSize - 1, totalItem - 1);

        /* create an array of pages to ng-repeat in the pager control*/
        const pagesArray = _.range(startPages, endPages + 1);
        /* return object with all pager properties required by the view*/
        return {
            totalItems: totalItem,
            currentPage: currentPages,
            pageSize: pagesSize,
            totalPages: totalPage,
            startPage: startPages,
            endPage: endPages,
            startIndex: startIndexPage,
            endIndex: endIndexPage,
            pages: pagesArray
        };
    }
}

