import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { PageEntity } from "./page.entity";

@Entity("page_classify_table")
export class PageClassifyEntity {
    /*分类Id*/
    @PrimaryGeneratedColumn() id: number;

    /*分类名称*/
    @Column({ nullable: false, length: 120 }) title: string;

    /*分类别名*/
    @Column({ nullable: false, length: 120 }) classifyAlias: string;

    /*内链*/
    @Column({ nullable: true, length: 200 }) chainUrl: string;

    /*描述*/
    @Column({ nullable: true, length: 200 }) describe: string;

    /*颜色*/
    @Column({ nullable: true, length: 40 }) color: string;

    /*父节点*/
    @Column({ nullable: true }) groupId: number;

    @OneToMany(type => PageClassifyEntity, pageClassifyEntity => pageClassifyEntity.parent, { cascadeInsert: true })
    children: Array<PageClassifyEntity>;

    @ManyToOne(type => PageClassifyEntity, pageClassifyEntity => pageClassifyEntity.children, { cascadeInsert: true })
    parent: PageClassifyEntity;

    /*创建时间*/
    @CreateDateColumn() createAt: Date;

    /*修改时间*/
    @UpdateDateColumn() updateAt: Date;

    @ManyToOne(type => PageEntity, pageEntity => pageEntity.classifications)
    pages: PageEntity;
}
