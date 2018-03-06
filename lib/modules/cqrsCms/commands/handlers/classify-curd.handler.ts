import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {PageRepository} from "../../repository/pageRepository";
import {ClassifyParamCommand} from "../impl/classify-param.command";
import {ClassifyService} from "../../../classify/classify.service";

const clc=require('cli-color');
@CommandHandler(ClassifyParamCommand)
export class ClassifyCurdHandler implements ICommandHandler<ClassifyParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher,
                private readonly classifyService:ClassifyService){}

    async execute(command:ClassifyParamCommand,resolver:(value?) => void):Promise<any>{
        console.log(clc.greenBright('handlerCommand classify_curd Command...'));
        let id:string='0';
        const page=this.publisher.mergeObjectContext( await this.repositoty.find(id));
        let value,MessageCodeError;
        if(!command.classify.getAllClassify){
            //增加、修改、删除、移动分类
            if(command.classify.createClassify){
                if(command.classify.createClassify.art){
                    const result=await this.classifyService.classifyCheck(
                        command.classify.useFor,
                        command.classify.createClassify.art.id,
                        command.classify.createClassify.art.groupId,
                        command.classify.createClassify.art.classifyAlias);
                    value=result.Continue;
                    console.log('createClassify='+JSON.stringify(command.classify.createClassify));
                    MessageCodeError=result.MessageCodeError;
                }
               if(command.classify.createClassify.page){
                   const result=await this.classifyService.classifyCheck(
                       command.classify.useFor,
                       command.classify.createClassify.page.id,
                       command.classify.createClassify.page.groupId,
                       command.classify.createClassify.page.classifyAlias);
                   value=result.Continue;
                   console.log('createClassify='+JSON.stringify(command.classify.createClassify));
                   MessageCodeError=result.MessageCodeError;
               }
            }
            if(command.classify.updateClassify){
                if(command.classify.updateClassify.page){
                    const result=await this.classifyService.classifyCheck(
                        command.classify.useFor,
                        command.classify.updateClassify.page.id,
                        command.classify.updateClassify.page.groupId,
                        command.classify.updateClassify.page.classifyAlias);
                    value=result.Continue;
                    console.log('updateClassify='+JSON.stringify(command.classify.updateClassify));
                    MessageCodeError=result.MessageCodeError;
                }
                if(command.classify.updateClassify.art){
                    const result=await this.classifyService.classifyCheck(
                        command.classify.useFor,
                        command.classify.updateClassify.art.id,
                        command.classify.updateClassify.art.groupId,
                        command.classify.updateClassify.art.classifyAlias);
                    value=result.Continue;
                    console.log('updateClassify='+JSON.stringify(command.classify.updateClassify));
                    MessageCodeError=result.MessageCodeError;
                }

            }
            if(command.classify.mobileClassifyId){
                const result=await this.classifyService.classifyCheck(command.classify.useFor,
                    command.classify.mobileClassifyId.id,
                    command.classify.mobileClassifyId.parentId);
                value=result.Continue;
                MessageCodeError=result.MessageCodeError
            }
            if(command.classify.deleteClassify){
                const  result=await this.classifyService.classifyCheck(command.classify.useFor,0,0,'',command.classify.deleteClassify);
                value=result.Continue;
                MessageCodeError=result.MessageCodeError;
                console.log('result='+result);
            }
            if(value==undefined) value=true;
            if(value)page.createClassify(command.classify);
        }
        console.log({MessageCodeError:MessageCodeError,Continue:value});
        page.commit();
        resolver({MessageCodeError:MessageCodeError,Continue:value});
    }
}