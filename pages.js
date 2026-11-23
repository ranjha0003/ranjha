(function(){
// "← Back" in the header of every inner page: previous page if it was on this site, else the homepage
var hl=document.querySelector('#hd .hl');
if(hl&&!hl.querySelector('.bk')){var b=document.createElement('a');b.className='bk';b.href='index.html';b.textContent='← Back';b.setAttribute('aria-label','Go back');
 b.addEventListener('click',function(e){var same=false;try{same=document.referrer&&new URL(document.referrer).origin===location.origin}catch(x){}
  if(same&&history.length>1){e.preventDefault();history.back()}});
 hl.insertBefore(b,hl.firstChild)}
var links=[].slice.call(document.querySelectorAll('.g')),lb=document.getElementById('lb');
if(!lb||!links.length)return;
var img=lb.querySelector('img'),cap=lb.querySelector('.lb-c'),cur=0,sx=null,pushed=false;
function show(n){cur=(n+links.length)%links.length;img.src=links[cur].dataset.full;img.alt=links[cur].querySelector('img').alt;cap.textContent=(cur+1)+' / '+links.length;
 var nx=links[(cur+1)%links.length].dataset.full;(new Image()).src=nx}
function open(n){lb.hidden=false;document.body.style.overflow='hidden';show(n);
 // one history entry so the phone/browser Back button closes the viewer instead of leaving the page
 try{history.pushState({lb:1},'');pushed=true}catch(e){}}
function hide(){lb.hidden=true;document.body.style.overflow='';img.removeAttribute('src')}
function close(){if(lb.hidden)return;if(pushed){pushed=false;try{history.back();return}catch(e){}}hide()}
window.addEventListener('popstate',function(){if(!lb.hidden){pushed=false;hide()}});
links.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();open(i)})});
lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-b').onclick=close;
lb.querySelector('.lb-p').onclick=function(){show(cur-1)};lb.querySelector('.lb-n').onclick=function(){show(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb)close()});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(sx===null)return;var d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>50)show(cur+(d<0?1:-1))},{passive:true});
})();
