if(!self.define){let e,s={};const n=(n,c)=>(n=new URL(n+".js",c).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(c,t)=>{const a=e||("document"in self?document.currentScript.src:"")||location.href;if(s[a])return;let i={};const o=e=>n(e,a),r={module:{uri:a},exports:i,require:o};s[a]=Promise.all(c.map((e=>r[e]||o(e)))).then((e=>(t(...e),i)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"d5df59132d8ddcbcf6c7bc980d61ea25"},{url:"/_next/static/chunks/117-ca021e14f5cd143c.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/8e1d74a4-406067195340fca1.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/app/_not-found/page-4c97af5d25c58bb9.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/app/layout-7458cf10dcbbe51b.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/app/page-bdf770c6bea8713a.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/fd9d1056-7d9b70e9456442b8.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/framework-f66176bb897dc684.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/main-app-9e2d37e03bb7ace9.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/main-e079d33f27af3a10.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/pages/_app-72b849fbd24ac258.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/pages/_error-7ba65e1336b92748.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-1901e951049c176d.js",revision:"wRWpUcWor7R9bTAbsDcZj"},{url:"/_next/static/css/9de320161955c026.css",revision:"9de320161955c026"},{url:"/_next/static/css/d3df112486f97f47.css",revision:"d3df112486f97f47"},{url:"/_next/static/media/4473ecc91f70f139-s.p.woff",revision:"78e6fc13ea317b55ab0bd6dc4849c110"},{url:"/_next/static/media/463dafcda517f24f-s.p.woff",revision:"cbeb6d2d96eaa268b4b5beb0b46d9632"},{url:"/_next/static/wRWpUcWor7R9bTAbsDcZj/_buildManifest.js",revision:"c155cce658e53418dec34664328b51ac"},{url:"/_next/static/wRWpUcWor7R9bTAbsDcZj/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/downloads/medialogo.jpg",revision:"0b9fbf1d265c1a8daa9d7c7baf072546"},{url:"/manifest.json",revision:"57c653e5ffb1b1dd41b78970d30d5ed7"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
