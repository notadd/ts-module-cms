import {CommandHandler, EventPublisher, ICommandHandler} from "@nestjs/cqrs";
import {CreateParamCommand} from "../impl/create-param.command";
import {PageRepository} from "../../repository/pageRepository";
import {SitemapResolver} from "../../sitemap.controller";

const clc=require('cli-color');
@CommandHandler(CreateParamCommand)
export class CreateSitemapHandler implements ICommandHandler<CreateParamCommand>{
    constructor(private readonly repositoty:PageRepository,
                private readonly publisher:EventPublisher){}

    async execute(command:CreateParamCommand,resolver:(value?) => void){
        console.log(clc.greenBright('handlerCommand  CreateXmlCommand...'));
        // const id=command;
        console.log('command='+JSON.stringify(command));
        const sitemap=this.publisher.mergeObjectContext( await this.repositoty.siteMap());
        sitemap.createxml(command);
        sitemap.commit();
        resolver();
    }
}