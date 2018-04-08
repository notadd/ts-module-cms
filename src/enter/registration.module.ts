import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlockEntity } from "../entity/block.entity";
import { SiteEntity } from "../entity/site.entity";
import { VisitEntity } from "../entity/visit.entity";
import { PagerService } from "../export/common.paging";
import { EnterResolver } from "./graphql.resolver";
import { RegistrationService } from "./registration.service";

@Module({
    imports: [ TypeOrmModule.forFeature([ SiteEntity, BlockEntity, VisitEntity ]) ],
    components: [ RegistrationService, EnterResolver, PagerService ]
})

export class RegistrationModule {
}
