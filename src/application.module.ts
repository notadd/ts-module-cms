import { MiddlewaresConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { GraphQLFactory, GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { graphiqlExpress, graphqlExpress } from "apollo-server-express";
import { CmsModule } from "./cms.injection";

@Module({
    imports: [
        CmsModule,
        GraphQLModule,
        TypeOrmModule.forRoot(),
    ],
})
export class ApplicationModule implements NestModule {
    constructor(private readonly graphqlFactory: GraphQLFactory) {
    }

    /*中间件设置*/
    configure(consumer: MiddlewaresConsumer) {
        const schema = this.createSchema();
        consumer.apply(graphiqlExpress({ endpointURL: "/graphql" }))
            .forRoutes({ path: "/graphiql", method: RequestMethod.GET })
            .apply(graphqlExpress(req => ({ schema, rootValue: req })))
            .forRoutes({ path: "/graphql", method: RequestMethod.ALL });

    }

    createSchema() {
        const typeDefs = this.graphqlFactory.mergeTypesByPaths("**/*.types.graphql");

        return this.graphqlFactory.createSchema({ typeDefs });
    }
}
