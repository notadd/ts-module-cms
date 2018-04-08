import { ICommand } from "@nestjs/cqrs";
import { ClassifyCurdVm } from "../../models/view/classify-curd.vm";

export class ClassifyParamCommand implements ICommand {
    constructor(public classify: ClassifyCurdVm) {
    }
}
