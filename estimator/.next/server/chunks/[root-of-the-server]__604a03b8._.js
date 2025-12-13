module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},6294,e=>{"use strict";let t=process.env.OPENROUTER_API_KEY||"";async function r(e,a={}){let{model:n="anthropic/claude-3.5-sonnet",temperature:s=.7,max_tokens:o=4096}=a,i=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json","HTTP-Referer":"http://localhost:3001","X-Title":"KoreTek Project Estimator"},body:JSON.stringify({model:n,messages:e,temperature:s,max_tokens:o})});if(!i.ok){let e=await i.text();throw Error(`OpenRouter API error: ${e}`)}let l=await i.json();return l.choices[0]?.message?.content||""}e.s(["MODELS",0,{CLAUDE_35_SONNET:"anthropic/claude-3.5-sonnet",CLAUDE_3_OPUS:"anthropic/claude-3-opus",CLAUDE_3_HAIKU:"anthropic/claude-3-haiku",GPT_4_TURBO:"openai/gpt-4-turbo",GPT_4:"openai/gpt-4",GPT_35_TURBO:"openai/gpt-3.5-turbo",GEMINI_PRO:"google/gemini-pro",LLAMA_2_70B:"meta-llama/llama-2-70b-chat"},"callOpenRouter",()=>r])},66866,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),o=e.i(14444),i=e.i(37092),l=e.i(69741),u=e.i(16795),c=e.i(87718),p=e.i(95169),d=e.i(47587),h=e.i(66012),m=e.i(70101),y=e.i(26937),f=e.i(10372),g=e.i(93695);e.i(52474);var R=e.i(5232),x=e.i(89171),v=e.i(6294);let E={"target-audience":{system:"You are a product strategist. Be VERY concise - use short bullets, max 8 words each.",user:`Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Identify target users. Use this EXACT format:

## 👥 Primary Users
**[Persona 1 Name]** - [Job/role], age XX-XX
• [Key trait]
• [Key trait]
• [Pain point this solves]

**[Persona 2 Name]** - [Job/role], age XX-XX
• [Key trait]
• [Key trait]
• [Pain point this solves]

## 🎯 Why They'll Use This
• [Benefit] - [Why it matters]
• [Benefit] - [Why it matters]
• [Benefit] - [Why it matters]

Max 8 words per bullet. Ultra brief.`},monetization:{system:"You are a business advisor. Be EXTREMELY concise - use bullet points, no long paragraphs. Get straight to numbers and specifics.",user:`Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Create a concise monetization strategy. Use this EXACT format with short bullets:

## 💰 Recommended Model
[Model name] - [One sentence why]

## 💵 Pricing
• Monthly: $X - [Brief reason]
• Annual: $XX/year - [Brief reason]

## 🆓 Free Features
• [Feature] - [Why free]
• [Feature] - [Why free]
• [Feature] - [Why free]

## ⭐ Pro Features ($X/mo)
• [Feature] - [Why paid]
• [Feature] - [Why paid]
• [Feature] - [Why paid]

## 📈 Revenue Goals
• Month 1-3: X users → $X MRR
• Growth tactic: [One specific action]

Keep everything under 10 words per bullet. No paragraphs.`},"mvp-comparison":{system:"You are a startup advisor. Be ULTRA concise - short bullets only, no long text.",user:`Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Compare MVP vs Full launch. Use this EXACT format:

## 🚀 Quick Launch (MVP)
**Timeline:** X months
**Include:**
• [Feature]
• [Feature]
• [Feature]

**Skip for now:**
• [Feature]
• [Feature]

**Best if:** [One sentence scenario]

## ✨ Full Launch
**Timeline:** X months
**Everything in MVP plus:**
• [Feature]
• [Feature]
• [Feature]

**Best if:** [One sentence scenario]

## 💡 Our Pick
[MVP or Full] - [One sentence why]

Max 6 words per bullet. Ultra brief.`},"cool-features":{system:"You are a creative product designer brainstorming exciting features. Be imaginative but realistic and professional. Return ONLY valid JSON.",user:`Project: {description}

Blueprint Summary: {summary}
Current Features: {features}

Brainstorm 4-6 creative features they might not have thought of. Return ONLY a JSON array with this exact structure:

[
  {
    "title": "Feature Name",
    "description": "1-2 sentence explanation of why this would be valuable",
    "category": "Enhancement" or "Innovation" or "User Experience" or "Analytics"
  }
]

Focus on:
- Features that add real value
- Unexpected but useful additions
- Things that would differentiate the product
- Practical future possibilities

Be creative but professional. No emojis. Return ONLY the JSON array, nothing else.`}};async function w(e){try{let{projectDescription:t,estimate:r,enhancementType:a}=await e.json();if(!t||!r||!a)return x.NextResponse.json({error:"Missing required fields"},{status:400});let n=E[a];if(!n)return x.NextResponse.json({error:"Invalid enhancement type"},{status:400});let s=e=>e.replace("{description}",t).replace("{summary}",r.summary||"").replace("{features}",Array.isArray(r.features)?r.features.join(", "):"").replace("{techStack}",r.techStack?JSON.stringify(r.techStack):""),o=s(n.system),i=s(n.user),l=(await (0,v.callOpenRouter)([{role:"system",content:o},{role:"user",content:i}],{model:v.MODELS.GPT_35_TURBO,temperature:.8,max_tokens:1e3})).trim();return"cool-features"===a?(l=l.replace(/```json\s*/g,"").replace(/```\s*/g,""),console.log("Cleaned cool-features response:",l)):l=l.replace(/```markdown\s*/g,"").replace(/```\s*/g,""),x.NextResponse.json({enhancement:l})}catch(e){return console.error("Error generating enhancement:",e),x.NextResponse.json({error:"Failed to generate enhancement. Please try again."},{status:500})}}e.s(["POST",()=>w],73945);var b=e.i(73945);let P=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/enhance-blueprint/route",pathname:"/api/enhance-blueprint",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/enhance-blueprint/route.ts",nextConfigOutput:"",userland:b}),{workAsyncStorage:O,workUnitAsyncStorage:T,serverHooks:A}=P;function C(){return(0,a.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:T})}async function N(e,t,a){P.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let x="/api/enhance-blueprint/route";x=x.replace(/\/index$/,"")||"/";let v=await P.prepare(e,t,{srcPage:x,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:E,params:w,nextConfig:b,parsedUrl:O,isDraftMode:T,prerenderManifest:A,routerServerContext:C,isOnDemandRevalidate:N,revalidateOnlyGenerated:S,resolvedPathname:_,clientReferenceManifest:F,serverActionsManifest:U}=v,M=(0,l.normalizeAppPath)(x),j=!!(A.dynamicRoutes[M]||A.routes[_]),k=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,O,!1):t.end("This page could not be found"),null);if(j&&!T){let e=!!A.routes[_],t=A.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await k();throw new g.NoFallbackError}}let B=null;!j||P.isDev||T||(B="/index"===(B=_)?"/":B);let I=!0===P.isDev||!j,X=j&&!I;U&&F&&(0,o.setReferenceManifestsSingleton)({page:x,clientReferenceManifest:F,serverActionsManifest:U,serverModuleMap:(0,i.createServerModuleMap)({serverActionsManifest:U})});let q=e.method||"GET",H=(0,s.getTracer)(),K=H.getActiveScopeSpan(),L={params:w,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:I,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>P.onRequestError(e,t,a,C)},sharedContext:{buildId:E}},D=new u.NodeNextRequest(e),$=new u.NodeNextResponse(t),W=c.NextRequestAdapter.fromNodeNextRequest(D,(0,c.signalFromNodeResponse)(t));try{let o=async e=>P.handle(W,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=H.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${q} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${q} ${x}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var s,l;let u=async({previousCacheEntry:r})=>{try{if(!i&&N&&S&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await o(n);e.fetchMetrics=L.renderOpts.fetchMetrics;let l=L.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=L.renderOpts.collectedTags;if(!j)return await (0,h.sendResponse)(D,$,s,L.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(s.headers);u&&(t[f.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,a=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await P.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:X,isOnDemandRevalidate:N})},C),t}},c=await P.handleResponse({req:e,nextConfig:b,cacheKey:B,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:N,revalidateOnlyGenerated:S,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:i});if(!j)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",N?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),T&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,m.fromNodeOutgoingHttpHeaders)(c.value.headers);return i&&j||p.delete(f.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,y.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)(D,$,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};K?await l(K):await H.withPropagatedContext(e.headers,()=>H.trace(p.BaseServerSpan.handleRequest,{spanName:`${q} ${x}`,kind:s.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},l))}catch(t){if(t instanceof g.NoFallbackError||await P.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:X,isOnDemandRevalidate:N})}),j)throw t;return await (0,h.sendResponse)(D,$,new Response(null,{status:500})),null}}e.s(["handler",()=>N,"patchFetch",()=>C,"routeModule",()=>P,"serverHooks",()=>A,"workAsyncStorage",()=>O,"workUnitAsyncStorage",()=>T],66866)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__604a03b8._.js.map