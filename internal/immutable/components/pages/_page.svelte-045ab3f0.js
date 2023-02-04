import{S as ue,i as de,s as me,k as p,l as g,m as _,h as o,n as i,b as q,B as ne,I as dt,J as mt,G as l,K as Be,L as Le,q as H,a as k,w as O,r as K,c as x,x as F,y as Y,u as we,f as P,t as W,z as G,M as xe,N as it,O as De,P as at,g as ht,d as pt,Q as gt,p as Xe,o as vt,R as Qe,T as _t}from"../../chunks/index-43deecd7.js";function wt(r){let e;return{c(){e=p("div"),this.h()},l(t){e=g(t,"DIV",{class:!0}),_(e).forEach(o),this.h()},h(){i(e,"class","w-full h-[1px] rounded-sm bg-separator-grey")},m(t,n){q(t,e,n)},p:ne,i:ne,o:ne,d(t){t&&o(e)}}}class ot extends ue{constructor(e){super(),de(this,e,null,wt,me,{})}}const ee={colors:{background:"#141518",white:"#FFFFFF","glacial-blue":"#A9F4E9","muted-text-grey":"#8B8B8B","description-text-grey":"#E2E2E2","bullet-grey":"#4F4F4F","separator-grey":"#2D2D2D"},fontFamily:{sans:["Euclid Square"],serif:["SangBleu Sunrise"]},fontSize:{xs:"0.7rem",sm:"0.9rem",base:"1rem",lg:"1.125rem",xl:"1.438rem","2xl":"1.75rem","3xl":"2.25rem","4xl":"3rem"},screens:{sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},extend:{borderRadius:{lg:"0.7rem","4xl":"1.75em","5xl":"1.875em","6xl":"2.25em"},padding:{"screen-y":"2.25rem"},transitionTimingFunction:{intro:"cubic-bezier(0, 0.98, 0.31, 0.98)",outro:"cubic-bezier(0.23,0.49,0.31,0.98)"},transitionDuration:{intro:"390ms",outro:"80ms"}}};function bt(r){let e,t,n=r[3].svg+"",s,f,d;return{c(){e=p("div"),t=dt("svg"),this.h()},l(a){e=g(a,"DIV",{style:!0});var m=_(e);t=mt(m,"svg",{class:!0,style:!0,width:!0,height:!0,fill:!0,xmlns:!0,viewBox:!0});var u=_(t);u.forEach(o),m.forEach(o),this.h()},h(){i(t,"class",s="duration-100 "+r[4].class),i(t,"style",f="color: "+r[1]+"; a"),i(t,"width",r[0]),i(t,"height",r[0]),i(t,"fill","none"),i(t,"xmlns","http://www.w3.org/2000/svg"),i(t,"viewBox","0 0 "+r[3].box+" "+r[3].box),i(e,"style",d=r[2]?"transform: scaleY(-1);":"")},m(a,m){q(a,e,m),l(e,t),t.innerHTML=n},p(a,[m]){m&16&&s!==(s="duration-100 "+a[4].class)&&i(t,"class",s),m&2&&f!==(f="color: "+a[1]+"; a")&&i(t,"style",f),m&1&&i(t,"width",a[0]),m&1&&i(t,"height",a[0]),m&4&&d!==(d=a[2]?"transform: scaleY(-1);":"")&&i(e,"style",d)},i:ne,o:ne,d(a){a&&o(e)}}}function kt(r,e,t){let{name:n}=e,{size:s="1rem"}=e,{color:f="#000000"}=e,{flipY:d=!1}=e;const a={box:12,svg:""};let u=new Map([["arrow-down",{box:24,svg:'<defs></defs><title>arrow-down</title><line x1="12" y1="0.75" x2="12" y2="23.25" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></line><polyline points="1.5 12.75 12 23.25 22.5 12.75" fill-rule="evenodd" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></polyline>'}],["network-pin",{box:24,svg:'<path stroke="currentColor" stroke-width="1.5" d="M18.75 16.1988C18.5429 16.1988 18.375 16.0309 18.375 15.8238C18.375 15.6166 18.5429 15.4488 18.75 15.4488"></path><path stroke="currentColor" stroke-width="1.5" d="M18.75 16.1988C18.9571 16.1988 19.125 16.0309 19.125 15.8238C19.125 15.6166 18.9571 15.4488 18.75 15.4488"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.75 11.3238C19.9435 11.3238 21.0881 11.7979 21.932 12.6418C22.7759 13.4857 23.25 14.6303 23.25 15.8238C23.25 17.7448 20.562 21.4008 19.341 22.9618C19.2709 23.0515 19.1812 23.1242 19.0788 23.1741C18.9764 23.224 18.8639 23.25 18.75 23.25C18.6361 23.25 18.5236 23.224 18.4212 23.1741C18.3188 23.1242 18.2291 23.0515 18.159 22.9618C16.938 21.3998 14.25 17.7448 14.25 15.8238C14.25 14.6303 14.7241 13.4857 15.568 12.6418C16.4119 11.7979 17.5565 11.3238 18.75 11.3238Z"></path><g><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.2491 23.0229C12.0708 23.4673 9.8096 23.2564 7.75105 22.4168C5.6925 21.5771 3.9289 20.1463 2.68289 18.3051C1.43689 16.4638 0.764367 14.2947 0.750228 12.0716C0.736088 9.84839 1.38097 7.67087 2.60345 5.81394C3.82593 3.95701 5.5712 2.50392 7.6189 1.63813C9.66659 0.772343 11.9249 0.532681 14.1087 0.949404C16.2925 1.36613 18.3039 2.42055 19.8889 3.97954C21.4739 5.53853 22.5614 7.53219 23.0142 9.7088"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.29231 22.9119C7.77099 20.6809 6.75444 16.6267 6.75444 11.9958C6.75444 7.36485 7.77099 3.31165 9.29231 1.07964"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M0.782089 11.2461H12.7518"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.0051 5.24879H20.9981"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.05453 17.2435H11.2524"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.7119 1.07964C16.007 3.26798 16.7956 5.71853 17.0199 8.25145"></path></g>'}],["arrow-corner-right",{box:24,svg:'<defs></defs><title>arrow-corner-right</title><line x1="4" y1="3.75" x2="19.91" y2="19.66" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></line><polyline points="4.91 19.66 19.91 19.66 19.91 4.66" fill-rule="evenodd" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5px"></polyline>'}]]).get(n)??a;return r.$$set=h=>{t(4,e=Be(Be({},e),Le(h))),"name"in h&&t(5,n=h.name),"size"in h&&t(0,s=h.size),"color"in h&&t(1,f=h.color),"flipY"in h&&t(2,d=h.flipY)},e=Le(e),[s,f,d,u,e,n]}class Ue extends ue{constructor(e){super(),de(this,e,kt,bt,me,{name:5,size:0,color:1,flipY:2})}}function xt(r){let e,t=r[0].label+"",n,s,f,d,a,m,u,h,c;return a=new Ue({props:{name:r[1],color:r[3],size:"0.75em",flipY:r[2]}}),{c(){e=p("a"),n=H(t),s=k(),f=p("div"),d=k(),O(a.$$.fragment),this.h()},l(v){e=g(v,"A",{class:!0,href:!0,target:!0,rel:!0});var y=_(e);n=K(y,t),s=x(y),f=g(y,"DIV",{class:!0}),_(f).forEach(o),d=x(y),F(a.$$.fragment,y),y.forEach(o),this.h()},h(){i(f,"class","mr-[0.4rem] md:mr-[0.6rem]"),i(e,"class","button flex flex-row svelte-1k7mh8p"),i(e,"href",m=r[0].href),i(e,"target",u=r[0].openInNewTab??!1?"_blank":"_self"),i(e,"rel",h=r[0].openInNewTab??!1?"noreferrer":"")},m(v,y){q(v,e,y),l(e,n),l(e,s),l(e,f),l(e,d),Y(a,e,null),c=!0},p(v,[y]){(!c||y&1)&&t!==(t=v[0].label+"")&&we(n,t);const E={};y&2&&(E.name=v[1]),y&4&&(E.flipY=v[2]),a.$set(E),(!c||y&1&&m!==(m=v[0].href))&&i(e,"href",m),(!c||y&1&&u!==(u=v[0].openInNewTab??!1?"_blank":"_self"))&&i(e,"target",u),(!c||y&1&&h!==(h=v[0].openInNewTab??!1?"noreferrer":""))&&i(e,"rel",h)},i(v){c||(P(a.$$.fragment,v),c=!0)},o(v){W(a.$$.fragment,v),c=!1},d(v){v&&o(e),G(a)}}}function yt(r,e,t){let{linkButtonContent:n}=e,{iconName:s}=e,{iconFlipY:f=!1}=e;const d=ee.colors.white;return r.$$set=a=>{"linkButtonContent"in a&&t(0,n=a.linkButtonContent),"iconName"in a&&t(1,s=a.iconName),"iconFlipY"in a&&t(2,f=a.iconFlipY)},[n,s,f,d]}class Re extends ue{constructor(e){super(),de(this,e,yt,xt,me,{linkButtonContent:0,iconName:1,iconFlipY:2})}}function Et(r){let e,t,n,s,f,d,a,m,u,h,c,v,y,E,C,D,w,b,I;return D=new Re({props:{linkButtonContent:{label:"Email",href:"mailto:contact@kevingugelmann.com",openInNewTab:!0},iconName:"arrow-corner-right",iconFlipY:!0}}),b=new Re({props:{linkButtonContent:{label:"LinkedIn",href:"https://www.linkedin.com/in/kevingugelmann/",openInNewTab:!0},iconName:"arrow-corner-right",iconFlipY:!0}}),{c(){e=p("div"),t=p("h2"),n=H("Hire me for an internship"),s=k(),f=p("ul"),d=p("li"),a=H(`Open to work as a UI/UX Designer, Front-End Developer, or Digital
      Marketer.`),m=k(),u=p("li"),h=H("Bilingual in English and German."),c=k(),v=p("li"),y=H("Authorized to work in the UK, EU, and Switzerland."),E=k(),C=p("div"),O(D.$$.fragment),w=k(),O(b.$$.fragment),this.h()},l(V){e=g(V,"DIV",{});var M=_(e);t=g(M,"H2",{class:!0});var B=_(t);n=K(B,"Hire me for an internship"),B.forEach(o),s=x(M),f=g(M,"UL",{class:!0});var J=_(f);d=g(J,"LI",{});var Q=_(d);a=K(Q,`Open to work as a UI/UX Designer, Front-End Developer, or Digital
      Marketer.`),Q.forEach(o),m=x(J),u=g(J,"LI",{});var X=_(u);h=K(X,"Bilingual in English and German."),X.forEach(o),c=x(J),v=g(J,"LI",{});var T=_(v);y=K(T,"Authorized to work in the UK, EU, and Switzerland."),T.forEach(o),J.forEach(o),E=x(M),C=g(M,"DIV",{class:!0});var $=_(C);F(D.$$.fragment,$),w=x($),F(b.$$.fragment,$),$.forEach(o),M.forEach(o),this.h()},h(){i(t,"class","text-glacial-blue uppercase"),i(f,"class","my-9 md:my-11 lg:my-12"),i(C,"class","flex flex-row space-x-3.5")},m(V,M){q(V,e,M),l(e,t),l(t,n),l(e,s),l(e,f),l(f,d),l(d,a),l(f,m),l(f,u),l(u,h),l(f,c),l(f,v),l(v,y),l(e,E),l(e,C),Y(D,C,null),l(C,w),Y(b,C,null),I=!0},p:ne,i(V){I||(P(D.$$.fragment,V),P(b.$$.fragment,V),I=!0)},o(V){W(D.$$.fragment,V),W(b.$$.fragment,V),I=!1},d(V){V&&o(e),G(D),G(b)}}}class Ct extends ue{constructor(e){super(),de(this,e,null,Et,me,{})}}const It=""+new URL("../../assets/sketch-65f6fcbb.svg",import.meta.url).href,Dt=""+new URL("../../assets/svelte-dc8a06dc.svg",import.meta.url).href,St=""+new URL("../../assets/tailwind-css-da161fa0.svg",import.meta.url).href;function $t(r){let e,t,n,s,f,d,a,m,u,h,c,v,y,E,C,D,w,b,I;return{c(){e=p("div"),t=p("div"),n=p("a"),s=p("img"),d=k(),a=p("a"),m=p("img"),h=k(),c=p("a"),v=p("img"),E=k(),C=p("div"),D=p("p"),w=H("Copyright © 2023 Kevin Gugelmann."),b=p("br"),I=H("All rights reserved."),this.h()},l(V){e=g(V,"DIV",{class:!0});var M=_(e);t=g(M,"DIV",{class:!0});var B=_(t);n=g(B,"A",{href:!0,target:!0,rel:!0,class:!0});var J=_(n);s=g(J,"IMG",{src:!0,alt:!0,class:!0}),J.forEach(o),d=x(B),a=g(B,"A",{href:!0,target:!0,rel:!0,class:!0});var Q=_(a);m=g(Q,"IMG",{src:!0,alt:!0,class:!0}),Q.forEach(o),h=x(B),c=g(B,"A",{href:!0,target:!0,rel:!0,class:!0});var X=_(c);v=g(X,"IMG",{src:!0,alt:!0,class:!0}),X.forEach(o),B.forEach(o),E=x(M),C=g(M,"DIV",{class:!0});var T=_(C);D=g(T,"P",{class:!0});var $=_(D);w=K($,"Copyright © 2023 Kevin Gugelmann."),b=g($,"BR",{}),I=K($,"All rights reserved."),$.forEach(o),T.forEach(o),M.forEach(o),this.h()},h(){xe(s.src,f=Dt)||i(s,"src",f),i(s,"alt","Svelte logo"),i(s,"class","svelte-1050ahl"),i(n,"href","https://svelte.dev/"),i(n,"target","_blank"),i(n,"rel","noreferrer"),i(n,"class","svelte-1050ahl"),xe(m.src,u=St)||i(m,"src",u),i(m,"alt","Tailwind CSS logo"),i(m,"class","svelte-1050ahl"),i(a,"href","https://tailwindcss.com/"),i(a,"target","_blank"),i(a,"rel","noreferrer"),i(a,"class","svelte-1050ahl"),xe(v.src,y=It)||i(v,"src",y),i(v,"alt","Sketch logo"),i(v,"class","svelte-1050ahl"),i(c,"href","https://www.sketch.com/"),i(c,"target","_blank"),i(c,"rel","noreferrer"),i(c,"class","svelte-1050ahl"),i(t,"class","flex flex-row space-x-2.5 md:space-x-[0.7rem] lg:space-x-3 mb-[1.35rem] md:mb-0 mt-2 md:mt-0"),i(D,"class","text-muted-text-grey font-light"),i(C,"class","flex flex-col-reverse md:flex-row md:justify-between"),i(e,"class","flex flex-col mb-11 mt-0.5 md:mt-1 lg:mt-2 md:justify-between md:items-center md:flex-row-reverse")},m(V,M){q(V,e,M),l(e,t),l(t,n),l(n,s),l(t,d),l(t,a),l(a,m),l(t,h),l(t,c),l(c,v),l(e,E),l(e,C),l(C,D),l(D,w),l(D,b),l(D,I)},p:ne,i:ne,o:ne,d(V){V&&o(e)}}}class Vt extends ue{constructor(e){super(),de(this,e,null,$t,me,{})}}function Ze(r){let e,t;return{c(){e=p("source"),this.h()},l(n){e=g(n,"SOURCE",{srcset:!0,type:!0}),this.h()},h(){i(e,"srcset",t=r[0].avifSrc),i(e,"type","image/avif")},m(n,s){q(n,e,s)},p(n,s){s&1&&t!==(t=n[0].avifSrc)&&i(e,"srcset",t)},d(n){n&&o(e)}}}function et(r){let e,t;return{c(){e=p("source"),this.h()},l(n){e=g(n,"SOURCE",{srcset:!0,type:!0}),this.h()},h(){i(e,"srcset",t=r[0].webpSrc),i(e,"type","image/webp")},m(n,s){q(n,e,s)},p(n,s){s&1&&t!==(t=n[0].webpSrc)&&i(e,"srcset",t)},d(n){n&&o(e)}}}function Mt(r){let e,t,n,s,f,d,a,m,u=r[0].avifSrc&&Ze(r),h=r[0].webpSrc&&et(r);return{c(){e=p("picture"),u&&u.c(),t=k(),h&&h.c(),n=k(),s=p("img"),this.h()},l(c){e=g(c,"PICTURE",{class:!0});var v=_(e);u&&u.l(v),t=x(v),h&&h.l(v),n=x(v),s=g(v,"IMG",{src:!0,alt:!0,loading:!0,class:!0}),v.forEach(o),this.h()},h(){xe(s.src,f=r[0].src)||i(s,"src",f),i(s,"alt",d=r[0].alt),i(s,"loading",a=r[0].loading??"lazy"),i(s,"class",m=r[1].class),i(e,"class","flex")},m(c,v){q(c,e,v),u&&u.m(e,null),l(e,t),h&&h.m(e,null),l(e,n),l(e,s)},p(c,[v]){c[0].avifSrc?u?u.p(c,v):(u=Ze(c),u.c(),u.m(e,t)):u&&(u.d(1),u=null),c[0].webpSrc?h?h.p(c,v):(h=et(c),h.c(),h.m(e,n)):h&&(h.d(1),h=null),v&1&&!xe(s.src,f=c[0].src)&&i(s,"src",f),v&1&&d!==(d=c[0].alt)&&i(s,"alt",d),v&1&&a!==(a=c[0].loading??"lazy")&&i(s,"loading",a),v&2&&m!==(m=c[1].class)&&i(s,"class",m)},i:ne,o:ne,d(c){c&&o(e),u&&u.d(),h&&h.d()}}}function jt(r,e,t){let{imgOptions:n}=e;return r.$$set=s=>{t(1,e=Be(Be({},e),Le(s))),"imgOptions"in s&&t(0,n=s.imgOptions)},e=Le(e),[n,e]}class ct extends ue{constructor(e){super(),de(this,e,jt,Mt,me,{imgOptions:0})}}var fe=(r=>(r[r.sm=0]="sm",r[r.md=1]="md",r[r.lg=2]="lg",r[r.xl=3]="xl",r[r["2xl"]=4]="2xl",r))(fe||{});const tt=ee.screens,ft=r=>{let e="sm",t=0;for(let n in tt){let s=parseInt(tt[n].slice(0,-2));s>t&&s<=r&&(e=n,t=s)}return fe[e]};var We=(r=>(r[r.xs=0]="xs",r[r.sm=1]="sm",r[r.base=2]="base",r[r.lg=3]="lg",r[r.xl=4]="xl",r[r["2xl"]=5]="2xl",r))(We||{});function ut(r,e){const t=ft(e);switch(r){case 0:switch(t){case fe.sm:return ee.fontSize.xs;default:return ee.fontSize.sm}case 1:switch(t){case fe.sm:return ee.fontSize.sm;default:return ee.fontSize.base}case 2:switch(t){case fe.sm:return ee.fontSize.base;default:return ee.fontSize.lg}case 3:switch(t){case fe.sm:return ee.fontSize.lg;default:return ee.fontSize.xl}case 4:switch(t){case fe.sm:return ee.fontSize.xl;default:return ee.fontSize["2xl"]}case 5:switch(t){case fe.sm:return ee.fontSize["2xl"];case fe.md:return ee.fontSize["3xl"];default:return ee.fontSize["4xl"]}default:return"1rem"}}function At(r){let e,t,n,s=r[0].label+"",f,d,a,m,u,h,c,v,y,E,C,D;return it(r[5]),a=new Ue({props:{name:"arrow-corner-right",color:r[4],size:r[3],flipY:!0}}),{c(){e=p("a"),t=p("div"),n=p("p"),f=H(s),d=k(),O(a.$$.fragment),m=k(),u=p("div"),h=p("div"),this.h()},l(w){e=g(w,"A",{class:!0,href:!0,target:!0,rel:!0});var b=_(e);t=g(b,"DIV",{class:!0});var I=_(t);n=g(I,"P",{class:!0});var V=_(n);f=K(V,s),V.forEach(o),d=x(I),F(a.$$.fragment,I),I.forEach(o),m=x(b),u=g(b,"DIV",{class:!0});var M=_(u);h=g(M,"DIV",{class:!0}),_(h).forEach(o),M.forEach(o),b.forEach(o),this.h()},h(){i(n,"class","text-muted-text-grey group-hover:text-white duration-100"),i(t,"class","group flex flex-row items-center space-x-1.5"),i(h,"class","h-[2px] rounded-sm bg-muted-text-grey group-hover:bg-white opacity-40 group-hover:opacity-100 duration-100"),i(u,"class","absolute flex flex-col-reverse w-full h-[0.24rem] md:h-[0.25rem]"),i(e,"class","group relative"),i(e,"href",c=r[0].href),i(e,"target",v=r[0].openInNewTab??!1?"_blank":"_self"),i(e,"rel",y=r[0].openInNewTab??!1?"noreferrer":"")},m(w,b){q(w,e,b),l(e,t),l(t,n),l(n,f),l(t,d),Y(a,t,null),l(e,m),l(e,u),l(u,h),E=!0,C||(D=[De(window,"resize",r[5]),De(e,"pointerover",r[6]),De(e,"pointerout",r[7])],C=!0)},p(w,[b]){(!E||b&1)&&s!==(s=w[0].label+"")&&we(f,s);const I={};b&16&&(I.color=w[4]),b&8&&(I.size=w[3]),a.$set(I),(!E||b&1&&c!==(c=w[0].href))&&i(e,"href",c),(!E||b&1&&v!==(v=w[0].openInNewTab??!1?"_blank":"_self"))&&i(e,"target",v),(!E||b&1&&y!==(y=w[0].openInNewTab??!1?"noreferrer":""))&&i(e,"rel",y)},i(w){E||(P(a.$$.fragment,w),E=!0)},o(w){W(a.$$.fragment,w),E=!1},d(w){w&&o(e),G(a),C=!1,at(D)}}}function Bt(r,e,t){let n,s,{linkButtonContent:f}=e,d=!1;const a=ee.colors["muted-text-grey"],m=ee.colors.white;let u=0;function h(){t(2,u=window.innerWidth)}const c=()=>t(1,d=!0),v=()=>t(1,d=!1);return r.$$set=y=>{"linkButtonContent"in y&&t(0,f=y.linkButtonContent)},r.$$.update=()=>{r.$$.dirty&2&&t(4,n=d?m:a),r.$$.dirty&4&&t(3,s=ut(We.xs,u))},[f,d,u,s,n,h,c,v]}class Pe extends ue{constructor(e){super(),de(this,e,Bt,At,me,{linkButtonContent:0})}}function rt(r,e,t){const n=r.slice();return n[8]=e[t],n[10]=t,n}function Lt(r){let e;return{c(){e=p("div"),this.h()},l(t){e=g(t,"DIV",{class:!0}),_(e).forEach(o),this.h()},h(){i(e,"class","h-5 md:h-0")},m(t,n){q(t,e,n)},d(t){t&&o(e)}}}function Ut(r){let e;return{c(){e=p("div"),this.h()},l(t){e=g(t,"DIV",{class:!0}),_(e).forEach(o),this.h()},h(){i(e,"class","h-5")},m(t,n){q(t,e,n)},d(t){t&&o(e)}}}function nt(r){let e,t=r[6],n=[];for(let s=0;s<t.length;s+=1)n[s]=lt(rt(r,t,s));return{c(){e=p("div");for(let s=0;s<n.length;s+=1)n[s].c();this.h()},l(s){e=g(s,"DIV",{class:!0});var f=_(e);for(let d=0;d<n.length;d+=1)n[d].l(f);f.forEach(o),this.h()},h(){i(e,"class","flex flex-wrap mt-5 md:mt-6 lg:mt-7")},m(s,f){q(s,e,f);for(let d=0;d<n.length;d+=1)n[d].m(e,null)},p(s,f){if(f&64){t=s[6];let d;for(d=0;d<t.length;d+=1){const a=rt(s,t,d);n[d]?n[d].p(a,f):(n[d]=lt(a),n[d].c(),n[d].m(e,null))}for(;d<n.length;d+=1)n[d].d(1);n.length=t.length}},d(s){s&&o(e),gt(n,s)}}}function st(r){let e,t;return{c(){e=p("p"),t=H("|"),this.h()},l(n){e=g(n,"P",{class:!0});var s=_(e);t=K(s,"|"),s.forEach(o),this.h()},h(){i(e,"class","font-serif text-muted-text-grey px-2")},m(n,s){q(n,e,s),l(e,t)},d(n){n&&o(e)}}}function lt(r){let e,t,n=r[8]+"",s,f,d,a=r[10]!=r[6].length-1&&st();return{c(){e=p("div"),t=p("p"),s=H(n),f=k(),a&&a.c(),d=k(),this.h()},l(m){e=g(m,"DIV",{class:!0});var u=_(e);t=g(u,"P",{class:!0});var h=_(t);s=K(h,n),h.forEach(o),f=x(u),a&&a.l(u),d=x(u),u.forEach(o),this.h()},h(){i(t,"class","font-serif text-muted-text-grey"),i(e,"class","flex flex-row")},m(m,u){q(m,e,u),l(e,t),l(t,s),l(e,f),a&&a.m(e,null),l(e,d)},p(m,u){u&64&&n!==(n=m[8]+"")&&we(s,n),m[10]!=m[6].length-1?a||(a=st(),a.c(),a.m(e,d)):a&&(a.d(1),a=null)},d(m){m&&o(e),a&&a.d()}}}function Tt(r){let e;return{c(){e=p("div")},l(t){e=g(t,"DIV",{}),_(e).forEach(o)},m(t,n){q(t,e,n)},p:ne,i:ne,o:ne,d(t){t&&o(e)}}}function Rt(r){let e,t,n;return t=new Pe({props:{linkButtonContent:r[7]}}),{c(){e=p("div"),O(t.$$.fragment),this.h()},l(s){e=g(s,"DIV",{class:!0});var f=_(e);F(t.$$.fragment,f),f.forEach(o),this.h()},h(){i(e,"class","flex justify-end h-5 mt-14 md:mt-0")},m(s,f){q(s,e,f),Y(t,e,null),n=!0},p(s,f){const d={};f&128&&(d.linkButtonContent=s[7]),t.$set(d)},i(s){n||(P(t.$$.fragment,s),n=!0)},o(s){W(t.$$.fragment,s),n=!1},d(s){s&&o(e),G(t)}}}function Pt(r){let e,t,n,s,f,d,a,m,u,h,c,v,y,E,C,D,w,b,I,V,M,B,J,Q,X,T,$,z;w=new ct({props:{imgOptions:r[4],class:"max-h-full object-contain rounded-md"}});function ce(A,j){return A[7]?Ut:Lt}let te=ce(r),Z=te(r),R=r[6]&&nt(r);const S=[Rt,Tt],N=[];function ge(A,j){return A[7]?0:1}return T=ge(r),$=N[T]=S[T](r),{c(){e=p("div"),t=p("div"),n=p("div"),s=p("p"),f=H(r[0]),d=k(),a=p("h2"),m=H(r[1]),u=k(),h=p("p"),c=H(r[2]),v=H(" — "),y=H(r[3]),E=k(),C=p("div"),D=p("div"),O(w.$$.fragment),b=k(),I=p("div"),Z.c(),V=k(),M=p("div"),B=p("p"),J=H(r[5]),Q=k(),R&&R.c(),X=k(),$.c(),this.h()},l(A){e=g(A,"DIV",{});var j=_(e);t=g(j,"DIV",{class:!0});var U=_(t);n=g(U,"DIV",{class:!0});var re=_(n);s=g(re,"P",{class:!0});var se=_(s);f=K(se,r[0]),se.forEach(o),d=x(re),a=g(re,"H2",{class:!0});var he=_(a);m=K(he,r[1]),he.forEach(o),re.forEach(o),u=x(U),h=g(U,"P",{class:!0});var ae=_(h);c=K(ae,r[2]),v=K(ae," — "),y=K(ae,r[3]),ae.forEach(o),U.forEach(o),E=x(j),C=g(j,"DIV",{class:!0});var ve=_(C);D=g(ve,"DIV",{class:!0});var pe=_(D);F(w.$$.fragment,pe),pe.forEach(o),b=x(ve),I=g(ve,"DIV",{class:!0});var le=_(I);Z.l(le),V=x(le),M=g(le,"DIV",{class:!0});var oe=_(M);B=g(oe,"P",{class:!0});var be=_(B);J=K(be,r[5]),be.forEach(o),Q=x(oe),R&&R.l(oe),oe.forEach(o),X=x(le),$.l(le),le.forEach(o),ve.forEach(o),j.forEach(o),this.h()},h(){i(s,"class","font-semibold text-muted-text-grey leading-none md:mr-4 xl:mr-4.5"),i(a,"class","text-xl md:text-2xl lg:text-3xl font-semibold leading-none mt-[0.52rem] md:mt-[-0.145rem] lg:mt-[-0.21rem]"),i(n,"class","flex flex-col md:flex-row"),i(h,"class","text-muted-text-grey leading-none shrink-0 ml-0 md:ml-10 lg:ml-12 mt-[0.64rem] md:mt-0"),i(t,"class","flex flex-col md:flex-row justify-between"),i(D,"class","flex justify-center mt-1 md:mt-0"),i(B,"class","font-serif text-description-text-grey"),i(M,"class","flex flex-col h-full justify-center my-0 md:my-10 lg:my-0"),i(I,"class","flex flex-col md:justify-between w-full md:min-w-[20em] md:max-w-[25em] mt-2 md:mt-0 md:pl-8 mr-0.5 md:mr-1.5 xl:mr-2 py-0.5 md:py-2"),i(C,"class","flex flex-col md:flex-row mt-8 md:mt-9 lg:mt-10 p-7 bg-gradient-to-b from-[#1E1E1E] to-[#1B1B1B] border-separator-grey border-solid border-[1px] rounded-3xl md:rounded-4xl lg:rounded-5xl xl:rounded-6xl")},m(A,j){q(A,e,j),l(e,t),l(t,n),l(n,s),l(s,f),l(n,d),l(n,a),l(a,m),l(t,u),l(t,h),l(h,c),l(h,v),l(h,y),l(e,E),l(e,C),l(C,D),Y(w,D,null),l(C,b),l(C,I),Z.m(I,null),l(I,V),l(I,M),l(M,B),l(B,J),l(M,Q),R&&R.m(M,null),l(I,X),N[T].m(I,null),z=!0},p(A,[j]){(!z||j&1)&&we(f,A[0]),(!z||j&2)&&we(m,A[1]),(!z||j&4)&&we(c,A[2]),(!z||j&8)&&we(y,A[3]);const U={};j&16&&(U.imgOptions=A[4]),w.$set(U),te!==(te=ce(A))&&(Z.d(1),Z=te(A),Z&&(Z.c(),Z.m(I,V))),(!z||j&32)&&we(J,A[5]),A[6]?R?R.p(A,j):(R=nt(A),R.c(),R.m(M,null)):R&&(R.d(1),R=null);let re=T;T=ge(A),T===re?N[T].p(A,j):(ht(),W(N[re],1,1,()=>{N[re]=null}),pt(),$=N[T],$?$.p(A,j):($=N[T]=S[T](A),$.c()),P($,1),$.m(I,null))},i(A){z||(P(w.$$.fragment,A),P($),z=!0)},o(A){W(w.$$.fragment,A),W($),z=!1},d(A){A&&o(e),G(w),Z.d(),R&&R.d(),N[T].d()}}}function Wt(r,e,t){let{year:n}=e,{name:s}=e,{outputMedium:f}=e,{role:d}=e,{imgOptions:a}=e,{description:m}=e,{builtWith:u}=e,{linkButtonContent:h}=e;return r.$$set=c=>{"year"in c&&t(0,n=c.year),"name"in c&&t(1,s=c.name),"outputMedium"in c&&t(2,f=c.outputMedium),"role"in c&&t(3,d=c.role),"imgOptions"in c&&t(4,a=c.imgOptions),"description"in c&&t(5,m=c.description),"builtWith"in c&&t(6,u=c.builtWith),"linkButtonContent"in c&&t(7,h=c.linkButtonContent)},[n,s,f,d,a,m,u,h]}class Ce extends ue{constructor(e){super(),de(this,e,Wt,Pt,me,{year:0,name:1,outputMedium:2,role:3,imgOptions:4,description:5,builtWith:6,linkButtonContent:7})}}const Nt=""+new URL("../../assets/atf-phone-5d192bd9.png",import.meta.url).href,zt=""+new URL("../../assets/atf-phone-81298e49.avif",import.meta.url).href,Ot=""+new URL("../../assets/atf-phone-a459d6b1.webp",import.meta.url).href;function Ft(r){let e,t,n,s,f,d,a,m,u,h,c,v,y,E,C,D,w,b,I,V,M,B,J,Q,X,T,$,z,ce,te,Z,R,S,N,ge,A,j,U,re,se,he,ae,ve,pe,le,oe,be,_e,Ie,Te,Ne;return it(r[11]),s=new Ue({props:{name:"network-pin",color:r[5],size:r[4]}}),h=new Pe({props:{linkButtonContent:{label:"Email",href:"mailto:contact@kevingugelmann.com",openInNewTab:!0}}}),v=new Pe({props:{linkButtonContent:{label:"LinkedIn",href:"https://www.linkedin.com/in/kevingugelmann/",openInNewTab:!0}}}),C=new ct({props:{imgOptions:{src:Nt,avifSrc:zt,webpSrc:Ot,alt:"A tilted iPhone showing Kevin's latest mobile app",loading:"eager"},class:`hidden md:flex 
          object-contain
          w-auto
          max-w-[15rem] lg:max-w-[16rem] xl:max-w-[16.5rem]
          min-h-[35rem]
          md:pr-10 xl:pr-12
          mr-2 lg:mr-4 xl:mr-8
          mb-7 lg:mb-9 xl:mb-7`}}),U=new Re({props:{linkButtonContent:{label:"View projects",href:"#projects"},iconName:"arrow-down"}}),ae=new ot({}),oe=new Ue({props:{name:"arrow-down",color:r[6],size:"1rem"}}),{c(){e=p("div"),t=p("div"),n=p("div"),O(s.$$.fragment),f=k(),d=p("p"),a=H("Chicago, IL"),m=k(),u=p("div"),O(h.$$.fragment),c=k(),O(v.$$.fragment),y=k(),E=p("div"),O(C.$$.fragment),D=k(),w=p("div"),b=p("div"),I=p("h2"),V=H("Kevin Gugelmann"),M=k(),B=p("h1"),J=H("Digital Designer &"),Q=p("br"),X=H("Front-End Developer"),T=k(),$=p("ul"),z=p("li"),ce=H(`Self-driven student at the University of Chicago, studying Computer
            Science & Business Economics.`),te=k(),Z=p("li"),R=H("Designing digital experiences for over 6 years."),S=k(),N=p("li"),ge=H(`Conceptualizing and building meaningful software products using
            native and cross-platform technologies.`),A=k(),j=p("div"),O(U.$$.fragment),re=k(),se=p("div"),he=p("div"),O(ae.$$.fragment),ve=k(),pe=p("div"),le=p("a"),O(oe.$$.fragment),be=k(),_e=p("div"),this.h()},l(L){e=g(L,"DIV",{class:!0});var ie=_(e);t=g(ie,"DIV",{class:!0});var ke=_(t);n=g(ke,"DIV",{class:!0});var Se=_(n);F(s.$$.fragment,Se),f=x(Se),d=g(Se,"P",{class:!0});var ze=_(d);a=K(ze,"Chicago, IL"),ze.forEach(o),Se.forEach(o),m=x(ke),u=g(ke,"DIV",{class:!0});var $e=_(u);F(h.$$.fragment,$e),c=x($e),F(v.$$.fragment,$e),$e.forEach(o),ke.forEach(o),y=x(ie),E=g(ie,"DIV",{class:!0});var Ve=_(E);F(C.$$.fragment,Ve),D=x(Ve),w=g(Ve,"DIV",{});var Me=_(w);b=g(Me,"DIV",{});var ye=_(b);I=g(ye,"H2",{class:!0});var Oe=_(I);V=K(Oe,"Kevin Gugelmann"),Oe.forEach(o),M=x(ye),B=g(ye,"H1",{class:!0});var je=_(B);J=K(je,"Digital Designer &"),Q=g(je,"BR",{}),X=K(je,"Front-End Developer"),je.forEach(o),T=x(ye),$=g(ye,"UL",{});var Ee=_($);z=g(Ee,"LI",{});var Fe=_(z);ce=K(Fe,`Self-driven student at the University of Chicago, studying Computer
            Science & Business Economics.`),Fe.forEach(o),te=x(Ee),Z=g(Ee,"LI",{});var Ye=_(Z);R=K(Ye,"Designing digital experiences for over 6 years."),Ye.forEach(o),S=x(Ee),N=g(Ee,"LI",{});var Ge=_(N);ge=K(Ge,`Conceptualizing and building meaningful software products using
            native and cross-platform technologies.`),Ge.forEach(o),Ee.forEach(o),ye.forEach(o),A=x(Me),j=g(Me,"DIV",{class:!0});var He=_(j);F(U.$$.fragment,He),He.forEach(o),Me.forEach(o),Ve.forEach(o),re=x(ie),se=g(ie,"DIV",{});var Ae=_(se);he=g(Ae,"DIV",{class:!0});var Ke=_(he);F(ae.$$.fragment,Ke),Ke.forEach(o),ve=x(Ae),pe=g(Ae,"DIV",{class:!0});var qe=_(pe);le=g(qe,"A",{href:!0});var Je=_(le);F(oe.$$.fragment,Je),Je.forEach(o),qe.forEach(o),Ae.forEach(o),ie.forEach(o),be=x(L),_e=g(L,"DIV",{id:!0,style:!0}),_(_e).forEach(o),this.h()},h(){i(d,"class","text-muted-text-grey"),i(n,"class","flex flex-row items-center space-x-2 md:space-x-3"),i(u,"class","flex flex-row space-x-4 md:space-x-5"),i(t,"class","flex flex-row justify-between pt-1 md:pb-5 lg:pb-8"),i(I,"class","text-glacial-blue uppercase mb-2 md:mb-3"),i(B,"class","text-glacial-blue uppercase mb-8 xl:mb-12"),i(j,"class","mt-[4.5rem] lg:mt-[5.5rem] hidden md:flex"),i(E,"class","flex flex-row items-center"),i(he,"class","hidden md:flex"),i(le,"href","#projects"),i(pe,"class","md:hidden mb-1"),i(e,"class","flex flex-col justify-between py-screen-y supports-[height:100cqh]:h-[100cqh] supports-[height:100svh]:h-[100svh] h-screen min-h-[38em] md:min-h-[44em] lg:min-h-[45em] xl:min-h-[47em] max-h-[52em] md:max-h-[54em] lg:max-h-[55em] xl:max-h-[57em]"),i(_e,"id","projects"),Xe(_e,"height",r[3]+"px")},m(L,ie){q(L,e,ie),l(e,t),l(t,n),Y(s,n,null),l(n,f),l(n,d),l(d,a),l(t,m),l(t,u),Y(h,u,null),l(u,c),Y(v,u,null),l(e,y),l(e,E),Y(C,E,null),l(E,D),l(E,w),l(w,b),l(b,I),l(I,V),l(b,M),l(b,B),l(B,J),l(B,Q),l(B,X),l(b,T),l(b,$),l($,z),l(z,ce),l($,te),l($,Z),l(Z,R),l($,S),l($,N),l(N,ge),l(w,A),l(w,j),Y(U,j,null),r[12](E),l(e,re),l(e,se),l(se,he),Y(ae,he,null),l(se,ve),l(se,pe),l(pe,le),Y(oe,le,null),r[13](se),q(L,be,ie),q(L,_e,ie),Ie=!0,Te||(Ne=[De(window,"resize",r[10]),De(window,"resize",r[11])],Te=!0)},p(L,[ie]){const ke={};ie&16&&(ke.size=L[4]),s.$set(ke),(!Ie||ie&8)&&Xe(_e,"height",L[3]+"px")},i(L){Ie||(P(s.$$.fragment,L),P(h.$$.fragment,L),P(v.$$.fragment,L),P(C.$$.fragment,L),P(U.$$.fragment,L),P(ae.$$.fragment,L),P(oe.$$.fragment,L),Ie=!0)},o(L){W(s.$$.fragment,L),W(h.$$.fragment,L),W(v.$$.fragment,L),W(C.$$.fragment,L),W(U.$$.fragment,L),W(ae.$$.fragment,L),W(oe.$$.fragment,L),Ie=!1},d(L){L&&o(e),G(s),G(h),G(v),G(C),G(U),r[12](null),G(ae),G(oe),r[13](null),L&&o(be),L&&o(_e),Te=!1,at(Ne)}}}function Yt(r,e,t){let n,s;const f=ee.colors["muted-text-grey"],d=ee.colors.white;let a=0,m,u,h=0,c=0;const v=()=>{t(8,h=((u==null?void 0:u.getBoundingClientRect().top)??0)-((m==null?void 0:m.getBoundingClientRect().bottom)??0))};vt(()=>{v()});const y=w=>v();function E(){t(0,a=window.innerWidth)}function C(w){Qe[w?"unshift":"push"](()=>{m=w,t(1,m)})}function D(w){Qe[w?"unshift":"push"](()=>{u=w,t(2,u)})}return r.$$.update=()=>{r.$$.dirty&1&&t(4,n=ut(We.sm,a)),r.$$.dirty&1&&t(9,s=ft(a)),r.$$.dirty&768&&(s==fe.sm?t(3,c=Math.min(56,Math.max(16,h))):t(3,c=Math.min(80,Math.max(56,h))))},[a,m,u,c,n,f,d,v,h,s,y,E,C,D]}class Gt extends ue{constructor(e){super(),de(this,e,Yt,Ft,me,{})}}const Ht=""+new URL("../../assets/sport-video-analysis-040d4efa.jpg",import.meta.url).href,Kt=""+new URL("../../assets/sport-video-analysis-60b0aa6c.avif",import.meta.url).href,qt=""+new URL("../../assets/sport-video-analysis-d7941df4.webp",import.meta.url).href,Jt=""+new URL("../../assets/tfdi-056e9b60.jpg",import.meta.url).href,Xt=""+new URL("../../assets/tfdi-81e56fe8.avif",import.meta.url).href,Qt=""+new URL("../../assets/tfdi-7e6f9fdf.webp",import.meta.url).href,Zt=""+new URL("../../assets/mindxone-landing-page-51313e95.jpg",import.meta.url).href,er=""+new URL("../../assets/mindxone-landing-page-617ef104.webp",import.meta.url).href,tr=""+new URL("../../assets/task-timer-app-2b4a4998.avif",import.meta.url).href,rr=""+new URL("../../assets/task-timer-app-2b4a4998.avif",import.meta.url).href,nr=""+new URL("../../assets/task-timer-app-5a182249.webp",import.meta.url).href,sr=""+new URL("../../assets/panorama-mail-ed814f7f.png",import.meta.url).href,lr=""+new URL("../../assets/panorama-mail-8c730a5c.avif",import.meta.url).href,ir=""+new URL("../../assets/panorama-mail-ed814f7f.png",import.meta.url).href,ar=""+new URL("../../assets/prismatic-news-3f422b07.jpg",import.meta.url).href,or=""+new URL("../../assets/prismatic-news-0d44f4ba.avif",import.meta.url).href,cr=""+new URL("../../assets/prismatic-news-3002652e.webp",import.meta.url).href;function fr(r){let e,t,n,s,f,d,a,m,u,h,c,v,y,E,C,D,w,b,I,V,M,B,J,Q,X,T,$,z,ce,te,Z,R;return u=new Gt({}),v=new Ce({props:{year:2022,name:"Sport Video Analysis",outputMedium:"Desktop App",role:"Concept Design",imgOptions:{src:Ht,avifSrc:Kt,webpSrc:qt,alt:"Visually highlighting an athlete's technique in a sport video analysis desktop UI"},description:"Designed and prototyped ten states of a sport video analysis desktop app. Used mainly dark neutrals to keep the user's focus on each video.",builtWith:["Sketch App"],linkButtonContent:void 0}}),E=new Ce({props:{year:2021,name:"TFDi Website Redesign",outputMedium:"Website",role:"Digital Marketing",imgOptions:{src:Jt,avifSrc:Xt,webpSrc:Qt,alt:"Hero section of the Trade Finance Distribution Initiative's landing page with a clear CTA and social validation"},description:"Redesigned the initiative's primary website, doubling site traffic within the first month. Rewrote 1,000+ words of copy across four pages that minimize financial jargon.",builtWith:["Figma","Webflow"],linkButtonContent:{label:"TFDi Website",href:"https://www.tradefinancedistribution.com/",openInNewTab:!0}}}),D=new Ce({props:{year:2020,name:"Mindxone Co-Founder",outputMedium:"Web SaaS",role:"Product, Design & Development",imgOptions:{src:Zt,webpSrc:er,alt:"Hero section of Mindxone's landing page displaying a screenshot of the web SaaS product"},description:"Co-developed a web app reimagining how people create and manage their digital content, based on a tag–exclusive organisation ideology. Took the product to its MVP stage.",builtWith:["Adobe XD","HTML/CSS/JS","JQuery","NodeJS","Express.js","AWS Elastic Beanstalk"],linkButtonContent:void 0}}),b=new Ce({props:{year:2019,name:"Task App with Focus Timer",outputMedium:"Mobile App",role:"Design & Development",imgOptions:{src:tr,avifSrc:rr,webpSrc:nr,alt:"Side-by-side iPhone mockups of a task app with a focus timer"},description:"Designed, prototyped, and built an iOS task app with a focus timer and priority estimation. Swipe-first navigation and duration selection. Custom subtle and playful micro-interactions.",builtWith:["InVision Studio","Flutter"],linkButtonContent:void 0}}),V=new Ce({props:{year:2018,name:"Panorama Mail",outputMedium:"Mobile App",role:"Concept Design",imgOptions:{src:sr,avifSrc:lr,webpSrc:ir,alt:"Side-by-side iPhone screenshots of a concept design mail app"},description:"Prototyped 57 animated artboards of a concept mobile mail app. The titular 'Panorama' screen enables rapid email triaging. Features also include: snooze, quick reply, and undo send.",builtWith:["Adobe XD"],linkButtonContent:void 0}}),B=new Ce({props:{year:2018,name:"Prismatic News",outputMedium:"Android App",role:"Native Development",imgOptions:{src:ar,avifSrc:or,webpSrc:cr,alt:"Side-by-side promotional Android mockups for an offline news-reading app"},description:"Developed and published an Android app that fetches trending news via an API, then scrapes webpages for offline reading. 1000+ installs on the Google Play Store.",builtWith:["Android Studio","Java"],linkButtonContent:{label:"Promo Video (YouTube)",href:"https://youtu.be/6lico6jtV5E",openInNewTab:!0}}}),X=new ot({}),z=new Ct({}),te=new Vt({}),{c(){e=p("meta"),t=p("meta"),n=p("script"),f=p("script"),a=k(),m=p("div"),O(u.$$.fragment),h=k(),c=p("div"),O(v.$$.fragment),y=k(),O(E.$$.fragment),C=k(),O(D.$$.fragment),w=k(),O(b.$$.fragment),I=k(),O(V.$$.fragment),M=k(),O(B.$$.fragment),J=k(),Q=p("div"),O(X.$$.fragment),T=k(),$=p("div"),O(z.$$.fragment),ce=k(),O(te.$$.fragment),Z=k(),this.h()},l(S){const N=_t("svelte-11as8pb",document.head);e=g(N,"META",{name:!0,content:!0}),t=g(N,"META",{name:!0,content:!0}),n=g(N,"SCRIPT",{src:!0});var ge=_(n);ge.forEach(o),f=g(N,"SCRIPT",{src:!0});var A=_(f);A.forEach(o),N.forEach(o),a=x(S),m=g(S,"DIV",{class:!0});var j=_(m);F(u.$$.fragment,j),h=x(j),c=g(j,"DIV",{class:!0});var U=_(c);F(v.$$.fragment,U),y=x(U),F(E.$$.fragment,U),C=x(U),F(D.$$.fragment,U),w=x(U),F(b.$$.fragment,U),I=x(U),F(V.$$.fragment,U),M=x(U),F(B.$$.fragment,U),U.forEach(o),J=x(j),Q=g(j,"DIV",{class:!0});var re=_(Q);F(X.$$.fragment,re),re.forEach(o),T=x(j),$=g(j,"DIV",{class:!0});var se=_($);F(z.$$.fragment,se),se.forEach(o),ce=x(j),F(te.$$.fragment,j),j.forEach(o),Z=x(S),this.h()},h(){document.title="Kevin Gugelmann | Digital Designer & Front-End Developer",i(e,"name","description"),i(e,"content","Portfolio of Kevin Gugelmann, a self-driven student at the University of Chicago studying Computer Science & Business Economics, designing digital experiences for over 6 years and building meaningful software products."),i(t,"name","viewport"),i(t,"content","width=device-width, initial-scale=1"),n.async=!0,n.defer=!0,xe(n.src,s="https://scripts.simpleanalyticscdn.com/latest.js")||i(n,"src",s),f.async=!0,f.defer=!0,xe(f.src,d="https://scripts.simpleanalyticscdn.com/auto-events.js")||i(f,"src",d),i(c,"class","flex flex-col space-y-20 md:space-y-24 lg:space-y-[7.25rem]"),i(Q,"class","pt-20 md:pt-24 lg:pt-32"),i($,"class","py-20 md:py-[6.3rem] lg:py-32"),i(m,"class","flex flex-col mx-auto w-screen max-w-screen-2xl px-[2rem] md:px-[2.5rem] xl:px-[5rem]")},m(S,N){l(document.head,e),l(document.head,t),l(document.head,n),l(document.head,f),q(S,a,N),q(S,m,N),Y(u,m,null),l(m,h),l(m,c),Y(v,c,null),l(c,y),Y(E,c,null),l(c,C),Y(D,c,null),l(c,w),Y(b,c,null),l(c,I),Y(V,c,null),l(c,M),Y(B,c,null),l(m,J),l(m,Q),Y(X,Q,null),l(m,T),l(m,$),Y(z,$,null),l(m,ce),Y(te,m,null),q(S,Z,N),R=!0},p:ne,i(S){R||(P(u.$$.fragment,S),P(v.$$.fragment,S),P(E.$$.fragment,S),P(D.$$.fragment,S),P(b.$$.fragment,S),P(V.$$.fragment,S),P(B.$$.fragment,S),P(X.$$.fragment,S),P(z.$$.fragment,S),P(te.$$.fragment,S),R=!0)},o(S){W(u.$$.fragment,S),W(v.$$.fragment,S),W(E.$$.fragment,S),W(D.$$.fragment,S),W(b.$$.fragment,S),W(V.$$.fragment,S),W(B.$$.fragment,S),W(X.$$.fragment,S),W(z.$$.fragment,S),W(te.$$.fragment,S),R=!1},d(S){o(e),o(t),o(n),o(f),S&&o(a),S&&o(m),G(u),G(v),G(E),G(D),G(b),G(V),G(B),G(X),G(z),G(te),S&&o(Z)}}}class dr extends ue{constructor(e){super(),de(this,e,null,fr,me,{})}}export{dr as default};