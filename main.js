(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const root=document.documentElement;
const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
const fine=matchMedia("(hover:hover) and (pointer:fine)").matches;

// Fallback: if animation libraries failed to load, show everything normally.
if(!window.gsap||!window.ScrollTrigger||!window.Lenis){
  root.classList.remove("js");const p=$("#pre");p&&p.remove();loadLater();return;
}

// split headings into masked words
$$(".split").forEach(e=>{const t=e.textContent.trim();e.setAttribute("aria-label",t);
  e.innerHTML=t.split(/\s+/).map(w=>`<span class="wrap" aria-hidden="true"><span class="w">${w}</span></span>`).join(" ")});

gsap.registerPlugin(ScrollTrigger);
const lenis=new Lenis({lerp:.085,smoothWheel:!reduce});
lenis.on("scroll",ScrollTrigger.update);
gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);

// smooth anchors (+ close mobile menu)
const menu=$("#menu");
$$('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
  const t=a.getAttribute("href");
  if(t==="#"){e.preventDefault();return}
  if(t.length>1&&$(t)){e.preventDefault();
    if(menu&&menu.classList.contains("show"))bootstrap.Offcanvas.getInstance(menu)?.hide();
    lenis.scrollTo(t,{duration:reduce?0:1.8})}
}));
if(menu){menu.addEventListener("show.bs.offcanvas",()=>lenis.stop());menu.addEventListener("hidden.bs.offcanvas",()=>lenis.start())}

// lazy-load the remaining hero slides after the first one is on screen
function loadLater(){$$("img[data-src]").forEach(i=>{if(i.dataset.srcset)i.srcset=i.dataset.srcset;i.src=i.dataset.src;i.removeAttribute("data-src")})}
addEventListener("load",loadLater);

// hero slider
const sl=$$(".sl"),dots=$$("#dots i");let cur=-1,tm;
const D=reduce?.01:1;
function go(n){
  if(n===cur)return;const nx=sl[n],pv=sl[cur];
  sl.forEach(s=>s.classList.remove("on"));nx.classList.add("on");
  gsap.set(nx,{zIndex:2});if(pv)gsap.set(pv,{zIndex:1,visibility:"visible"});
  gsap.fromTo(nx,{clipPath:"inset(100% 0 0 0)"},{clipPath:"inset(0% 0 0 0)",duration:1.5*D,ease:"expo.inOut",onComplete:()=>{if(pv)gsap.set(pv,{visibility:"hidden"})}});
  gsap.fromTo(nx.querySelector("img"),{scale:1.25},{scale:1,duration:6*D,ease:"power2.out"});
  gsap.fromTo(nx.querySelectorAll(".cap>*"),{y:50,autoAlpha:0},{y:0,autoAlpha:1,duration:1.2*D,stagger:.12*D,delay:.7*D,ease:"power3.out"});
  dots.forEach(d=>{gsap.killTweensOf(d.firstChild);gsap.set(d.firstChild,{scaleX:0})});
  gsap.to(dots[n].firstChild,{scaleX:1,duration:5.5,ease:"none"});
  cur=n;clearTimeout(tm);tm=setTimeout(()=>go((n+1)%sl.length),5600);
}
dots.forEach((d,i)=>d.onclick=()=>go(i));
// swipe on hero (mobile)
let sx=null;const hero=$("#hero");
hero.addEventListener("touchstart",e=>{sx=e.touches[0].clientX},{passive:true});
hero.addEventListener("touchend",e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;
  if(Math.abs(dx)>50)go((cur+(dx<0?1:-1)+sl.length)%sl.length)},{passive:true});
document.addEventListener("visibilitychange",()=>{if(document.hidden)clearTimeout(tm);else go2()});
function go2(){clearTimeout(tm);tm=setTimeout(()=>go((cur+1)%sl.length),2000)}

// intro: preloader curtain -> hero
const intro=gsap.timeline({defaults:{ease:"power3.out"}});
if(reduce){$("#pre").remove();go(0);$$(".rv").forEach(e=>{e.style.opacity=1;e.style.visibility="visible"});
}else{
  intro.fromTo("#pre span",{opacity:0,y:20},{opacity:1,y:0,stagger:.1,duration:.8},0)
   .to("#pre",{yPercent:-100,duration:1.3,ease:"expo.inOut",delay:.5})
   .add(()=>go(0),"-=.6").from("#hd",{yPercent:-100,duration:1},"-=.2")
   .add(()=>$("#pre")&&($("#pre").style.display="none"));
  setTimeout(()=>{const p=$("#pre");if(p&&p.style.display!=="none"&&cur<0){p.remove();go(0)}},7000); // safety net
}

// scroll reveals (all sizes)
if(!reduce){
  ScrollTrigger.batch(".rv",{start:"top 92%",once:true,onEnter:b=>gsap.fromTo(b,{y:40,autoAlpha:0},{y:0,autoAlpha:1,stagger:.14,duration:1.1,ease:"power3.out",overwrite:true})});
  $$(".split").forEach(h=>gsap.fromTo(h.querySelectorAll(".w"),{yPercent:110},{yPercent:0,stagger:.08,duration:1.2,ease:"expo.out",scrollTrigger:{trigger:h,start:"top 92%",once:true}}));
  $$(".cat").forEach((c,i)=>gsap.from(c,{autoAlpha:0,y:60,duration:1.1,delay:(i%3)*.08,ease:"power3.out",scrollTrigger:{trigger:c,start:"top 92%",once:true}}));
  if(fine)$$(".btn-l").forEach(b=>{
    b.addEventListener("mousemove",e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.25,y:(e.clientY-r.top-r.height/2)*.35,duration:.4})});
    b.addEventListener("mouseleave",()=>gsap.to(b,{x:0,y:0,duration:.8,ease:"elastic.out(1,.4)"}))});

  const mm=gsap.matchMedia();
  // desktop: parallax + pinned horizontal "In Frame" scroll
  mm.add("(min-width:992px)",()=>{
    $$(".ban.px img").forEach(img=>gsap.fromTo(img,{yPercent:-7},{yPercent:7,ease:"none",scrollTrigger:{trigger:img.parentElement,scrub:.6,start:"top bottom",end:"bottom top"}}));
    const t=$("#trk");
    gsap.to(t,{x:()=>-(t.scrollWidth-innerWidth+80),ease:"none",scrollTrigger:{trigger:"#stars",start:"top top",end:()=>"+="+t.scrollWidth*.8,pin:true,scrub:.8,invalidateOnRefresh:true,anticipatePin:1}});
  });
}else{
  $$(".rv").forEach(e=>{e.style.opacity=1;e.style.visibility="visible"});
}

// "Vows": tap to open a panel on touch / narrow screens
$$(".vows .v").forEach(v=>v.addEventListener("click",e=>{
  if(innerWidth>991)return;
  if(!v.classList.contains("open")){e.preventDefault();$$(".vows .v").forEach(x=>x.classList.remove("open"));v.classList.add("open");setTimeout(()=>ScrollTrigger.refresh(),750)}
}));

// sticky header
ScrollTrigger.create({start:80,end:"max",onUpdate:s=>$("#hd").classList.toggle("solid",s.scroll()>80)});
addEventListener("load",()=>ScrollTrigger.refresh());

// robustness: keep scroll positions correct while lazy images / fonts finish loading
let rt;const softRefresh=()=>{clearTimeout(rt);rt=setTimeout(()=>ScrollTrigger.refresh(),250)};
$$("img").forEach(i=>{if(!i.complete)i.addEventListener("load",softRefresh,{once:true})});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(softRefresh);

// "Vows" panels: reveal when visible (never stays hidden)
(function(){const vr=document.getElementById("vowsr");if(!vr)return;
 const show=()=>vr.classList.add("in");
 if(reduce||!("IntersectionObserver" in window)){show();return}
 const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){show();io.disconnect()}},{threshold:.08});
 io.observe(vr);setTimeout(show,7000);
})();
})();
