module.exports = [
"[project]/apps/portfolio/instrumentation.ts [instrumentation] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// This file runs before EVERYTHING in Next.js
// Perfect place for localStorage polyfill
__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if ("TURBOPACK compile-time truthy", 1) {
        // Server-side: Mock localStorage completely
        const storage = new Map();
        /*TURBOPACK member replacement*/ __turbopack_context__.g.localStorage = {
            getItem: (key)=>storage.get(key) ?? null,
            setItem: (key, value)=>storage.set(key, value),
            removeItem: (key)=>storage.delete(key),
            clear: ()=>storage.clear(),
            get length () {
                return storage.size;
            },
            key: (index)=>Array.from(storage.keys())[index] ?? null
        };
        console.log('[instrumentation] localStorage polyfill installed');
    }
}
}),
];

//# sourceMappingURL=apps_portfolio_instrumentation_ts_958402f4._.js.map