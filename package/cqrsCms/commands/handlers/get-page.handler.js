"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cqrs_1 = require("@nestjs/cqrs");
const page_service_1 = require("../../service/page.service");
const get_page_param_command_1 = require("../impl/get-page-param.command");
let GetPageHandler = class GetPageHandler {
    constructor(pageService) {
        this.pageService = pageService;
    }
    execute(command, resolver) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            if (command.getPage.keywords) {
                result = this.pageService.serachKeywords(command.getPage.keywords, command.getPage.limit, command.getPage.pages);
            }
            if (command.getPage.classifyId) {
                result = this.pageService.findPageByClassifyId(command.getPage.classifyId, command.getPage.limit, command.getPage.pages);
            }
            if (command.getPage.id) {
                result = this.pageService.findPageById(command.getPage.id);
            }
            if (command.getPage.getAll) {
                result = this.pageService.getAllPage(command.getPage.limit, command.getPage.pages);
            }
            resolver(result);
        });
    }
};
GetPageHandler = __decorate([
    cqrs_1.CommandHandler(get_page_param_command_1.GetPageParamCommand),
    __metadata("design:paramtypes", [page_service_1.PageService])
], GetPageHandler);
exports.GetPageHandler = GetPageHandler;

//# sourceMappingURL=get-page.handler.js.map
