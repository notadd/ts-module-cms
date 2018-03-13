import {Component, Inject} from "@nestjs/common";
import {Repository} from "typeorm";
import {BlockEntity} from "../entity/block.entity";
import {SiteEntity} from "../entity/site.entity";
import {VisitEntity} from "../entity/visit.entity";
import {PagerService, ReturnPage} from "../database/common.paging";

@Component()
export class RegistrationService{
   constructor(@Inject('BlockRepositoryToken') private readonly blockRespository:Repository<BlockEntity>,
               @Inject('fieldRepositoryToken') private readonly  siteRespository:Repository<SiteEntity>,
               @Inject('VisitRepositoryToken') private readonly visitRespository:Repository<VisitEntity>,
               private readonly pageService:PagerService){}
       //街区入驻
       async createBlock(block:BlockEntity){
        await this.blockRespository.save(block);
       }
       //场地租用
       async createSite(site:SiteEntity){
            let time:Date=site.startTime;
            site.startTime=new Date(time.getTime()-time.getTimezoneOffset()*60*1000);
            let newTime:Date=site.endTime;
            site.endTime=new Date(newTime.getTime()-newTime.getTimezoneOffset()*60*1000);
            await this.siteRespository.save(site);
       }
       //参观预约
       async createVisit(visit:VisitEntity){
       await this.visitRespository.save(visit);
       }
       //获取街区入驻信息
       async getAllBlocks(limit?:number,pages?:number){
           const  result=await this.blockRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount().then(a=>{return a});
           let str:string=JSON.stringify(result);
           let num:string=str.substring(str.lastIndexOf(',')+1,str.lastIndexOf(']'));
           let block:BlockEntity[]=Array.from(JSON.parse(str.substring(str.indexOf('[')+1,str.lastIndexOf(','))));
           return{blocks:block,totals:Number(num)};
       }
       //获取场地租用信息
       async getSite(limit?:number,pages?:number){
           const  result=await this.siteRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount();
           let str:string=JSON.stringify(result);
           let num:string=str.substring(str.lastIndexOf(',')+1,str.lastIndexOf(']'));
           let site:SiteEntity[]=Array.from(JSON.parse(str.substring(str.indexOf('[')+1,str.lastIndexOf(','))));
           return{sites:site,totals:Number(num)};
       }
       //获取参观预约信息
       async getVisit(limit?:number,pages?:number){
           const  result=await this.visitRespository.createQueryBuilder().orderBy('"id"','ASC').skip(limit*(pages-1)).take(limit).getManyAndCount();
           let str:string=JSON.stringify(result);
           let num:string=str.substring(str.lastIndexOf(',')+1,str.lastIndexOf(']'));
           let visit:VisitEntity[]=Array.from(JSON.parse(str.substring(str.indexOf('[')+1,str.lastIndexOf(','))));
           return{visits:visit,totals:Number(num)};
       }

    /**
     * 分页
     * @param {number} totalItems
     * @param {number} limit
     * @param {number} page
     * @returns {Promise<ReturnPage>}
     */
      async pagingMethod(totalItems?:number,limit?:number,page?:number){
        let result=this.pageService.getPager(totalItems,page,limit);
        let res=new ReturnPage();
        res.totalItems=result.totalItems;
        res.currentPage=result.currentPage;
        res.pageSize=result.pageSize;
        res.totalPages=result.totalPages;
        res.startPage=result.startPage;
        res.endPage= result.endPage;
        res.startIndex=result.startIndex;
        res.endIndex= result.endIndex;
        res.pages= result.pages;
        return res;
    }

}