
/* ---------- страницы: одна глава на экране, адрес в #якоре ---------- */
(function(){
  const secs=[...document.querySelectorAll('section[id]')],ids=secs.map(x=>x.id),hero=$('header.hero'),tocbox=$('#tocbox'),foot=$('footer');
  const info=secs.map(x=>({id:x.id,cn:x.querySelector('.sec-head .cn').textContent,eb:x.querySelector('.eyebrow').textContent,t:x.querySelector('h2').textContent}));
  info.forEach(c=>{$('#toc').insertAdjacentHTML('beforeend',`<li><a href="#${c.id}"><span class="cn" aria-hidden="true">${c.cn}</span><span><b>${c.t}</b><i>${c.eb}</i></span></a></li>`)});
  secs.forEach((x,i)=>{const p=info[i-1],n=info[i+1];
    x.insertAdjacentHTML('beforeend',`<div class="pager">${p?`<a href="#${p.id}"><small>← ${p.eb.split('.')[0]}</small>${p.t}</a>`:`<a href="#home"><small>← Назад</small>Оглавление</a>`}${n?`<a class="nx" href="#${n.id}"><small>${n.eb.split('.')[0]} →</small>${n.t}</a>`:`<a class="nx" href="#home"><small>Конец →</small>К оглавлению</a>`}</div>`);
    x.querySelector('h2').tabIndex=-1});
  let first=true;
  function go(){const h=location.hash.slice(1),id=ids.includes(h)?h:'home',home=id==='home';
    hero.hidden=!home;tocbox.hidden=!home;secs.forEach(x=>x.hidden=x.id!==id);foot.hidden=!(home||id==='src');
    document.querySelectorAll('nav a').forEach(a=>{a.getAttribute('href')==='#'+id?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')});
    if(!first){scrollTo(0,0);if(!home)$('#'+id+' h2').focus({preventScroll:true})}first=false}
  addEventListener('hashchange',go);go();
})();
