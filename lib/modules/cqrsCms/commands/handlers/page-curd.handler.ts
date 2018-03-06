import {CommandBus, CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {CreateParamCommand} from "../impl/create-param.command";
import {PageRepository} from "../../repository/pageRepository";
import {PageParamCommand} from "../impl/page-param.command";
import {PageEntity} from "../../../entity/page.entity";
import {HttpException} from "@nestjs/common";
import {PageService} from "../../../page/page.service";
import {GetPageParamCommand} from "../impl/get-page-param.command";

const clc=require('cli-color');
@CommandHandler(PageParamCommand)
export class CreatePageHandler implements ICommandHandler<PageParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,
                private readonly pageService:PageService){}

                async execute(command:PageParamCommand,resolver:(value?) => void):Promise<any>{
                console.log(clc.greenBright('handlerCommand  PageFindByIdCommand...'));
                let id:string='0';
                let result;
                const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
                if(!command.pageEntity.array){
                    result=await this.pageService.curdCheck(command.pageEntity.page.alias,command.pageEntity.page.classifyId);
                    console.log("curd="+JSON.stringify(result));
                    if(result.Continue){page.createPage(command.pageEntity)}
                }else{
                    page.createPage(command.pageEntity);
                }
                page.commit();
                resolver(result);
    }
}