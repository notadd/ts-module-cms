import { IEventHandler } from "@nestjs/cqrs";
import { ClassifyService } from "../../service/classify.service";
import { ClassifyCurdEvents } from "../impl/classify-curd.events";
export declare class ClassifyCurdEvent implements IEventHandler<ClassifyCurdEvents> {
    readonly classifyservice: ClassifyService;
    constructor(classifyservice: ClassifyService);
    handle(event: ClassifyCurdEvents): Promise<void>;
}
