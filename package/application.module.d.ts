import { MiddlewaresConsumer, NestModule } from "@nestjs/common";
import { GraphQLFactory } from "@nestjs/graphql";
export declare class ApplicationModule implements NestModule {
    private readonly graphqlFactory;
    constructor(graphqlFactory: GraphQLFactory);
    configure(consumer: MiddlewaresConsumer): void;
    createSchema(): any;
}
