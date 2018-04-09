import { OnModuleInit } from "@nestjs/common";
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
export declare class CqrsModule implements OnModuleInit {
    private readonly moduleRef;
    private readonly command$;
    private readonly event$;
    constructor(moduleRef: ModuleRef, command$: CommandBus, event$: EventBus);
    onModuleInit(): void;
}
