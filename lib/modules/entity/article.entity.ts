import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ClassifyEntity} from "./classify.entity";
enum EnvConfig{
    global,
    current,
    Level1,
    Level2,
    Level3
}
@Entity('article')
export class ArticleEntity{
    //文章Id
    @PrimaryGeneratedColumn() id:number;
    //文章名
    @Column({nullable:true,length:120}) name:string;
    //分类名称
    @Column({nullable:true,length:100}) classify:string;
    //分类Id
    @Column({nullable:true}) classifyId:number;
    //文章地址
    @Column({nullable:true,length:200}) url:string;
    //来源
    @Column({nullable:true,length:120}) source:string;
    //来源链接
    @Column({nullable:true,length:200}) sourceUrl:string;
    //置顶
    @Column({type:String}) topPlace:EnvConfig;
    //是否隐藏
    @Column({nullable:false}) hidden:boolean;
    //删除(回收站)
    @Column({nullable:true}) recycling:boolean;
    //发布时间
    @Column({nullable:true}) publishedTime:Date;
    //摘要
    @Column({nullable:true,length:500}) abstract:string;
    //内容
    @Column({nullable:true,length:10000}) content:string;
    //创建时间
    @CreateDateColumn() createAt:Date;
    //修改时间
    @UpdateDateColumn() updateAt:Date;

    @OneToMany(type => ClassifyEntity,ClassifyEntity=>ClassifyEntity.articles)
    classifications:ClassifyEntity[];

}