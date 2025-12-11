(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/apps_portfolio_0536105d._.js",
"[project]/apps/portfolio/instrumentation.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/apps/portfolio/edge-wrapper.js { MODULE => \"[project]/apps/portfolio/instrumentation.ts [instrumentation-edge] (ecmascript)\" } [instrumentation-edge] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i("[project]/apps/portfolio/instrumentation.ts [instrumentation-edge] (ecmascript)"));
modProm.catch(()=>{});
self._ENTRIES["middleware_instrumentation"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=apps_portfolio_0536105d._.js.map