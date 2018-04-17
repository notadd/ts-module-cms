import { EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { PageRepository } from "../../repository/pageRepository";
import { DeleteParamCommand } from "../impl/delete-param.command";
export declare class UpdateSitemapHandler implements ICommandHandler<DeleteParamCommand> {
    private readonly repository;
    private readonly publisher;
    constructor(repository: PageRepository, publisher: EventPublisher);
    execute(command: DeleteParamCommand, resolver: (value?) => void): Promise<void>;
}
