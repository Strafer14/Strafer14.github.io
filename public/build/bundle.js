var app=function(){"use strict";function e(){}function t(e,t){for(const n in t)e[n]=t[n];return e}function n(e){return e()}function r(){return Object.create(null)}function o(e){e.forEach(n)}function s(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let l,c;function i(e,t,n,r){if(e){const o=$(e,t,n,r);return e[0](o)}}function $(e,n,r,o){return e[1]&&o?t(r.ctx.slice(),e[1](o(n))):r.ctx}function u(e,t,n,r){if(e[2]&&r){const o=e[2](r(n));if(void 0===t.dirty)return o;if("object"==typeof o){const e=[],n=Math.max(t.dirty.length,o.length);for(let r=0;r<n;r+=1)e[r]=t.dirty[r]|o[r];return e}return t.dirty|o}return t.dirty}function p(e,t,n,r,o,s){if(o){const a=$(t,n,r,s);e.p(a,o)}}function f(e){if(e.ctx.length>32){const t=[],n=e.ctx.length/32;for(let e=0;e<n;e++)t[e]=-1;return t}return-1}function m(e){const t={};for(const n in e)"$"!==n[0]&&(t[n]=e[n]);return t}function d(e){return null==e?"":e}function g(e,t){e.appendChild(t)}function h(e,t,n){e.insertBefore(t,n||null)}function v(e){e.parentNode&&e.parentNode.removeChild(e)}function w(e){return document.createElement(e)}function x(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function y(e){return document.createTextNode(e)}function b(){return y(" ")}function I(){return y("")}function C(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function k(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function N(e){c=e}const M=[],z=[],S=[],L=[],T=Promise.resolve();let E=!1;function _(e){S.push(e)}const D=new Set;let q=0;function R(){const e=c;do{for(;q<M.length;){const e=M[q];q++,N(e),j(e.$$)}for(N(null),M.length=0,q=0;z.length;)z.pop()();for(let e=0;e<S.length;e+=1){const t=S[e];D.has(t)||(D.add(t),t())}S.length=0}while(M.length);for(;L.length;)L.pop()();E=!1,D.clear(),N(e)}function j(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(_)}}const A=new Set;let B;function H(e,t){e&&e.i&&(A.delete(e),e.i(t))}function V(e,t,n,r){if(e&&e.o){if(A.has(e))return;A.add(e),B.c.push((()=>{A.delete(e),r&&(n&&e.d(1),r())})),e.o(t)}else r&&r()}function O(e,t){const n={},r={},o={$$scope:1};let s=e.length;for(;s--;){const a=e[s],l=t[s];if(l){for(const e in a)e in l||(r[e]=1);for(const e in l)o[e]||(n[e]=l[e],o[e]=1);e[s]=l}else for(const e in a)o[e]=1}for(const e in r)e in n||(n[e]=void 0);return n}function F(e){return"object"==typeof e&&null!==e?e:{}}function U(e){e&&e.c()}function P(e,t,r,a){const{fragment:l,after_update:c}=e.$$;l&&l.m(t,r),a||_((()=>{const t=e.$$.on_mount.map(n).filter(s);e.$$.on_destroy?e.$$.on_destroy.push(...t):o(t),e.$$.on_mount=[]})),c.forEach(_)}function W(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function J(e,t){-1===e.$$.dirty[0]&&(M.push(e),E||(E=!0,T.then(R)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Y(t,n,s,a,l,i,$,u=[-1]){const p=c;N(t);const f=t.$$={fragment:null,ctx:[],props:i,update:e,not_equal:l,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(p?p.$$.context:[])),callbacks:r(),dirty:u,skip_bound:!1,root:n.target||p.$$.root};$&&$(f.root);let m=!1;if(f.ctx=s?s(t,n.props||{},((e,n,...r)=>{const o=r.length?r[0]:n;return f.ctx&&l(f.ctx[e],f.ctx[e]=o)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](o),m&&J(t,e)),n})):[],f.update(),m=!0,o(f.before_update),f.fragment=!!a&&a(f.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);f.fragment&&f.fragment.l(e),e.forEach(v)}else f.fragment&&f.fragment.c();n.intro&&H(t.$$.fragment),P(t,n.target,n.anchor,n.customElement),R()}N(p)}class G{$destroy(){W(this,1),this.$destroy=e}$on(t,n){if(!s(n))return e;const r=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return r.push(n),()=>{const e=r.indexOf(n);-1!==e&&r.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function K(t){let n,r;return{c(){n=w("p"),r=y(t[0]),C(n,"class","svelte-1sdm78e")},m(e,t){h(e,n,t),g(n,r)},p(e,[t]){1&t&&k(r,e[0])},i:e,o:e,d(e){e&&v(n)}}}function Z(e,t,n){let{content:r}=t;return e.$$set=e=>{"content"in e&&n(0,r=e.content)},[r]}class Q extends G{constructor(e){super(),Y(this,e,Z,K,a,{content:0})}}var X;function ee(e){let t,n;const r=e[2].default,o=i(r,e,e[1],null);return{c(){t=w("h4"),o&&o.c(),C(t,"class","title svelte-f2i0ix")},m(e,r){h(e,t,r),o&&o.m(t,null),n=!0},p(e,t){o&&o.p&&(!n||2&t)&&p(o,r,e,e[1],n?u(r,e[1],t,null):f(e[1]),null)},i(e){n||(H(o,e),n=!0)},o(e){V(o,e),n=!1},d(e){e&&v(t),o&&o.d(e)}}}function te(e){let t,n;const r=e[2].default,o=i(r,e,e[1],null);return{c(){t=w("h2"),o&&o.c(),C(t,"class","title svelte-f2i0ix")},m(e,r){h(e,t,r),o&&o.m(t,null),n=!0},p(e,t){o&&o.p&&(!n||2&t)&&p(o,r,e,e[1],n?u(r,e[1],t,null):f(e[1]),null)},i(e){n||(H(o,e),n=!0)},o(e){V(o,e),n=!1},d(e){e&&v(t),o&&o.d(e)}}}function ne(e){let t,n;const r=e[2].default,o=i(r,e,e[1],null);return{c(){t=w("h1"),o&&o.c(),C(t,"class","title svelte-f2i0ix")},m(e,r){h(e,t,r),o&&o.m(t,null),n=!0},p(e,t){o&&o.p&&(!n||2&t)&&p(o,r,e,e[1],n?u(r,e[1],t,null):f(e[1]),null)},i(e){n||(H(o,e),n=!0)},o(e){V(o,e),n=!1},d(e){e&&v(t),o&&o.d(e)}}}function re(e){let t,n,r,s;const a=[ne,te,ee],l=[];function c(e,t){return e[0]===X.MAIN?0:e[0]===X.SECONDARY?1:e[0]===X.MINOR?2:-1}return~(t=c(e))&&(n=l[t]=a[t](e)),{c(){n&&n.c(),r=I()},m(e,n){~t&&l[t].m(e,n),h(e,r,n),s=!0},p(e,[s]){let i=t;t=c(e),t===i?~t&&l[t].p(e,s):(n&&(B={r:0,c:[],p:B},V(l[i],1,1,(()=>{l[i]=null})),B.r||o(B.c),B=B.p),~t?(n=l[t],n?n.p(e,s):(n=l[t]=a[t](e),n.c()),H(n,1),n.m(r.parentNode,r)):n=null)},i(e){s||(H(n),s=!0)},o(e){V(n),s=!1},d(e){~t&&l[t].d(e),e&&v(r)}}}function oe(e,t,n){let{$$slots:r={},$$scope:o}=t,{titleSize:s}=t;return e.$$set=e=>{"titleSize"in e&&n(0,s=e.titleSize),"$$scope"in e&&n(1,o=e.$$scope)},[s,o,r]}!function(e){e.MAIN="h1",e.SECONDARY="h2",e.MINOR="h4"}(X||(X={}));class se extends G{constructor(e){super(),Y(this,e,oe,re,a,{titleSize:0})}}function ae(e){let t,n;return{c(){t=w("span"),n=y(e[0])},m(e,r){h(e,t,r),g(t,n)},p(e,t){1&t&&k(n,e[0])},d(e){e&&v(t)}}}function le(e){let t,n,r,o,s,a,l,c,i,$,u,p;return r=new se({props:{titleSize:X.MINOR,$$slots:{default:[ae]},$$scope:{ctx:e}}}),u=new Q({props:{content:e[2]}}),{c(){t=w("div"),n=w("div"),U(r.$$.fragment),o=b(),s=w("span"),a=y(e[1]),l=b(),c=w("span"),i=y(e[3]),$=b(),U(u.$$.fragment),C(s,"class","organization-name"),C(n,"class","role-metadata svelte-vqpr2l"),C(c,"class","time-range"),C(t,"class","qualification svelte-vqpr2l")},m(e,f){h(e,t,f),g(t,n),P(r,n,null),g(n,o),g(n,s),g(s,a),g(t,l),g(t,c),g(c,i),g(t,$),P(u,t,null),p=!0},p(e,[t]){const n={};17&t&&(n.$$scope={dirty:t,ctx:e}),r.$set(n),(!p||2&t)&&k(a,e[1]),(!p||8&t)&&k(i,e[3]);const o={};4&t&&(o.content=e[2]),u.$set(o)},i(e){p||(H(r.$$.fragment,e),H(u.$$.fragment,e),p=!0)},o(e){V(r.$$.fragment,e),V(u.$$.fragment,e),p=!1},d(e){e&&v(t),W(r),W(u)}}}function ce(e,t,n){let{role:r}=t,{organizationName:o}=t,{description:s}=t,{timeRange:a}=t;return e.$$set=e=>{"role"in e&&n(0,r=e.role),"organizationName"in e&&n(1,o=e.organizationName),"description"in e&&n(2,s=e.description),"timeRange"in e&&n(3,a=e.timeRange)},[r,o,s,a]}class ie extends G{constructor(e){super(),Y(this,e,ce,le,a,{role:0,organizationName:1,description:2,timeRange:3})}}function $e(e){let t,n;return{c(){t=w("span"),n=y(e[0])},m(e,r){h(e,t,r),g(t,n)},p(e,t){1&t&&k(n,e[0])},d(e){e&&v(t)}}}function ue(e){let t,n,r,o,s;return n=new se({props:{titleSize:X.SECONDARY,$$slots:{default:[$e]},$$scope:{ctx:e}}}),o=new Q({props:{content:e[1]}}),{c(){t=w("div"),U(n.$$.fragment),r=b(),U(o.$$.fragment),C(t,"class","qualification-label-wrapper svelte-1sskxi9")},m(e,a){h(e,t,a),P(n,t,null),g(t,r),P(o,t,null),s=!0},p(e,[t]){const r={};5&t&&(r.$$scope={dirty:t,ctx:e}),n.$set(r);const s={};2&t&&(s.content=e[1]),o.$set(s)},i(e){s||(H(n.$$.fragment,e),H(o.$$.fragment,e),s=!0)},o(e){V(n.$$.fragment,e),V(o.$$.fragment,e),s=!1},d(e){e&&v(t),W(n),W(o)}}}function pe(e,t,n){let{titleLabel:r}=t,{paragraphContent:o}=t;return e.$$set=e=>{"titleLabel"in e&&n(0,r=e.titleLabel),"paragraphContent"in e&&n(1,o=e.paragraphContent)},[r,o]}class fe extends G{constructor(e){super(),Y(this,e,pe,ue,a,{titleLabel:0,paragraphContent:1})}}function me(e){let t,n,r;const o=e[2].default,s=i(o,e,e[1],null);return{c(){t=w("section"),n=w("div"),s&&s.c(),C(n,"class","content svelte-tl1gr3"),C(t,"id",e[0]),C(t,"class","svelte-tl1gr3")},m(e,o){h(e,t,o),g(t,n),s&&s.m(n,null),r=!0},p(e,[n]){s&&s.p&&(!r||2&n)&&p(s,o,e,e[1],r?u(o,e[1],n,null):f(e[1]),null),(!r||1&n)&&C(t,"id",e[0])},i(e){r||(H(s,e),r=!0)},o(e){V(s,e),r=!1},d(e){e&&v(t),s&&s.d(e)}}}function de(e,t,n){let{$$slots:r={},$$scope:o}=t,{sectionName:s}=t;return e.$$set=e=>{"sectionName"in e&&n(0,s=e.sectionName),"$$scope"in e&&n(1,o=e.$$scope)},[s,o,r]}class ge extends G{constructor(e){super(),Y(this,e,de,me,a,{sectionName:0})}}const he=e=>e[0].toUpperCase()+e.slice(1);function ve(t){let n,r,o,s,a,l,c,i;return r=new fe({props:{titleLabel:he(xe),paragraphContent:"I am strongly motivated by my belief that education is important and always strive to learn something new on a daily basis."}}),a=new ie({props:{role:"Economics and Computer Science",organizationName:"The Open University of Israel",timeRange:"Feb, 2018 - Sep, 2025",description:"Completing a Bachelor of Arts degree in Economics and Computer Science while working a full-time job. This requires me to balance my studies with my professional responsibilities."}}),c=new ie({props:{role:"Various technical courses",organizationName:"Israeli Military Intelligence - Unit 8200",timeRange:"Feb, 2013 - Feb, 2016",description:"Python development, PL/SQL, data analysis and more."}}),{c(){n=w("div"),U(r.$$.fragment),o=b(),s=w("div"),U(a.$$.fragment),l=b(),U(c.$$.fragment),C(s,"class","skills"),C(n,"class",d(`${xe}-wrapper`)+" svelte-1f2q6vh")},m(e,t){h(e,n,t),P(r,n,null),g(n,o),g(n,s),P(a,s,null),g(s,l),P(c,s,null),i=!0},p:e,i(e){i||(H(r.$$.fragment,e),H(a.$$.fragment,e),H(c.$$.fragment,e),i=!0)},o(e){V(r.$$.fragment,e),V(a.$$.fragment,e),V(c.$$.fragment,e),i=!1},d(e){e&&v(n),W(r),W(a),W(c)}}}function we(e){let t,n;return t=new ge({props:{sectionName:xe,$$slots:{default:[ve]},$$scope:{ctx:e}}}),{c(){U(t.$$.fragment)},m(e,r){P(t,e,r),n=!0},p(e,[n]){const r={};1&n&&(r.$$scope={dirty:n,ctx:e}),t.$set(r)},i(e){n||(H(t.$$.fragment,e),n=!0)},o(e){V(t.$$.fragment,e),n=!1},d(e){W(t,e)}}}let xe="education";class ye extends G{constructor(e){super(),Y(this,e,null,we,a,{})}}function be(t){let n,r,o,s,a,l,c,i,$,u,p,f;return r=new fe({props:{titleLabel:he(Ce),paragraphContent:"I lead teams and develop applications. I take great pride in building great products and working with great people."}}),a=new ie({props:{role:"Full Stack Team Leader",organizationName:"Zencity",timeRange:"Mar, 2021 - Present",description:"Lead and manage a team of full stack developers, set technical direction and strategy, and oversee the development and delivery of web applications. Manage project workload and contribute to the development of new technologies and processes. My role involves technical expertise, leadership, cooperation and project management skills."}}),c=new ie({props:{role:"Full Stack Developer",organizationName:"Zencity",timeRange:"Jun, 2019 - Feb, 2021",description:"Designed and maintained web applications using various technologies and frameworks. Worked with a team to deliver software solutions and contributed to the design and architecture of new systems. My role involved technical expertise, collaboration, innovation and problem-solving."}}),$=new ie({props:{role:"Co-Founder and VP R&D",organizationName:"Snipe",timeRange:"Jan, 2017 - May, 2019",description:"I co-founded an esports startup and worked closely with the CEO and other executives to align our research and development efforts with the overall business goals of the company. In this role, I developed various products using my skills in full stack development, data engineering, product management, and various other business disciplines."}}),p=new ie({props:{role:"Data Developer Team Leader",organizationName:"Israeli Military Intelligence - Unit 8200",timeRange:"Feb, 2013 - Feb, 2016",description:"Lead a department of Data Developers/Analysts, doing research and data mining in order to find patterns. Developing web solutions to handle the needs of high ranking decision makers."}}),{c(){n=w("div"),U(r.$$.fragment),o=b(),s=w("div"),U(a.$$.fragment),l=b(),U(c.$$.fragment),i=b(),U($.$$.fragment),u=b(),U(p.$$.fragment),C(s,"class","qualifications"),C(n,"class",d(`${Ce}-wrapper`)+" svelte-vmgfcx")},m(e,t){h(e,n,t),P(r,n,null),g(n,o),g(n,s),P(a,s,null),g(s,l),P(c,s,null),g(s,i),P($,s,null),g(s,u),P(p,s,null),f=!0},p:e,i(e){f||(H(r.$$.fragment,e),H(a.$$.fragment,e),H(c.$$.fragment,e),H($.$$.fragment,e),H(p.$$.fragment,e),f=!0)},o(e){V(r.$$.fragment,e),V(a.$$.fragment,e),V(c.$$.fragment,e),V($.$$.fragment,e),V(p.$$.fragment,e),f=!1},d(e){e&&v(n),W(r),W(a),W(c),W($),W(p)}}}function Ie(e){let t,n;return t=new ge({props:{sectionName:Ce,$$slots:{default:[be]},$$scope:{ctx:e}}}),{c(){U(t.$$.fragment)},m(e,r){P(t,e,r),n=!0},p(e,[n]){const r={};1&n&&(r.$$scope={dirty:n,ctx:e}),t.$set(r)},i(e){n||(H(t.$$.fragment,e),n=!0)},o(e){V(t.$$.fragment,e),n=!1},d(e){W(t,e)}}}let Ce="experience";class ke extends G{constructor(e){super(),Y(this,e,null,Ie,a,{})}}function Ne(t){let n;return{c(){n=w("div"),n.textContent="Copyright 2022 Michael",C(n,"class","footer svelte-18n2yi8")},m(e,t){h(e,n,t)},p:e,i:e,o:e,d(e){e&&v(n)}}}class Me extends G{constructor(e){super(),Y(this,e,null,Ne,a,{})}}function ze(t){let n,r;return{c(){n=w("button"),r=y(t[0]),C(n,"class","svelte-1o6o4th")},m(e,t){h(e,n,t),g(n,r)},p(e,[t]){1&t&&k(r,e[0])},i:e,o:e,d(e){e&&v(n)}}}function Se(e,t,n){let{content:r}=t;return e.$$set=e=>{"content"in e&&n(0,r=e.content)},[r]}class Le extends G{constructor(e){super(),Y(this,e,Se,ze,a,{content:0})}}function Te(e){let t,n;return{c(){t=x("title"),n=y(e[0])},m(e,r){h(e,t,r),g(t,n)},p(e,t){1&t&&k(n,e[0])},d(e){e&&v(t)}}}function Ee(e){let t,n,r,o=e[0]&&Te(e);const s=e[3].default,a=i(s,e,e[2],null);return{c(){t=x("svg"),o&&o.c(),n=I(),a&&a.c(),C(t,"xmlns","http://www.w3.org/2000/svg"),C(t,"viewBox",e[1]),C(t,"class","svelte-c8tyih")},m(e,s){h(e,t,s),o&&o.m(t,null),g(t,n),a&&a.m(t,null),r=!0},p(e,[l]){e[0]?o?o.p(e,l):(o=Te(e),o.c(),o.m(t,n)):o&&(o.d(1),o=null),a&&a.p&&(!r||4&l)&&p(a,s,e,e[2],r?u(s,e[2],l,null):f(e[2]),null),(!r||2&l)&&C(t,"viewBox",e[1])},i(e){r||(H(a,e),r=!0)},o(e){V(a,e),r=!1},d(e){e&&v(t),o&&o.d(),a&&a.d(e)}}}function _e(e,t,n){let{$$slots:r={},$$scope:o}=t,{title:s=null}=t,{viewBox:a}=t;return e.$$set=e=>{"title"in e&&n(0,s=e.title),"viewBox"in e&&n(1,a=e.viewBox),"$$scope"in e&&n(2,o=e.$$scope)},[s,a,o,r]}class De extends G{constructor(e){super(),Y(this,e,_e,Ee,a,{title:0,viewBox:1})}}function qe(t){let n;return{c(){n=x("path"),C(n,"d","M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z")},m(e,t){h(e,n,t)},p:e,d(e){e&&v(n)}}}function Re(e){let n,r;const o=[{viewBox:"0 0 496 512"},e[0]];let s={$$slots:{default:[qe]},$$scope:{ctx:e}};for(let e=0;e<o.length;e+=1)s=t(s,o[e]);return n=new De({props:s}),{c(){U(n.$$.fragment)},m(e,t){P(n,e,t),r=!0},p(e,[t]){const r=1&t?O(o,[o[0],F(e[0])]):{};2&t&&(r.$$scope={dirty:t,ctx:e}),n.$set(r)},i(e){r||(H(n.$$.fragment,e),r=!0)},o(e){V(n.$$.fragment,e),r=!1},d(e){W(n,e)}}}function je(e,n,r){return e.$$set=e=>{r(0,n=t(t({},n),m(e)))},[n=m(n)]}class Ae extends G{constructor(e){super(),Y(this,e,je,Re,a,{})}}function Be(t){let n;return{c(){n=x("path"),C(n,"d","M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z")},m(e,t){h(e,n,t)},p:e,d(e){e&&v(n)}}}function He(e){let n,r;const o=[{viewBox:"0 0 448 512"},e[0]];let s={$$slots:{default:[Be]},$$scope:{ctx:e}};for(let e=0;e<o.length;e+=1)s=t(s,o[e]);return n=new De({props:s}),{c(){U(n.$$.fragment)},m(e,t){P(n,e,t),r=!0},p(e,[t]){const r=1&t?O(o,[o[0],F(e[0])]):{};2&t&&(r.$$scope={dirty:t,ctx:e}),n.$set(r)},i(e){r||(H(n.$$.fragment,e),r=!0)},o(e){V(n.$$.fragment,e),r=!1},d(e){W(n,e)}}}function Ve(e,n,r){return e.$$set=e=>{r(0,n=t(t({},n),m(e)))},[n=m(n)]}class Oe extends G{constructor(e){super(),Y(this,e,Ve,He,a,{})}}function Fe(t){let n;return{c(){n=x("path"),C(n,"d","M71.5 142.3c.6-5.9-1.7-11.8-6.1-15.8L20.3 72.1V64h140.2l108.4 237.7L364.2 64h133.7v8.1l-38.6 37c-3.3 2.5-5 6.7-4.3 10.8v272c-.7 4.1 1 8.3 4.3 10.8l37.7 37v8.1H307.3v-8.1l39.1-37.9c3.8-3.8 3.8-5 3.8-10.8V171.2L241.5 447.1h-14.7L100.4 171.2v184.9c-1.1 7.8 1.5 15.6 7 21.2l50.8 61.6v8.1h-144v-8L65 377.3c5.4-5.6 7.9-13.5 6.5-21.2V142.3z")},m(e,t){h(e,n,t)},p:e,d(e){e&&v(n)}}}function Ue(e){let n,r;const o=[{viewBox:"0 0 512 512"},e[0]];let s={$$slots:{default:[Fe]},$$scope:{ctx:e}};for(let e=0;e<o.length;e+=1)s=t(s,o[e]);return n=new De({props:s}),{c(){U(n.$$.fragment)},m(e,t){P(n,e,t),r=!0},p(e,[t]){const r=1&t?O(o,[o[0],F(e[0])]):{};2&t&&(r.$$scope={dirty:t,ctx:e}),n.$set(r)},i(e){r||(H(n.$$.fragment,e),r=!0)},o(e){V(n.$$.fragment,e),r=!1},d(e){W(n,e)}}}function Pe(e,n,r){return e.$$set=e=>{r(0,n=t(t({},n),m(e)))},[n=m(n)]}class We extends G{constructor(e){super(),Y(this,e,Pe,Ue,a,{})}}function Je(t){let n;return{c(){n=x("path"),C(n,"d","M40.1 32L10 108.9v314.3h107V480h60.2l56.8-56.8h87l117-117V32H40.1zm357.8 254.1L331 353H224l-56.8 56.8V353H76.9V72.1h321v214zM331 149v116.9h-40.1V149H331zm-107 0v116.9h-40.1V149H224z")},m(e,t){h(e,n,t)},p:e,d(e){e&&v(n)}}}function Ye(e){let n,r;const o=[{viewBox:"0 0 448 512"},e[0]];let s={$$slots:{default:[Je]},$$scope:{ctx:e}};for(let e=0;e<o.length;e+=1)s=t(s,o[e]);return n=new De({props:s}),{c(){U(n.$$.fragment)},m(e,t){P(n,e,t),r=!0},p(e,[t]){const r=1&t?O(o,[o[0],F(e[0])]):{};2&t&&(r.$$scope={dirty:t,ctx:e}),n.$set(r)},i(e){r||(H(n.$$.fragment,e),r=!0)},o(e){V(n.$$.fragment,e),r=!1},d(e){W(n,e)}}}function Ge(e,n,r){return e.$$set=e=>{r(0,n=t(t({},n),m(e)))},[n=m(n)]}class Ke extends G{constructor(e){super(),Y(this,e,Ge,Ye,a,{})}}function Ze(t){let n;return{c(){n=x("path"),C(n,"d","M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z")},m(e,t){h(e,n,t)},p:e,d(e){e&&v(n)}}}function Qe(e){let n,r;const o=[{viewBox:"0 0 512 512"},e[0]];let s={$$slots:{default:[Ze]},$$scope:{ctx:e}};for(let e=0;e<o.length;e+=1)s=t(s,o[e]);return n=new De({props:s}),{c(){U(n.$$.fragment)},m(e,t){P(n,e,t),r=!0},p(e,[t]){const r=1&t?O(o,[o[0],F(e[0])]):{};2&t&&(r.$$scope={dirty:t,ctx:e}),n.$set(r)},i(e){r||(H(n.$$.fragment,e),r=!0)},o(e){V(n.$$.fragment,e),r=!1},d(e){W(n,e)}}}function Xe(e,n,r){return e.$$set=e=>{r(0,n=t(t({},n),m(e)))},[n=m(n)]}class et extends G{constructor(e){super(),Y(this,e,Xe,Qe,a,{})}}var tt;function nt(t){let n,r,o;return r=new t[0]({}),{c(){n=w("div"),U(r.$$.fragment),C(n,"class","icon svelte-u0uxpu")},m(e,t){h(e,n,t),P(r,n,null),o=!0},p:e,i(e){o||(H(r.$$.fragment,e),o=!0)},o(e){V(r.$$.fragment,e),o=!1},d(e){e&&v(n),W(r)}}}function rt(e,t,n){const r={[tt.TWITTER]:et,[tt.MEDIUM]:We,[tt.LINKED_IN]:Oe,[tt.TWITCH]:Ke,[tt.GITHUB]:Ae};let{chosenIcon:o}=t;const s=r[o];return e.$$set=e=>{"chosenIcon"in e&&n(1,o=e.chosenIcon)},[s,o]}!function(e){e.TWITTER="twitter",e.GITHUB="github",e.MEDIUM="medium",e.LINKED_IN="linkedIn",e.TWITCH="twitch"}(tt||(tt={}));class ot extends G{constructor(e){super(),Y(this,e,rt,nt,a,{chosenIcon:1})}}function st(t){let n;return{c(){n=w("span"),n.textContent="Hello, my name is Michael"},m(e,t){h(e,n,t)},p:e,d(e){e&&v(n)}}}function at(e){let t,n,r,o,s,a,c,i,$,u,p,f,m,d,x,y,I,k,N,M,z,S,L,T,E,_,D,q,R,j,A,B,O,F,J,Y,G,K,Z,ee;return r=new se({props:{titleSize:X.MAIN,$$slots:{default:[st]},$$scope:{ctx:e}}}),a=new Q({props:{content:`I am a ${ct}. I have over ${e[0]} years of experience in the field of software development and have a strong background in both front-end and back-end technologies. \n          I am skilled in leading cross-functional teams and have a track record of delivering high-quality software solutions on time and within budget. I am passionate about staying up-to-date with the latest industry trends and technologies, \n          and I am always looking for ways to improve my team's processes and productivity.`}}),z=new ot({props:{chosenIcon:tt.GITHUB}}),T=new ot({props:{chosenIcon:tt.TWITTER}}),D=new ot({props:{chosenIcon:tt.MEDIUM}}),j=new ot({props:{chosenIcon:tt.LINKED_IN}}),O=new ot({props:{chosenIcon:tt.TWITCH}}),Y=new Le({props:{content:"download cv"}}),{c(){var e,g;t=w("div"),n=w("div"),U(r.$$.fragment),o=b(),s=w("div"),U(a.$$.fragment),c=b(),i=w("div"),$=w("span"),$.textContent="Email",u=b(),p=w("span"),p.textContent=`${it}`,f=b(),m=w("span"),m.textContent="Location",d=b(),x=w("span"),x.textContent="Tel-Aviv Area, Israel",y=b(),I=w("span"),I.textContent="Social",k=b(),N=w("span"),M=w("a"),U(z.$$.fragment),S=b(),L=w("a"),U(T.$$.fragment),E=b(),_=w("a"),U(D.$$.fragment),q=b(),R=w("a"),U(j.$$.fragment),A=b(),B=w("a"),U(O.$$.fragment),F=b(),J=w("div"),U(Y.$$.fragment),G=b(),K=w("img"),C(s,"class","paragraph-wrapper svelte-1xjrqnq"),C($,"class","category-label svelte-1xjrqnq"),C(m,"class","category-label svelte-1xjrqnq"),C(I,"class","category-label svelte-1xjrqnq"),C(M,"href","https://github.com/Strafer14"),C(M,"target","_blank"),C(M,"rel","noopener noreferrer"),C(L,"href","https://twitter.com/Strafer15"),C(L,"target","_blank"),C(L,"rel","noopener noreferrer"),C(_,"href","https://medium.com/@Strafer15"),C(_,"target","_blank"),C(_,"rel","noopener noreferrer"),C(R,"href","https://www.linkedin.com/in/michael-ostrovsky-010605108/"),C(R,"rel","noopener noreferrer"),C(R,"target","_blank"),C(B,"href","https://www.twitch.tv/strafer14"),C(B,"target","_blank"),C(B,"rel","noopener noreferrer"),C(N,"class","icons-wrapper svelte-1xjrqnq"),C(i,"class","contact-details svelte-1xjrqnq"),C(J,"class","contact-actions"),C(n,"class","information"),e=K.src,g=Z="https://cdn.britannica.com/20/154120-050-78DE15C0/lemur.jpg",l||(l=document.createElement("a")),l.href=g,e!==l.href&&C(K,"src","https://cdn.britannica.com/20/154120-050-78DE15C0/lemur.jpg"),C(K,"alt","lamoor"),C(K,"class","svelte-1xjrqnq"),C(t,"class","wrapper svelte-1xjrqnq")},m(e,l){h(e,t,l),g(t,n),P(r,n,null),g(n,o),g(n,s),P(a,s,null),g(n,c),g(n,i),g(i,$),g(i,u),g(i,p),g(i,f),g(i,m),g(i,d),g(i,x),g(i,y),g(i,I),g(i,k),g(i,N),g(N,M),P(z,M,null),g(N,S),g(N,L),P(T,L,null),g(N,E),g(N,_),P(D,_,null),g(N,q),g(N,R),P(j,R,null),g(N,A),g(N,B),P(O,B,null),g(n,F),g(n,J),P(Y,J,null),g(t,G),g(t,K),ee=!0},p(e,t){const n={};2&t&&(n.$$scope={dirty:t,ctx:e}),r.$set(n)},i(e){ee||(H(r.$$.fragment,e),H(a.$$.fragment,e),H(z.$$.fragment,e),H(T.$$.fragment,e),H(D.$$.fragment,e),H(j.$$.fragment,e),H(O.$$.fragment,e),H(Y.$$.fragment,e),ee=!0)},o(e){V(r.$$.fragment,e),V(a.$$.fragment,e),V(z.$$.fragment,e),V(T.$$.fragment,e),V(D.$$.fragment,e),V(j.$$.fragment,e),V(O.$$.fragment,e),V(Y.$$.fragment,e),ee=!1},d(e){e&&v(t),W(r),W(a),W(z),W(T),W(D),W(j),W(O),W(Y)}}}function lt(e){let t,n;return t=new ge({props:{sectionName:"introduction",$$slots:{default:[at]},$$scope:{ctx:e}}}),{c(){U(t.$$.fragment)},m(e,r){P(t,e,r),n=!0},p(e,[n]){const r={};2&n&&(r.$$scope={dirty:n,ctx:e}),t.$set(r)},i(e){n||(H(t.$$.fragment,e),n=!0)},o(e){V(t.$$.fragment,e),n=!1},d(e){W(t,e)}}}let ct="full stack team leader",it="michael@strafer.dev";function $t(e){return[(new Date).getFullYear()-2015]}class ut extends G{constructor(e){super(),Y(this,e,$t,lt,a,{})}}function pt(e){let t,n;return{c(){t=w("span"),n=y(e[0])},m(e,r){h(e,t,r),g(t,n)},p(e,t){1&t&&k(n,e[0])},d(e){e&&v(t)}}}function ft(e){let t,n,r,o,s;return n=new se({props:{titleSize:X.MINOR,$$slots:{default:[pt]},$$scope:{ctx:e}}}),o=new Q({props:{content:e[1]}}),{c(){t=w("div"),U(n.$$.fragment),r=b(),U(o.$$.fragment),C(t,"class","skill svelte-1c8nc3")},m(e,a){h(e,t,a),P(n,t,null),g(t,r),P(o,t,null),s=!0},p(e,[t]){const r={};5&t&&(r.$$scope={dirty:t,ctx:e}),n.$set(r);const s={};2&t&&(s.content=e[1]),o.$set(s)},i(e){s||(H(n.$$.fragment,e),H(o.$$.fragment,e),s=!0)},o(e){V(n.$$.fragment,e),V(o.$$.fragment,e),s=!1},d(e){e&&v(t),W(n),W(o)}}}function mt(e,t,n){let{titleLabel:r}=t,{paragraphContent:o}=t;return e.$$set=e=>{"titleLabel"in e&&n(0,r=e.titleLabel),"paragraphContent"in e&&n(1,o=e.paragraphContent)},[r,o]}class dt extends G{constructor(e){super(),Y(this,e,mt,ft,a,{titleLabel:0,paragraphContent:1})}}function gt(t){let n,r,o,s,a,l,c,i,$,u,p,f;return r=new fe({props:{titleLabel:he(vt),paragraphContent:"I am motivated by the opportunity to work with like-minded individuals who are passionate about creating something great."}}),a=new dt({props:{titleLabel:"Backend Development",paragraphContent:"Typescript, NodeJS, Deno, Rust, Python, Django, Express, NestJS."}}),c=new dt({props:{titleLabel:"Frontend Development",paragraphContent:"HTML, CSS, SASS, Javascript, Typescript, Clojurescript, React, Svelte."}}),$=new dt({props:{titleLabel:"Project Management",paragraphContent:"Planning and Organization, Risk Management, Leadership, Problem-solving, JIRA, Scrum."}}),p=new dt({props:{titleLabel:"Cloud Infrastructure & DevOps",paragraphContent:"AWS, Azure, Terraform, Serverless, CircleCI, Gitlab CI/CD."}}),{c(){n=w("div"),U(r.$$.fragment),o=b(),s=w("div"),U(a.$$.fragment),l=b(),U(c.$$.fragment),i=b(),U($.$$.fragment),u=b(),U(p.$$.fragment),C(s,"class","skills svelte-153jid3"),C(n,"class",d(`${vt}-wrapper`)+" svelte-153jid3")},m(e,t){h(e,n,t),P(r,n,null),g(n,o),g(n,s),P(a,s,null),g(s,l),P(c,s,null),g(s,i),P($,s,null),g(s,u),P(p,s,null),f=!0},p:e,i(e){f||(H(r.$$.fragment,e),H(a.$$.fragment,e),H(c.$$.fragment,e),H($.$$.fragment,e),H(p.$$.fragment,e),f=!0)},o(e){V(r.$$.fragment,e),V(a.$$.fragment,e),V(c.$$.fragment,e),V($.$$.fragment,e),V(p.$$.fragment,e),f=!1},d(e){e&&v(n),W(r),W(a),W(c),W($),W(p)}}}function ht(e){let t,n;return t=new ge({props:{sectionName:vt,$$slots:{default:[gt]},$$scope:{ctx:e}}}),{c(){U(t.$$.fragment)},m(e,r){P(t,e,r),n=!0},p(e,[n]){const r={};1&n&&(r.$$scope={dirty:n,ctx:e}),t.$set(r)},i(e){n||(H(t.$$.fragment,e),n=!0)},o(e){V(t.$$.fragment,e),n=!1},d(e){W(t,e)}}}let vt="skills";class wt extends G{constructor(e){super(),Y(this,e,null,ht,a,{})}}function xt(t){let n,r,o;return{c(){n=w("header"),r=w("div"),r.innerHTML='<span class="logo svelte-1mshem8">Michael</span> \n    <div class="menu svelte-1mshem8"><ul class="svelte-1mshem8"><li class="svelte-1mshem8"><a href="#introduction" class="svelte-1mshem8">Introduction</a></li> \n        <li class="svelte-1mshem8"><a href="#skills" class="svelte-1mshem8">Skills</a></li> \n        <li class="svelte-1mshem8"><a href="#experience" class="svelte-1mshem8">Experience</a></li> \n        <li class="svelte-1mshem8"><a href="#education" class="svelte-1mshem8">Education</a></li></ul></div>',C(r,"class","wrapper svelte-1mshem8"),C(n,"class",o=d(t[0]?"cast-shadow":"")+" svelte-1mshem8")},m(e,t){h(e,n,t),g(n,r)},p(e,[t]){1&t&&o!==(o=d(e[0]?"cast-shadow":"")+" svelte-1mshem8")&&C(n,"class",o)},i:e,o:e,d(e){e&&v(n)}}}function yt(e,t,n){let r=!1;return window.onscroll=function(){window.scrollY>0?n(0,r=!0):n(0,r=!1)},[r]}class bt extends G{constructor(e){super(),Y(this,e,yt,xt,a,{})}}function It(t){let n,r,o,s,a,l,c,i,$,u,p,f,m;return r=new bt({}),s=new ut({}),l=new wt({}),i=new ke({}),u=new ye({}),f=new Me({}),{c(){n=w("body"),U(r.$$.fragment),o=b(),U(s.$$.fragment),a=b(),U(l.$$.fragment),c=b(),U(i.$$.fragment),$=b(),U(u.$$.fragment),p=b(),U(f.$$.fragment)},m(e,t){h(e,n,t),P(r,n,null),g(n,o),P(s,n,null),g(n,a),P(l,n,null),g(n,c),P(i,n,null),g(n,$),P(u,n,null),g(n,p),P(f,n,null),m=!0},p:e,i(e){m||(H(r.$$.fragment,e),H(s.$$.fragment,e),H(l.$$.fragment,e),H(i.$$.fragment,e),H(u.$$.fragment,e),H(f.$$.fragment,e),m=!0)},o(e){V(r.$$.fragment,e),V(s.$$.fragment,e),V(l.$$.fragment,e),V(i.$$.fragment,e),V(u.$$.fragment,e),V(f.$$.fragment,e),m=!1},d(e){e&&v(n),W(r),W(s),W(l),W(i),W(u),W(f)}}}return new class extends G{constructor(e){super(),Y(this,e,null,It,a,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
