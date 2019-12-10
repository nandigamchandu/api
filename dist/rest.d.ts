import { ObjC, Props, TypeOf } from 'technoidentity-utils';
import { http as httpAPI, MethodArgs, RequestConfig } from './http';
import { APIQuery } from './query';
declare type APIMethodArgs = Omit<MethodArgs, 'resource'>;
export interface API<Opt extends Props, Req extends Props, ID extends keyof TypeOf<ObjC<Opt, Req>>> {
    readonly http: ReturnType<typeof httpAPI>;
    readonly spec: ObjC<Opt, Req>;
    readonly idKey: ID;
    readonly resource: string;
    many(options?: APIMethodArgs): Promise<ReadonlyArray<TypeOf<ObjC<Opt, Req>>>>;
    one(options?: APIMethodArgs): Promise<TypeOf<ObjC<Opt, Req>>>;
    create(data: Omit<TypeOf<ObjC<Opt, Req>>, ID>, options?: APIMethodArgs): Promise<TypeOf<ObjC<Opt, Req>>>;
    get(id: TypeOf<ObjC<Opt, Req>>[ID], options?: APIMethodArgs): Promise<TypeOf<ObjC<Opt, Req>>>;
    list(query: APIQuery<TypeOf<ObjC<Opt, Req>>>, options?: Omit<APIMethodArgs, 'query'>): Promise<ReadonlyArray<TypeOf<ObjC<Opt, Req>>>>;
    select<K extends keyof TypeOf<ObjC<Opt, Req>>>(query: Omit<APIQuery<TypeOf<ObjC<Opt, Req>>>, 'select'>, select: readonly K[], options?: Omit<APIMethodArgs, 'query'>): Promise<ReadonlyArray<TypeOf<ObjC<Pick<Opt, Extract<keyof Opt, K>>, Pick<Req, Extract<keyof Req, K>>>>>>;
    replace(id: TypeOf<ObjC<Opt, Req>>[ID], data: TypeOf<ObjC<Opt, Req>>, options?: APIMethodArgs): Promise<TypeOf<ObjC<Opt, Req>>>;
    update(id: TypeOf<ObjC<Opt, Req>>[ID], data: Partial<TypeOf<ObjC<Opt, Req>>>, options?: APIMethodArgs): Promise<TypeOf<ObjC<Opt, Req>>>;
    del(id: TypeOf<ObjC<Opt, Req>>[ID], options?: APIMethodArgs): Promise<void>;
}
interface RestArgs extends RequestConfig {
    readonly resource: string;
}
export declare function rest<Opt extends Props, Req extends Props, ID extends keyof TypeOf<ObjC<Opt, Req>>>(spec: ObjC<Opt, Req>, idKey: ID, { resource, ...options }: RestArgs, toQuery?: (spec: ObjC<Opt, Req>, query: APIQuery<TypeOf<ObjC<Opt, Req>>>) => string): API<Opt, Req, ID>;
export {};
//# sourceMappingURL=rest.d.ts.map