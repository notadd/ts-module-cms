import { ICommand } from "@nestjs/cqrs";
import { ClassifyCurdVm } from "../../models/view/classify-curd.vm";
export declare class ClassifyParamCommand implements ICommand {
    classify: ClassifyCurdVm;
    constructor(classify: ClassifyCurdVm);
}
