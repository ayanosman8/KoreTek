module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},6294,e=>{"use strict";let t=process.env.OPENROUTER_API_KEY||"";async function r(e,a={}){let{model:n="anthropic/claude-3.5-sonnet",temperature:s=.7,max_tokens:i=4096}=a,o=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json","HTTP-Referer":"http://localhost:3001","X-Title":"KoreTek Project Estimator"},body:JSON.stringify({model:n,messages:e,temperature:s,max_tokens:i})});if(!o.ok){let e=await o.text();throw Error(`OpenRouter API error: ${e}`)}let l=await o.json();return l.choices[0]?.message?.content||""}e.s(["MODELS",0,{CLAUDE_35_SONNET:"anthropic/claude-3.5-sonnet",CLAUDE_3_OPUS:"anthropic/claude-3-opus",CLAUDE_3_HAIKU:"anthropic/claude-3-haiku",GPT_4_TURBO:"openai/gpt-4-turbo",GPT_4:"openai/gpt-4",GPT_35_TURBO:"openai/gpt-3.5-turbo",GEMINI_PRO:"google/gemini-pro",LLAMA_2_70B:"meta-llama/llama-2-70b-chat"},"callOpenRouter",()=>r])},66866,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),i=e.i(14444),o=e.i(37092),l=e.i(69741),u=e.i(16795),c=e.i(87718),p=e.i(95169),d=e.i(47587),h=e.i(66012),m=e.i(70101),f=e.i(74838),g=e.i(10372),y=e.i(93695);e.i(52474);var v=e.i(5232),x=e.i(89171),R=e.i(6294);let w={"target-audience":{system:"You are a product strategist helping identify target users. Be practical and insightful. Use markdown formatting for clear structure.",user:`Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Analyze the target audience for this project. Use structured markdown with headings and bullet points.

Format your response like this:

## Primary User Personas
Create 2-3 specific user personas with names and characteristics

## Demographics & Characteristics
- List key demographic details
- User behaviors and preferences
- Technical proficiency levels

## Pain Points & Solutions
Detail the main problems this app solves for each persona

## Why They'd Choose This
- Key differentiators from alternatives
- Unique value propositions
- Specific benefits for each persona

Be detailed and specific. Use "you" and "your" when addressing the user.`},monetization:{system:"You are a business advisor specializing in SaaS and app monetization. Be strategic and practical. Use markdown formatting for clear structure.",user:`Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Suggest monetization strategies for this app. Use structured markdown with clear headings and lists.

Format your response like this:

## Revenue Model Options

### 1. [Model Name]
**Description:** Brief explanation
**Pros:**
- List specific advantages for this app
**Cons:**
- List potential challenges
**Best for:** When to choose this model

### 2. [Model Name]
(same format)

### 3. [Model Name]
(same format)

## Recommended Pricing Strategy
Detail your recommended approach with specific price points if applicable

## Feature Gating Strategy
**Free Tier:**
- Features to keep free

**Premium Tier:**
- Features to gate behind payment

**Reasoning:** Explain the strategy

Be specific with actual price ranges and concrete examples. Use "you" and "your".`},"mvp-comparison":{system:"You are a startup advisor helping someone decide on launch strategy. Be practical and encouraging. Use markdown formatting for clear structure.",user:`Project: {description}

Blueprint Summary: {summary}
Key Features: {features}

Compare two launch approaches using structured markdown.

Format your response like this:

## Quick Launch (MVP) 🚀

**Timeline:** Estimated time to launch
**Core Features:**
- List 4-6 essential features only
**Features to Skip (For Now):**
- List nice-to-have features to defer

**Benefits of This Approach:**
1. Numbered list of advantages
2. Why this works for validation

**Best For:** When to choose this strategy

## Perfect Launch (Full Build) ✨

**Timeline:** Estimated time to launch
**Complete Feature Set:**
- List all features including polish and extras
**Additional Investments:**
- Design refinement
- Advanced features
- Additional integrations

**Benefits of This Approach:**
1. Numbered list of advantages
2. When the investment pays off

**Best For:** When to choose this strategy

## Our Recommendation
Give a clear recommendation based on the project type. Use "you" and "your".`},"cool-features":{system:"You are a creative product designer brainstorming exciting features. Be imaginative but realistic and professional. Return ONLY valid JSON.",user:`Project: {description}

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

Be creative but professional. No emojis. Return ONLY the JSON array, nothing else.`}};async function E(e){try{let{projectDescription:t,estimate:r,enhancementType:a}=await e.json();if(!t||!r||!a)return x.NextResponse.json({error:"Missing required fields"},{status:400});let n=w[a];if(!n)return x.NextResponse.json({error:"Invalid enhancement type"},{status:400});let s=e=>e.replace("{description}",t).replace("{summary}",r.summary||"").replace("{features}",Array.isArray(r.features)?r.features.join(", "):"").replace("{techStack}",r.techStack?JSON.stringify(r.techStack):""),i=s(n.system),o=s(n.user),l=(await (0,R.callOpenRouter)([{role:"system",content:i},{role:"user",content:o}],{model:R.MODELS.GPT_35_TURBO,temperature:.8,max_tokens:800})).trim();return"cool-features"===a?(l=l.replace(/```json\s*/g,"").replace(/```\s*/g,""),console.log("Cleaned cool-features response:",l)):l=l.replace(/```markdown\s*/g,"").replace(/```\s*/g,""),x.NextResponse.json({enhancement:l})}catch(e){return console.error("Error generating enhancement:",e),x.NextResponse.json({error:"Failed to generate enhancement. Please try again."},{status:500})}}e.s(["POST",()=>E],73945);var b=e.i(73945);let P=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/enhance-blueprint/route",pathname:"/api/enhance-blueprint",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/app/api/enhance-blueprint/route.ts",nextConfigOutput:"",userland:b}),{workAsyncStorage:T,workUnitAsyncStorage:C,serverHooks:A}=P;function N(){return(0,a.patchFetch)({workAsyncStorage:T,workUnitAsyncStorage:C})}async function S(e,t,a){P.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let x="/api/enhance-blueprint/route";x=x.replace(/\/index$/,"")||"/";let R=await P.prepare(e,t,{srcPage:x,multiZoneDraftMode:!1});if(!R)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:w,params:E,nextConfig:b,parsedUrl:T,isDraftMode:C,prerenderManifest:A,routerServerContext:N,isOnDemandRevalidate:S,revalidateOnlyGenerated:O,resolvedPathname:k,clientReferenceManifest:_,serverActionsManifest:U}=R,j=(0,l.normalizeAppPath)(x),F=!!(A.dynamicRoutes[j]||A.routes[k]),B=async()=>((null==N?void 0:N.render404)?await N.render404(e,t,T,!1):t.end("This page could not be found"),null);if(F&&!C){let e=!!A.routes[k],t=A.dynamicRoutes[j];if(t&&!1===t.fallback&&!e){if(b.experimental.adapterPath)return await B();throw new y.NoFallbackError}}let M=null;!F||P.isDev||C||(M="/index"===(M=k)?"/":M);let D=!0===P.isDev||!F,I=F&&!D;U&&_&&(0,i.setReferenceManifestsSingleton)({page:x,clientReferenceManifest:_,serverActionsManifest:U,serverModuleMap:(0,o.createServerModuleMap)({serverActionsManifest:U})});let L=e.method||"GET",q=(0,s.getTracer)(),H=q.getActiveScopeSpan(),K={params:E,prerenderManifest:A,renderOpts:{experimental:{authInterrupts:!!b.experimental.authInterrupts},cacheComponents:!!b.cacheComponents,supportsDynamicResponse:D,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:b.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a)=>P.onRequestError(e,t,a,N)},sharedContext:{buildId:w}},$=new u.NodeNextRequest(e),G=new u.NodeNextResponse(t),W=c.NextRequestAdapter.fromNodeNextRequest($,(0,c.signalFromNodeResponse)(t));try{let i=async e=>P.handle(W,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${L} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${L} ${x}`)}),o=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var s,l;let u=async({previousCacheEntry:r})=>{try{if(!o&&S&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(n);e.fetchMetrics=K.renderOpts.fetchMetrics;let l=K.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let u=K.renderOpts.collectedTags;if(!F)return await (0,h.sendResponse)($,G,s,K.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(s.headers);u&&(t[g.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await P.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:I,isOnDemandRevalidate:S})},N),t}},c=await P.handleResponse({req:e,nextConfig:b,cacheKey:M,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:A,isRoutePPREnabled:!1,isOnDemandRevalidate:S,revalidateOnlyGenerated:O,responseGenerator:u,waitUntil:a.waitUntil,isMinimalMode:o});if(!F)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",S?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,m.fromNodeOutgoingHttpHeaders)(c.value.headers);return o&&F||p.delete(g.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,f.getCacheControlHeader)(c.cacheControl)),await (0,h.sendResponse)($,G,new Response(c.value.body,{headers:p,status:c.value.status||200})),null};H?await l(H):await q.withPropagatedContext(e.headers,()=>q.trace(p.BaseServerSpan.handleRequest,{spanName:`${L} ${x}`,kind:s.SpanKind.SERVER,attributes:{"http.method":L,"http.target":e.url}},l))}catch(t){if(t instanceof y.NoFallbackError||await P.onRequestError(e,t,{routerKind:"App Router",routePath:j,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:I,isOnDemandRevalidate:S})}),F)throw t;return await (0,h.sendResponse)($,G,new Response(null,{status:500})),null}}e.s(["handler",()=>S,"patchFetch",()=>N,"routeModule",()=>P,"serverHooks",()=>A,"workAsyncStorage",()=>T,"workUnitAsyncStorage",()=>C],66866)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__604a03b8._.js.map