(function(){
var links=[].slice.call(document.querySelectorAll('.g')),lb=document.getElementById('lb');
if(!lb||!links.length)return;
var img=lb.querySelector('img'),cap=lb.querySelector('.lb-c'),cur=0,sx=null;
function show(n){cur=(n+links.length)%links.length;img.src=links[cur].dataset.full;img.alt=links[cur].querySelector('img').alt;cap.textContent=(cur+1)+' / '+links.length;
 var nx=links[(cur+1)%links.length].dataset.full;(new Image()).src=nx}
function open(n){lb.hidden=false;document.body.style.overflow='hidden';show(n)}
function close(){lb.hidden=true;document.body.style.overflow='';img.removeAttribute('src')}
links.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();open(i)})});
lb.querySelector('.lb-x').onclick=close;lb.querySelector('.lb-p').onclick=function(){show(cur-1)};lb.querySelector('.lb-n').onclick=function(){show(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb)close()});
document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){if(sx===null)return;var d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>50)show(cur+(d<0?1:-1))},{passive:true});
})();
