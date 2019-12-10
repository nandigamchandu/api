import { ObjC, Props, TypeOf } from 'technoidentity-utils';
export declare const Page: ObjC<{}, {
    current: import("io-ts").NumberC;
    limit: import("io-ts").NumberC;
}>;
export declare const Slice: import("io-ts").UnionC<[ObjC<{}, {
    start: import("io-ts").NumberC;
    end: import("io-ts").NumberC;
}>, ObjC<{}, {
    start: import("io-ts").NumberC;
    limit: import("io-ts").NumberC;
}>]>;
export interface APIQuery<C> {
    readonly select?: ReadonlyArray<keyof C>;
    readonly filter?: Partial<C>;
    readonly range?: TypeOf<typeof Page> | TypeOf<typeof Slice>;
    readonly asc?: ReadonlyArray<keyof C>;
    readonly desc?: ReadonlyArray<keyof C>;
    readonly fullText?: string;
    readonly like?: Partial<C>;
    readonly embed?: keyof C;
}
export declare function toJSONServerQuery<Opt extends Props, Req extends Props>(codec: ObjC<Opt, Req>, query: APIQuery<TypeOf<typeof codec>>): string;
export declare function toAPIQuery<Opt extends Props, Req extends Props>(spec: ObjC<Opt, Req>, query: APIQuery<TypeOf<typeof spec>>): string;
//# sourceMappingURL=query.d.ts.map