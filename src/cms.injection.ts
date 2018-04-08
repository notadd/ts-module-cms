import { Module } from "@notadd/injection";
import { CqrsModule } from "./cqrsCms/cqrs.module";
import { RegistrationModule } from "./enter/registration.module";
import { UpyunModule } from "./ext-local-store/src/UpyunModule";

@Module({
    authors: [
        {
            email: "admin@notadd.com",
            username: "notadd",
        },
        {
            email: "1945320167@qq.com",
            username: "EricAll",
        },
    ],
    identification: "module-cms",
    name: "Module CMS",
    version: "2.0.3",
    imports: [
        CqrsModule,
        UpyunModule,
        RegistrationModule,
    ],
})
export class CmsModule {
}
