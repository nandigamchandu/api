export declare const Battery: import("technoidentity-utils").ObjC<{
    name: import("io-ts").StringC;
    id: import("io-ts").StringC;
    group: import("io-ts").KeyofC<{
        Retail: boolean;
        Cargo: boolean;
    }>;
    remainingCycles: import("io-ts").BrandC<import("io-ts").NumberC, import("io-ts").IntBrand>;
    status: import("io-ts").KeyofC<{
        active: boolean;
        inActive: boolean;
    }>;
}, {
    batteryID: import("io-ts").StringC;
    batteryMake: import("io-ts").StringC;
    batteryModel: import("io-ts").StringC;
    capacity: import("io-ts").StringC;
    batteryCycles: import("io-ts").BrandC<import("io-ts").NumberC, import("io-ts").IntBrand>;
}>;
//# sourceMappingURL=server.d.ts.map