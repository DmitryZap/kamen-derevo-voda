
/* ================= живые блоки ================= */
const calm=!matchMedia('(prefers-reduced-motion:no-preference)').matches;
const H=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
const smallEmb=(m,sq)=>{const v=el('svg',{viewBox:'0 0 150 150','aria-hidden':'true'});el('path',{d:stitch(m,0,0,10,!sq),fill:sq?`var(--${m})`:'none',stroke:sq?'none':`var(--${m})`,'stroke-width':4,'stroke-linecap':'round'},v);return v};

/* ---- просмотр снимков ---- */
(function(){let grp=[],k=0,texts={},last=null;
  const box=H('div','', '<button class="x" aria-label="Закрыть">×</button><button class="pv" aria-label="Предыдущий снимок">‹</button><button class="nx" aria-label="Следующий снимок">›</button><img alt=""><div class="cap"></div>');
  box.id='lbx';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Просмотр снимка');document.body.appendChild(box);
  function draw(){const id=grp[k],t=texts[id];box.querySelector('img').src=pic(id);box.querySelector('img').alt=PH[id].c;
    box.querySelector('.cap').innerHTML=(t?`<b>${t[0]}</b>${t[1]}`:'')+`<small>${credit(id)}</small>`;
    box.querySelector('.pv').hidden=box.querySelector('.nx').hidden=grp.length<2}
  window.openLB=(ids,i,tx)=>{grp=ids;k=i;texts=tx||{};last=document.activeElement;box.hidden=false;draw();box.querySelector('.x').focus()};
  const close=()=>{box.hidden=true;last&&last.focus&&last.focus()},step=d=>{k=(k+d+grp.length)%grp.length;draw()};
  box.querySelector('.x').onclick=close;box.querySelector('.pv').onclick=()=>step(-1);box.querySelector('.nx').onclick=()=>step(1);
  box.addEventListener('click',e=>{if(e.target===box)close()});
  addEventListener('keydown',e=>{if(box.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
  document.addEventListener('click',e=>{const t=e.target;
    if(t.matches&&t.matches('img.lb')){const g=(t.dataset.grp||t.dataset.id).split(',');openLB(g,Math.max(0,g.indexOf(t.dataset.id)))}
    const th=t.closest&&t.closest('.th');if(th){const card=th.closest('.card'),im=card.querySelector('figure.ph img'),id=th.dataset.id;im.src=pic(id);im.dataset.id=id;im.alt=PH[id].c;card.querySelector('figure.ph figcaption').innerHTML=credit(id);
      card.querySelectorAll('.th').forEach(b=>b.setAttribute('aria-pressed',b===th))}});
})();
function tiles(host,items,cls){const ids=items.map(x=>x[0]),tx={};items.forEach(x=>tx[x[0]]=[x[1],x[2]]);host.className='tiles '+(cls||'');
  items.forEach((x,i)=>{const b=H('button','tile',`<img src="${pics(x[0])}" alt="" loading="lazy"><span>${x[1]}</span>`);b.style.setProperty('--i',i);b.setAttribute('aria-label',x[1]+': открыть снимок и рассказ');b.onclick=()=>openLB(ids,i,tx);host.appendChild(b)})}

/* ---- титул: смена снимков ---- */
(function(){const S=['06-kizhi-2','s-ruskeala2-3','s-valaam2-1','g-whitesea-2','09-kivach-1','g-vottovaara-3','g-skerries-3','s-kem2-2'],box=$('#slides');if(!box)return;
  S.forEach((id,i)=>{const d=H('div','sl'+(i?'':' on'),`<img src="${pic(id)}" alt="${PH[id].c}" ${i?'loading="lazy"':''}>`);box.appendChild(d)});
  const bar=H('div','bar','<div><b></b><small></small></div><div class="dots" role="group" aria-label="Снимки"></div>');box.appendChild(bar);
  let k=0,t=null;const dots=bar.querySelector('.dots');
  S.forEach((id,i)=>{const b=H('button');b.setAttribute('aria-label',PH[id].c);b.onclick=()=>{set(i);stop()};dots.appendChild(b)});
  function set(i){k=i;box.querySelectorAll('.sl').forEach((s,j)=>s.classList.toggle('on',j===i));dots.querySelectorAll('button').forEach((b,j)=>b.setAttribute('aria-pressed',j===i));
    const p=PH[S[i]];bar.querySelector('b').textContent=p.c;bar.querySelector('small').innerHTML=`Фото: ${p.a}, ${p.l}, <a href="${p.u}" target="_blank" rel="noopener">Викисклад</a>`}
  const stop=()=>{clearInterval(t);t=null},go=()=>{if(!calm&&!t)t=setInterval(()=>{if(!$('header.hero').hidden)set((k+1)%S.length)},5200)};
  box.addEventListener('mouseenter',stop);box.addEventListener('mouseleave',go);box.addEventListener('focusin',stop);set(0);go();
})();

/* ---- титул: сказитель и снимки в оглавлении ---- */
(function(){const pool=[];STOPS.forEach((s,i)=>{if(i!==9)s.facts.forEach(f=>pool.push([f,s.name,i]))});let k=Math.floor(Math.random()*pool.length);
  const t=H('div','teller','<div class="emb2"></div><p></p><button class="btn ghost" id="tellMore">Ещё факт</button>');t.querySelector('.emb2').appendChild(smallEmb('wood'));
  $('#tocbox').insertBefore(t,$('#toc'));
  const draw=()=>{const f=pool[k];t.querySelector('p').innerHTML=`${f[0]}.<small>Из рассказа об остановке «<a href="#route" data-stop="${f[2]}">${f[1]}</a>»</small>`};
  t.querySelector('#tellMore').onclick=()=>{k=(k+1+Math.floor(Math.random()*(pool.length-1)))%pool.length;draw()};
  t.addEventListener('click',e=>{const a=e.target.closest('a[data-stop]');if(a)show(+a.dataset.stop)});draw();
  const TI={region:'g-paanajarvi-2',people:'c-veps-1',economy:'e-ore3-2',culture:'c-kantele-2',names:'p-derzhavin-1',route:'06-kizhi-1',time:'h-pg-kem-2',quiz:'s-belomorsk-1',src:'h-kalevala-3'};
  document.querySelectorAll('#toc a').forEach(a=>{const id=TI[a.getAttribute('href').slice(1)];if(id)a.insertAdjacentHTML('beforeend',`<img src="${pics(id)}" alt="" loading="lazy">`)});
})();

/* ---- глава первая: лики и мерило ---- */
(function(){const sec=$('#region'),pager=sec.querySelector('.pager');
  const w=H('div','',`<h3 class="sub-h">Шесть ликов Карелии</h3><p class="sub-p">Нажмите на снимок, чтобы рассмотреть его и прочитать, что на нём.</p><div id="geoTiles"></div>
   <h3 class="sub-h">Мерило: велика ли Карелия</h3><p class="sub-p">Площадь республики 180,5 тыс. км². Выберите, с чем сравнить.</p><div class="chips" id="cmpChips" role="group" aria-label="С чем сравнить"></div><div class="cmp"><div class="sq"><div id="sqA" style="background:var(--red)">Карелия</div><div id="sqB" style="background:var(--ink2)"></div></div><p class="verdict" id="cmpV" aria-live="polite"></p></div>`);
  sec.insertBefore(w,pager);
  tiles($('#geoTiles'),[
   ['g-skerries-1','Ладожские шхеры','Сотни гранитных островов и узких проливов у северного берега Ладоги. С 2017 года здесь национальный парк. Ледник оставил скалы гладкими, как спины животных; их так и зовут: «бараньи лбы».'],
   ['g-onego-2','Онежское озеро','Второе по площади озеро Европы, 9,7 тыс. км². Местные говорят «Онего» и относятся к нему как к морю: штормит оно всерьёз.'],
   ['g-paanajarvi-2','Паанаярви','Национальный парк на севере, у Полярного круга. Узкое глубокое озеро лежит в разломе между сопками, вокруг нетронутая тайга и горная тундра.'],
   ['g-nuorunen-3','Нуорунен','Высшая точка Карелии, 576 метров. Вершина безлесная, на ней встречаются висячие болота и сейды, камни, поставленные на малые камни.'],
   ['g-vottovaara-2','Воттоваара','Гора в Муезерском районе, 417 метров. Известна каменными россыпями, искривлёнными соснами и спорами о том, человек или ледник расставил здесь валуны.'],
   ['g-whitesea-2','Белое море','Поморы звали его Студёным. Карельский берег низкий, каменистый, с сильными приливами: дважды в сутки вода уходит и открывает дно на сотни метров.']]);
  const A=180520,L=[['Московская область',44329],['Австрия',83879],['Англия',130279],['Греция',131957],['Беларусь',207600],['Финляндия',338462]],max=338462;
  function set(i){const [n,a]=L[i],side=x=>Math.sqrt(x/max)*210;$('#sqA').style.width=$('#sqA').style.height=side(A)+'px';$('#sqB').style.width=$('#sqB').style.height=side(a)+'px';$('#sqB').textContent=a>60000?n:'';
    const r=A/a;$('#cmpV').innerHTML=r>=1?`Карелия в <b>${fmt(r.toFixed(1))} раза</b> больше, чем ${n==='Московская область'?'Московская область':n}: ${a.toLocaleString('ru')} км².`:`${n} больше Карелии в <b>${fmt((1/r).toFixed(1))} раза</b>: ${a.toLocaleString('ru')} км².`;
    document.querySelectorAll('#cmpChips .chip').forEach((c,j)=>c.setAttribute('aria-pressed',j===i))}
  L.forEach((x,i)=>{const b=H('button','chip',x[0]);b.onclick=()=>set(i);$('#cmpChips').appendChild(b)});set(3);
})();

/* ---- глава вторая: сто жителей и три слова ---- */
(function(){const sec=$('#people'),pager=sec.querySelector('.pager');
  const w=H('div','two',`<div><h3 class="sub-h">Если бы в Карелии жило сто человек</h3><div class="chips" id="wafChips" role="group" aria-label="Что показать"></div><div class="waffle" id="waf" role="img"></div><div class="wleg" id="wleg"></div><figcaption id="wafSrc" style="font-size:.86rem;font-style:italic;color:var(--muted);margin-top:10px"></figcaption></div>
   <div><h3 class="sub-h">Как звучит слово «вода»</h3><p class="sub-p">Вепсский и карельский родственны. Но даже внутри карельского формы различаются: переключите язык или наречие и сравните написание.</p><div class="chips" id="lngChips" role="group" aria-label="Язык"></div><dl class="words" id="words"></dl><p style="font-size:.86rem;font-style:italic;color:var(--muted);margin-top:12px">Источник: <a href="https://dictorpus.krc.karelia.ru/en/dict/lemma/17526">ВепКар, статья vezi</a>, КарНЦ РАН. Показаны словарные варианты; внутри наречий существуют местные различия.</p></div>`);
  w.style.marginTop='10px';sec.insertBefore(w,pager);
  for(let i=0;i<100;i++){const c=H('i');c.style.setProperty('--i',i);$('#waf').appendChild(c)}
  const M=[['Где живут',[['Петрозаводск',45,'var(--red)'],['Другие города и посёлки',35,'var(--wood)'],['Село',20,'var(--water)']],'Оценка на 1 января 2024 года, Карелиястат.'],
   ['Какого народа',[['Русские',82,'var(--muted)'],['Карелы',7,'var(--red)'],['Белорусы',4,'var(--wood)'],['Украинцы',2,'var(--water)'],['Финны',1,'var(--stone)'],['Вепсы',1,'var(--ink)'],['Другие',3,'var(--line)']],'Перепись 2010 года, доли среди указавших национальность, округлено; вепсов на деле полчеловека из ста.']];
  function set(m){const cells=[...$('#waf').children];let k=0;$('#wleg').innerHTML='';M[m][1].forEach(([n,v,c])=>{for(let j=0;j<v;j++)cells[k++].style.background=c;$('#wleg').insertAdjacentHTML('beforeend',`<span><i style="background:${c}"></i>${n}<b>${v}</b></span>`)});
    $('#waf').setAttribute('aria-label',M[m][1].map(x=>x[0]+' '+x[1]).join(', '));$('#wafSrc').textContent=M[m][2];document.querySelectorAll('#wafChips .chip').forEach((c,j)=>c.setAttribute('aria-pressed',j===m))}
  M.forEach((x,i)=>{const b=H('button','chip',x[0]);b.onclick=()=>set(i);$('#wafChips').appendChild(b)});set(0);
  const LG=[['Собственно карельское',['vesi / vezi / veži'],'krl'],['Ливвиковское',['vezi'],'olo'],['Людиковское',['vezi / veži'],'lud'],['Вепсский',['vezi'],'vep']],RU=['вода'];
  function lang(i){$('#words').innerHTML=RU.map((r,j)=>`<dt>${r}</dt><dd lang="${LG[i][2]}" style="animation-delay:${j*60}ms">${LG[i][1][j]}</dd>`).join('');document.querySelectorAll('#lngChips .chip').forEach((c,j)=>c.setAttribute('aria-pressed',j===i))}
  LG.forEach((x,i)=>{const b=H('button','chip',x[0]);b.onclick=()=>lang(i);$('#lngChips').appendChild(b)});lang(0);
})();

/* ---- глава третья: что из чего ---- */
(function(){const sec=$('#economy'),pager=sec.querySelector('.pager');
  const w=H('div','',`<h3 class="sub-h">Что из чего делают</h3><p class="sub-p">Четыре богатства края и путь каждого от места добычи до готовой вещи.</p><div class="chips" id="chChips" role="group" aria-label="Сырьё"></div><div class="chain" id="chain" aria-live="polite"></div>`);sec.insertBefore(w,pager);
  const C=[['Руда','stone',[['e-ore3-2','Карьер','Под Костомукшей руду берут открытым способом. Город построили в 1970–1980-е вместе с финнами специально для комбината.'],['e-ore3-1','Фабрика','Руду дробят, обогащают и спекают в шарики.'],['e-ore3-3','Окатыши','Готовое сырьё для домен. Его везут на металлургические заводы и на экспорт.']]],
   ['Лес','wood',[['g-nuorunen-3','Тайга','Сосна и ель покрывают около половины республики.'],['e-paper-3','Комбинат','Кондопога варит целлюлозу и льёт газетную бумагу с 1929 года, Сегежа делает мешочную.'],['e-segezha-2','Бумага','Газеты и бумажные мешки для цемента расходятся по всей стране.']]],
   ['Вода','water',[['09-kivach-1','Порожистая река','Перепады высот на Суне, Выге и Кеми дают напор.'],['e-hes-2','Станция','Кондопожскую ГЭС пустили в 1929 году по плану ГОЭЛРО, первой в Карелии.'],['e-hes-3','Ток и форель','Электричество идёт комбинатам, а в чистой холодной воде у станций ставят садки с форелью.']]],
   ['Камень','stone',[['03-ruskeala-2','Месторождение','Мрамор Рускеалы, малиновый кварцит Шокши, граниты Приладожья.'],['e-shungite-1','Особый случай','Шунгит: чёрная углеродистая порода, которую в мире добывают почти только в Заонежье.'],['s-sortavala2-1','Город','Гранитные цоколи Сортавалы, мрамор Исаакия; из шокшинского кварцита сделан саркофаг Наполеона в Париже.']]]];
  function set(i){const [n,m,st]=C[i];$('#chain').style.setProperty('--c',`var(--${m})`);$('#chain').innerHTML=st.map(s=>`<figure><img class="lb" data-id="${s[0]}" data-grp="${st.map(x=>x[0]).join()}" src="${pics(s[0])}" alt="${PH[s[0]].c}" loading="lazy"><figcaption><b>${s[1]}</b>${s[2]}</figcaption></figure>`).join('');
    document.querySelectorAll('#chChips .chip').forEach((c,j)=>c.setAttribute('aria-pressed',j===i))}
  C.forEach((x,i)=>{const b=H('button','chip',x[0]);b.onclick=()=>set(i);$('#chChips').appendChild(b)});set(0);
})();

/* ---- глава четвёртая: вещи и места ---- */
(function(){const sec=$('#culture'),pager=sec.querySelector('.pager');
  const w=H('div','',`<h3 class="sub-h">Восемь вещей, по которым узнают Карелию</h3><p class="sub-p">Нажмите на любую.</p><div id="cultTiles"></div>`);sec.insertBefore(w,pager);
  tiles($('#cultTiles'),[
   ['c-kantele-2','Кантеле','Щипковый инструмент, родня гуслям. Древнее кантеле долбили из цельного куска дерева и натягивали пять струн. В «Калевале» первое кантеле Вяйнямёйнен делает из челюсти огромной щуки.'],
   ['c-kalitki-3','Калитки','Открытые пирожки из ржаного пресного теста с пшённой, ячневой или картофельной начинкой. При сравнении рецептов обращайте внимание на тесто, начинку и форму защипов: у одного блюда бывают местные варианты.'],
   ['h-kalevala-3','«Калевала»','Первое издание 1835 года. Лённрот сложил эпос из рун, записанных в деревнях Беломорской Карелии; день подписания предисловия, 28 февраля, стал праздником.'],
   ['c-birch-2','Карельская берёза','Разновидность берёзы с узорчатой, «мраморной» древесиной. На крупном снимке виден рисунок волокон. Именно древесина, а не белая кора отличает её на этом изображении.'],
   ['c-kizhi-house-2','Северная изба','Дом-комплекс: жильё, сени, хлев и сарай под одной крышей, чтобы зимой не выходить на мороз. Этот стоит в музее на Кижах.'],
   ['c-chapel-1','Часовни','В деревне без церкви молились в часовне. Часовня могла быть центром поселения вместе с окружающей рощей; такое расположение описано, например, в Кинерме.'],
   ['h-vyg-3','Выговская книга','Старообрядцы Выга держали свои школы и мастерские. Их рукописи с пышными заставками узнают по «поморскому орнаменту».'],
   ['c-veps-1','Вепсский дом','Шёлтозеро на берегу Онего, центр вепсской земли. В таком купеческом доме работает Шёлтозерский вепсский этнографический музей.']],'four');
})();

/* ---- глава пятая: лица ---- */
(function(){const F={'Элиас Лённрот':'p-lonnrot-3','Трофим Рябинин':'p-ryabinin-2','Ирина Федосова':'p-fedosova-1','Гавриил Державин':'p-derzhavin-1','Николай Рерих':'p-roerich3-2'},ids=Object.values(F);
  document.querySelectorAll('.person').forEach(p=>{const n=p.querySelector('b').textContent,d=H('div');while(p.firstChild)d.appendChild(p.firstChild);
    if(F[n])p.insertAdjacentHTML('beforeend',`<img class="face lb" data-id="${F[n]}" data-grp="${ids.join()}" src="${pics(F[n])}" alt="${PH[F[n]].c}" loading="lazy">`);
    else{const f=H('div','face none');f.appendChild(smallEmb('water'));f.title='Прижизненных портретов не сохранилось';p.appendChild(f);d.querySelector('p').insertAdjacentHTML('beforeend',' Портретов рунопевца не сохранилось.')}
    p.appendChild(d)});
})();

/* ---- глава шестая: путник на карте, котомка, вёрсты ---- */
(function(){let seen=new Set();try{seen=new Set(JSON.parse(localStorage.getItem('kdv-seen')||'[]').filter(i=>Number.isInteger(i)&&i>=0&&i<STOPS.length))}catch(e){}
  const trav=el('circle',{id:'trav',r:6,cx:STOPS[0].x,cy:STOPS[0].y},map);trav.style.pointerEvents='none';
  const bar=H('div','playbar','<button class="btn" id="playB">▶ Пройти весь маршрут</button><span id="playT" style="font-style:italic;color:var(--muted)"></span>');$('#filters').after(bar);
  const kot=H('div','kotomka');STOPS.forEach((s,i)=>{const v=smallEmb(s.m,true);v.dataset.i=i;kot.appendChild(v)});kot.appendChild(H('span'));$('#stoplist').after(kot);
  const notebook=H('details','field-task','<summary>Заметки из котомки</summary><ul></ul>');kot.after(notebook);
  const km=(a,b)=>{const R=6371,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lon-a.lon)*r,h=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2;return Math.round(2*R*Math.asin(Math.sqrt(h)))};
  let total=0;for(let i=1;i<STOPS.length;i++)total+=km(STOPS[i-1],STOPS[i]);
  let raf=0;function move(a,b){cancelAnimationFrame(raf);if(calm||a===b){trav.setAttribute('cx',STOPS[b].x);trav.setAttribute('cy',STOPS[b].y);return}
    const path=[];const d=b>a?1:-1;for(let i=a;i!==b+d;i+=d)path.push(STOPS[i]);const T=Math.min(1600,500*(path.length-1)),t0=performance.now();
    (function f(t){let p=Math.min(1,(t-t0)/T);p=p<.5?2*p*p:1-2*(1-p)*(1-p);const u=p*(path.length-1),i=Math.min(path.length-2,Math.floor(u)),q=u-i;
      trav.setAttribute('cx',path[i].x+(path[i+1].x-path[i].x)*q);trav.setAttribute('cy',path[i].y+(path[i+1].y-path[i].y)*q);if(p<1)raf=requestAnimationFrame(f)})(t0)}
  function after(i,prev){map.appendChild(trav);move(prev,i);seen.add(i);try{localStorage.setItem('kdv-seen',JSON.stringify([...seen]))}catch(e){}
    kot.querySelectorAll('svg').forEach(v=>v.classList.toggle('v',seen.has(+v.dataset.i)));kot.querySelector('span').textContent=seen.size===STOPS.length?'Котомка полна: все двенадцать остановок пройдены.':`В котомке ${seen.size} из ${STOPS.length}: узор появляется за каждую открытую остановку.`;
    notebook.querySelector('ul').innerHTML=[...seen].sort((a,b)=>a-b).map(k=>`<li><b>${STOPS[k].name}.</b> ${STOPS[k].takeaway}</li>`).join('');
    const nx=$('#card .next');if(nx&&i<STOPS.length-1)nx.insertAdjacentHTML('beforeend',`<span class="km">По прямой до следующей остановки ${km(STOPS[i],STOPS[i+1])} км.</span>`);
    else if(nx)nx.insertAdjacentHTML('beforeend',`<span class="km">По прямой от точки к точке весь путь составил ${total} км.</span>`)}
  const _show=show;show=function(i){const prev=cur;_show(i);after(i,prev)};
  after(0,0);
  let timer=null;const pb=$('#playB');function stop(){clearInterval(timer);timer=null;pb.textContent='▶ Пройти весь маршрут';$('#playT').textContent=''}
  pb.onclick=()=>{if(timer){stop();return}if(cur===STOPS.length-1)show(0);pb.textContent='❚❚ Остановиться';$('#playT').textContent='Остановка сменяется каждые шесть секунд.';
    timer=setInterval(()=>{if($('#route').hidden||cur>=STOPS.length-1){stop();return}show(cur+1)},6000)};
  addEventListener('hashchange',()=>{if(timer)stop()});
})();

/* ---- глава седьмая: снимки к датам ---- */
(function(){const EI={'V–IV тыс. до н. э.':'s-belomorsk-1','1694':'h-vyg-1','1703':'s-petro2-1','1714':'s-kizhi2-1','1719':'08-marcial-1','1784':'p-derzhavin-1','1835':'h-kalevala-3','1933':'h-bbk-1','1990':'06-kizhi-1','2021':'11-petroglyphs-1'};
  const _ev=showEv;showEv=function(i){_ev(i);const box=$('#event'),id=EI[EVENTS[i][0]];box.classList.toggle('has',!!id);
    if(id)box.insertAdjacentHTML('beforeend',`<figure><img class="lb" data-id="${id}" src="${pic(id)}" alt="${PH[id].c}"><figcaption>${credit(id)}</figcaption></figure>`);
    const nav=H('div','evnav',`<button class="btn ghost" ${i?'':'disabled'}>← Раньше</button><button class="btn ghost" ${i<EVENTS.length-1?'':'disabled'}>Позже →</button>`);
    nav.children[0].onclick=()=>go(i-1);nav.children[1].onclick=()=>go(i+1);box.insertBefore(nav,box.querySelector('figure'))};
  function go(n){showEv(n);const t=document.querySelectorAll('.yr')[n];t.scrollIntoView({inline:'nearest',block:'nearest'})}
  showEv(0);
})();
