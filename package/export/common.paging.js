"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("underscore");
class PagerService {
    getPager(totalItem, currentPages, pagesSize) {
        if (pagesSize === null || pagesSize === 0) {
            pagesSize = 1;
        }
        if (currentPages === null || currentPages === 0) {
            currentPages = 1;
        }
        const totalPage = Math.ceil(totalItem / pagesSize);
        let startPages, endPages;
        if (totalPage <= 10) {
            startPages = 1;
            endPages = totalPage;
        }
        else {
            if (currentPages <= 6) {
                startPages = 1;
                endPages = 10;
            }
            else if (currentPages + 4 >= totalPage) {
                startPages = totalPage - 9;
                endPages = totalPage;
            }
            else {
                startPages = currentPages - 5;
                endPages = currentPages + 4;
            }
        }
        const startIndexPage = (currentPages - 1) * pagesSize;
        const endIndexPage = Math.min(startIndexPage + pagesSize - 1, totalItem - 1);
        const pagesArray = _.range(startPages, endPages + 1);
        return {
            totalItems: totalItem,
            currentPage: currentPages,
            pageSize: pagesSize,
            totalPages: totalPage,
            startPage: startPages,
            endPage: endPages,
            startIndex: startIndexPage,
            endIndex: endIndexPage,
            pages: pagesArray,
        };
    }
}
exports.PagerService = PagerService;
