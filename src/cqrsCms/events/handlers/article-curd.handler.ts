import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ArticleService } from "../../service/article.service";
import { ArticleCurdEvents } from "../impl/article-curd.events";

@EventsHandler(ArticleCurdEvents)
export class ArticleCurdEvent implements IEventHandler<ArticleCurdEvents> {
    constructor(private readonly articleService: ArticleService) {
    }

    async handle(event: ArticleCurdEvents) {
        if (event.article.createArticle) {
            /*新增文章*/
            await this.articleService.createArticle(
                event.article.createArticle.url,
                event.article.createArticle.article,
                event.article.createArticle.article.pictureUpload);
        }
        if (event.article.updateArticle) {
            /*修改文章*/
            await this.articleService.updateArticle(
                event.article.updateArticle.url,
                event.article.updateArticle.article,
                event.article.updateArticle.article.pictureUpload);
        }
        if (event.article.deleteById) {
            /*放入回收站*/
            const array: Array<number> = event.article.deleteById;
            await this.articleService.deleteArticles(array);
        }
        if (event.article.recycleDelete) {
            /*回收站删除*/
            await this.articleService.recycleDelete(event.article.recycleDelete);
        }
        if (event.article.reductionArticle) {
            /*回收站还原*/
            await this.articleService.reductionArticle(event.article.reductionArticle);
        }
        if (event.article.pictureUpload) {
            /*图片上传*/
            await this.articleService.upLoadPicture(
                event.article.pictureUpload.url,
                event.article.pictureUpload.bucketName,
                event.article.pictureUpload.rawName,
                event.article.pictureUpload.base64,
            );
        }
    }
}
