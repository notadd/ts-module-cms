import { EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { PageRepository } from "../../repository/pageRepository";
import { CreateParamCommand } from "../impl/create-param.command";
export declare class CreateSitemapHandler implements ICommandHandler<CreateParamCommand> {
    private readonly repositoty;
    private readonly publisher;
    constructor(repositoty: PageRepository, publisher: EventPublisher);
    execute(command: CreateParamCommand, resolver: (value?) => void): Promise<void>;
}
