/* Краткие пояснения к старинным словам и местным названиям.
   Формы перечислены явно: «лето» в значении времени года не заменяем. */
(function(){
  const entries=[
    [['сивер'],'Север; в северных говорах также северный ветер.'],
    [['летник'],'Южный ветер. На розе ветров обозначает направление с юга.'],
    [['всток'],'Восток.'],
    [['зри'],'Смотри, обрати внимание.'],
    [['осьмая'],'Восьмая.'],
    [['в лето'],'В год. Старинная формула записи даты.'],
    [['писано'],'Написано.'],
    [['не клените'],'Не ругайте, не проклинайте.'],
    [['описались'],'Здесь: допустили описку, ошиблись при письме.'],
    [['студёного','студёным'],'Холодного / холодным. Студёное море — старинное название Белого моря.'],
    [['онего'],'Онежское озеро. Местное название.'],
    [['ликов'],'Обликов. Здесь: разные виды Карелии.'],
    [['мерило'],'Мера для сравнения или оценки.'],
    [['котомка','котомке','котомки','котомку'],'Дорожный мешок, который носили за плечами. Здесь в него условно собираются заметки о маршруте.'],
    [['путнику','путник'],'Путешественник, человек в пути.'],
    [['сказитель','сказителя','сказителем','сказителями'],'Исполнитель народных сказаний и былин.'],
    [['рунопевец','рунопевца','рунопевцем'],'Исполнитель традиционных эпических песен — рун.'],
    [['вопленица'],'Исполнительница обрядовых плачей — причитаний.'],
    [['причитания'],'Обрядовые плачи: напевные слова скорби, например на похоронах или при прощании невесты с родным домом.'],
    [['погост','погоста'],'Здесь: церковный участок с храмами и колокольней. Значение слова менялось; оно могло обозначать также центр округа или кладбище.'],
    [['лемех','лемехом'],'Небольшие фигурные деревянные пластины, которыми покрывают купола и другие части храма.'],
    [['сени'],'Входное нежилое помещение между улицей и жилой частью дома.']
  ];
  const meanings=new Map(entries.flatMap(([forms,meaning])=>forms.map(form=>[form,meaning])));
  const pattern=new RegExp('(?<![\\p{L}])('+[...meanings.keys()].sort((a,b)=>b.length-a.length).join('|')+')(?![\\p{L}])','giu');
  const tip=document.createElement('div');tip.id='word-tip';tip.className='word-tip';tip.role='tooltip';tip.hidden=true;document.body.appendChild(tip);
  let active=null,timer;
  function close(){clearTimeout(timer);if(active)active.removeAttribute('aria-describedby');active=null;tip.hidden=true}
  function position(){if(!active)return;const r=active.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;
    tip.style.left=Math.max(12,Math.min(innerWidth-w-12,r.left+r.width/2-w/2))+'px';
    tip.style.top=Math.max(12,r.top>=h+20?r.top-h-10:Math.min(innerHeight-h-12,r.bottom+10))+'px'}
  function open(word){clearTimeout(timer);if(active!==word)close();active=word;tip.textContent=word.dataset.meaning;tip.hidden=false;word.setAttribute('aria-describedby',tip.id);position()}
  function later(){clearTimeout(timer);timer=setTimeout(close,180)}
  function annotate(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];
    if(root.nodeType===Node.TEXT_NODE)nodes.push(root);else while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{const p=node.parentElement;if(!p||p.closest('script,style,textarea,button,nav,#src,.glossary-word,.word-tip,[aria-hidden="true"]'))return;
      const matches=[...node.textContent.matchAll(pattern)];if(!matches.length)return;
      const frag=document.createDocumentFragment();let last=0;
      matches.forEach(m=>{frag.append(document.createTextNode(node.textContent.slice(last,m.index)));
        const word=p.namespaceURI==='http://www.w3.org/2000/svg'?document.createElementNS(p.namespaceURI,'tspan'):document.createElement('span');
        word.classList.add('glossary-word');word.setAttribute('tabindex','0');word.setAttribute('role','button');word.setAttribute('aria-label',m[0]+': значение слова');word.dataset.meaning=meanings.get(m[0].toLocaleLowerCase('ru'));word.textContent=m[0];frag.append(word);last=m.index+m[0].length});
      frag.append(document.createTextNode(node.textContent.slice(last)));node.replaceWith(frag);
    });
  }
  annotate(document.body);
  // Карточки маршрута, даты и подписи обновляются без перезагрузки страницы.
  const observer=new MutationObserver(records=>{observer.disconnect();if(active&&!active.isConnected)close();
    records.forEach(r=>{if(r.type==='characterData')annotate(r.target);else r.addedNodes.forEach(n=>{if(n.nodeType===1||n.nodeType===3)annotate(n)})});observe()});
  function observe(){observer.observe(document.body,{childList:true,subtree:true,characterData:true})}observe();
  document.addEventListener('pointerover',e=>{const word=e.target.closest('.glossary-word');if(word&&e.pointerType!=='touch')open(word);else if(tip.contains(e.target))clearTimeout(timer)});
  document.addEventListener('pointerout',e=>{if(e.target.closest('.glossary-word')||tip.contains(e.target))later()});
  document.addEventListener('focusin',e=>{const word=e.target.closest('.glossary-word');if(word)open(word)});
  document.addEventListener('focusout',e=>{if(e.target.closest('.glossary-word'))later()});
  document.addEventListener('click',e=>{const word=e.target.closest('.glossary-word');if(word){e.preventDefault();e.stopPropagation();open(word)}else if(!tip.contains(e.target))close()},true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();const word=e.target.closest('.glossary-word');if(word&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.stopPropagation();open(word)}},true);
  addEventListener('resize',close);addEventListener('hashchange',close);document.addEventListener('scroll',close,true);
})();
