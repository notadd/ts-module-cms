import { EventObservable, ICommand } from "@nestjs/cqrs";
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
export declare class PageSagas {
    articleXml: (events$: EventObservable<any>) => Observable<ICommand>;
    pageXml: (events$: EventObservable<any>) => Observable<ICommand>;
}
