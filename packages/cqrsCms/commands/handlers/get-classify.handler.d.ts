import { ICommandHandler } from "@nestjs/cqrs";
import { ClassifyService } from "../../service/classify.service";
import { GetClassifyParamCommand } from "../impl/get-classify-param.command";
export declare class GetClassifyHandler implements ICommandHandler<GetClassifyParamCommand> {
    private readonly classifyService;
    constructor(classifyService: ClassifyService);
    execute(command: GetClassifyParamCommand, resolver: (value) => void): Promise<void>;
}
