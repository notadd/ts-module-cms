import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("sitemap_entity_table")
export class SitemapEntity {
    /*基本配置Id*/
    @PrimaryGeneratedColumn()
    id: number;

    /*文件名*/
    @Column({
        length: 20,
        nullable: true,
    })
    xmlFileName: string;

    /*生成xml地图*/
    @Column({
        nullable: true,
    })
    xmlSiteMap: boolean;

    /*只更新最近文章(1000以内)*/
    @Column({
        nullable: true,
    })
    postLimit1000: boolean;

    /* 链接包括：文章 */
    @Column({
        nullable: true,
    })
    postSelect: boolean;

    /*链接包括：页面*/
    @Column({
        nullable: true,
    })
    pageSelect: boolean;

    /*当发布文章时更新*/
    @Column({
        nullable: true,
    })
    updateWhenPost: boolean;

    /*创建时间*/
    @CreateDateColumn()
    createAt: Date;
}
