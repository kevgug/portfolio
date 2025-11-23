import{c as u}from"./reliableScroll-a14c11fc.js";import{Y as l}from"./index-57f20525.js";function g(o,{delay:s=0,duration:n=400,easing:r=l}={}){const a=+getComputedStyle(o).opacity;return{delay:s,duration:n,easing:r,css:c=>`opacity: ${c*a}`}}function x(o,{delay:s=0,duration:n=400,easing:r=u,x:a=0,y:c=0,opacity:e=0}={}){const t=getComputedStyle(o),f=+t.opacity,p=t.transform==="none"?"":t.transform,m=f*(1-e);return{delay:s,duration:n,easing:r,css:(y,i)=>`
			transform: ${p} translate(${(1-y)*a}px, ${(1-y)*c}px);
			opacity: ${f-m*i}`}}function C(o,{delay:s=0,duration:n=400,easing:r=u,start:a=0,opacity:c=0}={}){const e=getComputedStyle(o),t=+e.opacity,f=e.transform==="none"?"":e.transform,p=1-a,m=t*(1-c);return{delay:s,duration:n,easing:r,css:(y,i)=>`
			transform: ${f} scale(${1-p*i});
			opacity: ${t-m*i}
		`}}export{x as a,g as f,C as s};
