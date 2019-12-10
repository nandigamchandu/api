import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Mixed, ObjC, Props } from 'technoidentity-utils';
export interface MethodArgs {
    readonly resource?: string;
    readonly path?: string | readonly string[];
    readonly query?: string | Record<string, any>;
}
export interface RequestConfig extends AxiosRequestConfig {
    readonly baseURL: string;
}
export declare function buildUrl(options: MethodArgs): string;
export declare function http({ baseURL, ...config }: RequestConfig): {
    get: <Spec extends Mixed>(options: string | MethodArgs, responseSpec: Spec) => Promise<Spec["_A"]>;
    del: (options: string | Pick<MethodArgs, "resource" | "path">) => Promise<void>;
    put: <Spec_1 extends Mixed>(options: string | Pick<MethodArgs, "resource" | "path">, data: Spec_1["_I"], responseSpec: Spec_1) => Promise<Spec_1["_A"]>;
    post: <Spec_2 extends Mixed, ID extends keyof Spec_2>(options: string | Pick<MethodArgs, "resource" | "path">, data: Pick<Spec_2["_I"], Exclude<keyof Spec_2["_I"], ID>>, responseSpec: Spec_2) => Promise<Spec_2["_A"]>;
    patch: <Opt extends Props, Req extends Props>(options: string | Pick<MethodArgs, "resource" | "path">, data: Partial<unknown>, responseSpec: ObjC<Opt, Req>) => Promise<{ readonly [K_1 in keyof { [K in keyof Opt]?: Opt[K]["_A"] | undefined; }]: { [K in keyof Opt]?: Opt[K]["_A"] | undefined; }[K_1]; } & { readonly [K_3 in keyof { [K_2 in keyof Req]: Req[K_2]["_A"]; }]: { [K_2 in keyof Req]: Req[K_2]["_A"]; }[K_3]; }>;
    axios: AxiosInstance;
};
//# sourceMappingURL=http.d.ts.map