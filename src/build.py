"""Собирает ../index.html из base.html, стилей и скриптов этой папки.
Запуск: npm install && python3 build.py
Скрипт вырос слоями (стиль, страницы, анимация, живые блоки), поэтому устроен как цепочка замен поверх base.html."""
import re,base64,glob,os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
s=open('base.html',encoding='utf8').read()
R={'cyrillic':'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116','cyrillic-ext':'U+0460-052F,U+1C80-1C88,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F','latin':'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'}
ff=''
for fam,name,vars_ in [('ruslan-display','Ruslan Display',[('400','normal',['cyrillic','latin'])]),('kurale','Kurale',[('400','normal',['cyrillic','cyrillic-ext','latin'])]),('pt-serif','PT Serif',[('400','normal',['cyrillic','latin']),('700','normal',['cyrillic','latin']),('400','italic',['cyrillic','latin'])])]:
    for w,st,subs in vars_:
        for sub in subs:
            b=base64.b64encode(open(f'node_modules/@fontsource/{fam}/files/{fam}-{sub}-{w}-{st}.woff2','rb').read()).decode()
            ff+=f'@font-face{{font-family:"{name}";font-style:{st};font-weight:{w};font-display:swap;src:url(data:font/woff2;base64,{b}) format("woff2");unicode-range:{R[sub]}}}\n'
css=open('style.css',encoding='utf8').read()
s=re.sub(r'<link rel="stylesheet"[^>]*>\n','',s)
s=re.sub(r'<style>.*?</style>',lambda m:'<style>\n'+css+'</style>\n<style>\n'+ff+'</style>',s,count=1,flags=re.S)
# hero
a=s.index('<header class="hero">');b=s.index('</header>')
facts=s[s.index('<div class="facts">',a):b]
hero='''<header class="hero">
  <div class="band" data-s="5"></div>
  <p class="kicker">Путеводитель по земле Карельской, от Ладоги до Студёного моря</p>
  <h1 class="tri" aria-label="Камень, дерево, вода">
    <span class="row"><span class="emb" data-m="stone"></span><span class="w">Камень</span><span class="gl">петроглифы, рускеальский мрамор, малиновый кварцит, шунгит, руда Костомукши</span></span>
    <span class="row"><span class="emb" data-m="wood"></span><span class="w">Дерево</span><span class="gl">Кижи, карельские деревни, шатровые храмы, бумага Кондопоги и Сегежи</span></span>
    <span class="row"><span class="emb" data-m="water"></span><span class="w">Вода</span><span class="gl">Ладога и Онего, шестьдесят тысяч озёр, Кивач, Беломорканал, Белое море</span></span>
  </h1>
  __INTRO__
  '''+facts
hero=hero.replace('__INTRO__',re.search(r'<p class="sub">.*?</p>',s[a:b],re.S).group(0))
s=s[:a]+hero+s[b:]
# главы
CH=[('region','а','первая'),('people','в','вторая'),('economy','г','третья'),('culture','д','четвёртая'),('names','є','пятая'),('route','ѕ','шестая'),('time','з','седьмая'),('quiz','и','осьмая'),('src','ѳ','девятая')]
for i,(sid,cn,word) in enumerate(CH):
    k=s.index(f'<section id="{sid}">');k1=s.index('<div class="sec-head"><div class="eyebrow">',k);k2=k1+len('<div class="sec-head"><div class="eyebrow">')
    s=s[:k]+f'<section id="{sid}">\n  <div class="band" data-r="{i}"></div>'+s[k+len(f'<section id="{sid}">'):k1]+f'<div class="sec-head"><span class="cn" aria-hidden="true">{cn}</span><div class="eyebrow">Глава {word}. '+s[k2:]
def rep(a,b,cnt=1):
    global s
    assert a in s,a[:60]; s=s.replace(a,b,cnt)
rep('Туристический маршрут · 12 остановок','Маршрут в двенадцать остановок')
rep('<h2>Шесть тысяч лет в пятнадцати датах</h2>','<h2>Летопись: шесть тысяч лет в пятнадцати датах</h2>')
rep('<div class="eyebrow">Глава седьмая. Лента времени</div>','<div class="eyebrow">Глава седьмая. Лента времени</div>')
rep('<h2>Проверьте себя</h2>','<h2>Испытание путнику</h2>')
# зри
rep('<p>Климат переходный','<p class="zri"><b>Зри:</b>Ладога и Онего, первое и второе озёра Европы, оба лежат в Карелии или у её границ.</p>\n      <p>Климат переходный')
rep('<p>Лес перерабатывают','<p class="zri"><b>Зри:</b>доля отрасли в выпуске и доля её работников считаются от разных итогов. Годы наблюдений тоже нужно сверять.</p>\n      <p>Лес перерабатывают')
rep('<p>Русские былины','<p class="zri"><b>Зри:</b>у песни есть исполнитель и собиратель. В истории фольклора стоит запоминать обоих.</p>\n      <p>Русские былины')
# подвал
a=s.index('<footer>');b=s.index('</footer>')
s=s[:a]+'''<footer><div class="band" data-s="5"></div>
<p class="colophon">Писано в лето 7535 от сотворения мира, октября в 8 день. А где описались, не клените, но исправляйте.</p>
<small>Учебный проект «Создание интерактивного путеводителя по региону». Формула в конце взята у древнерусских писцов: так они заканчивали книги. Статистика дана с годом, к которому относится; исторические сведения приведены по энциклопедическим источникам.</small>'''+s[b:]
# JS
a=s.index('/* ---------- силуэт храма ---------- */');b=s.index('/* ---------- люди ---------- */')
emb='''/* ---------- вышивка: узоры строятся по клеткам, как счётный шов ---------- */
const MOTIF={
 stone:(x,y)=>{const a=Math.abs(x),b=Math.abs(y),d=a+b;return d===7||d===4||d<=1||(a===b&&a>=5&&a<=6)},
 wood:(x,y)=>{const a=Math.abs(x);if(x===0)return true;if(y===7&&a<=2)return true;return [[-6,3],[-2,5],[2,6]].some(([k,w])=>y-k===a&&a<=w)},
 water:(x,y)=>[-5,0,5].some(b=>y===b+Math.abs(((x+8)%4)-2)-1)};
function stitch(m,ox,oy,c,cross){let d='';for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++)if(MOTIF[m](x,y)){const px=ox+(x+7)*c,py=oy+(y+7)*c;
  d+=cross?`M${px+.12*c} ${py+.12*c}l${.76*c} ${.76*c}m0 ${-.76*c}l${-.76*c} ${.76*c}`:`M${px} ${py}h${c}v${c}h${-c}z`}return d}
document.querySelectorAll('.emb').forEach(e=>{const m=e.dataset.m,v=el('svg',{viewBox:'0 0 150 150','aria-hidden':'true'});
  el('path',{d:stitch(m,0,0,10,true),fill:'none',stroke:`var(--${m})`,'stroke-width':3.6,'stroke-linecap':'round'},v);e.appendChild(v)});
let bandN=0;document.querySelectorAll('.band').forEach(e=>{const c=+(e.dataset.s||2.5),r=+(e.dataset.r||0),ord=['stone','wood','water'],H=c*21,U=c*19,id='bd'+(bandN++);
  const v=el('svg',{width:'100%',height:H,'aria-hidden':'true'});v.style.height=H+'px';const defs=el('defs',{},v),p=el('pattern',{id,patternUnits:'userSpaceOnUse',width:U*3,height:H},defs);
  let d='';ord.forEach((_,i)=>d+=stitch(ord[(i+r)%3],i*U+2*c,3*c,c,false));
  for(let x=0;x<U*3;x+=2*c)d+=`M${x} 0h${c}v${c}h${-c}zM${x+c} ${H-c}h${c}v${c}h${-c}z`;
  for(let i=0;i<3;i++){const x=i*U+c*.5;d+=`M${x} ${10*c}h${c}v${c}h${-c}zM${x} ${7*c}h${c}v${c}h${-c}zM${x} ${13*c}h${c}v${c}h${-c}z`}
  el('path',{d,fill:'currentColor'},p);el('rect',{width:'100%',height:H,fill:`url(#${id})`},v);e.appendChild(v)});

'''
s=s[:a]+emb+s[b:]
rep("[[60.85,31.55,'Ладожское озеро']","""{const df=el('defs',{},map),pt=el('pattern',{id:'wv',patternUnits:'userSpaceOnUse',width:16,height:7},df);el('path',{d:'M0 3.5q4-3 8 0t8 0',fill:'none',stroke:'var(--water)','stroke-width':.8,opacity:.55},pt);
 map.querySelectorAll('polygon[fill="var(--lake)"]').forEach(p=>{const c=p.cloneNode();c.setAttribute('fill','url(#wv)');p.after(c)})}
{const cx=398,cy=694,g=el('g',{},map);for(let i=0;i<8;i++){const a=i*Math.PI/4,r=i%2?13:26,w=5,x=cx+Math.sin(a)*r,y=cy-Math.cos(a)*r;
  el('polygon',{points:`${x},${y} ${cx+Math.sin(a+1.57)*w},${cy-Math.cos(a+1.57)*w} ${cx},${cy} `,fill:i===0?'var(--red)':'var(--ink)'},g);
  el('polygon',{points:`${x},${y} ${cx+Math.sin(a-1.57)*w},${cy-Math.cos(a-1.57)*w} ${cx},${cy}`,fill:'var(--surface)',stroke:i===0?'var(--red)':'var(--ink)','stroke-width':.8},g)}
 [['сивер',0,-33,'middle'],['Юг · летник',0,41,'middle'],['всток',31,4,'start'],['запад',-31,4,'end']].forEach(([t,dx,dy,an])=>{const e=el('text',{x:cx+dx,y:cy+dy,'text-anchor':an,class:'maplabel'},g);e.textContent=t})}
[[60.85,31.55,'Ладожское озеро']""")
rep("if(t==='Карелия'){e.style.fontSize='15px';e.style.letterSpacing='.2em'}","if(t==='Карелия'){e.style.fontFamily='var(--title)';e.style.fontSize='22px';e.style.fill='var(--red)';e.style.opacity=.75}")
rep("stroke:'var(--muted)','stroke-width':1,'stroke-linejoin':'round'","stroke:'var(--ink)','stroke-width':1.2,'stroke-linejoin':'round'")
rep("el('rect',{x:0,y:0,width:480,height:750,fill:'var(--land-out)'},map);","el('rect',{x:0,y:0,width:480,height:750,fill:'var(--surface)'},map);")
rep("fill:'var(--land-out)',points:poly([[66.9,33.2]","fill:'var(--surface)',points:poly([[66.9,33.2]")
rep("Очертания упрощены, точки стоят по географическим координатам; три соседние остановки у Кондопоги слегка раздвинуты.","Очертания упрощены, точки стоят по географическим координатам; три соседние остановки у Кондопоги слегка раздвинуты. Подписи используют северные названия: сивер — север, всток — восток. Летник — южный ветер; на схеме это слово сопровождает обозначение юга.")
rep("const MAT={","const CN=['а','в','г','д','є','ѕ','з','и','ѳ','і','аі','ві'];\nconst MAT={")
rep("""<div class="top"><span class="tag">${m.n}</span><span class="num" style="color:var(--muted);font-size:.8rem">остановка ${i+1} из ${STOPS.length} · ${s.date}</span></div>""","""<div class="top"><span class="cn" title="${i+1} кириллическим счётом">${CN[i]}</span><span class="tag">${m.n}</span><span>остановка ${i+1} из ${STOPS.length} · ${s.date}</span></div>""")
rep("""<div style="font-size:.88rem"><a href""","""<div style="font-size:.95rem"><a href""")
rep("""$('#event').innerHTML=`<div class="y">${e[0]}</div><div><span class="tag">${MAT[e[1]].n}</span></div>""","""const AM={'1323':6831,'1617':7125,'1694':7203},am=AM[e[0]];
  $('#event').innerHTML=`<div class="y">${am?'В лето '+am:(/^\\d+$/.test(e[0])?'В лето '+e[0]:'Прежде летописей')}</div>${am?`<div class="am">от сотворения мира, как считали тогда; по нынешнему счёту ${e[0]} год</div>`:(/^\\d+$/.test(e[0])?'':'<div class="am">V–IV тысячелетия до нашей эры</div>')}<span class="tag">${MAT[e[1]].n}</span>""")
rep("stroke:'var(--accent)','stroke-width':2},s);","stroke:'var(--red)','stroke-width':2},s);")
s=s.replace("fill:'var(--accent)',stroke:'var(--surface)'","fill:'var(--red)',stroke:'var(--bg)'")
s=s.replace('background:var(--accent)','background:var(--red)')

# ---- SPA ----
rep('<a href="#region">Регион</a>','<a href="#home">Оглавление</a><a href="#region">Регион</a>')
rep('</header>','</header>\n<div id="tocbox"><div class="band" data-r="1"></div><ol class="toc" id="toc"></ol></div>')
s=s.replace('</style>',open('spa.css',encoding='utf8').read()+'</style>',1)
k=s.rindex('</script>');s=s[:k]+open('spa.js',encoding='utf8').read()+s[k:]

# ---- анимация и фото ----
s=s.replace('</style>',open('anim.css',encoding='utf8').read()+'</style>',1)
rep("el('path',{d:stitch(m,0,0,10,true),fill:'none',stroke:`var(--${m})`,'stroke-width':3.6,'stroke-linecap':'round'},v);","let n=0;for(let y=-7;y<=7;y++)for(let x=-7;x<=7;x++)if(MOTIF[m](x,y)){const px=(x+7)*10,py=(y+7)*10;el('path',{class:'st',style:`--i:${n++}`,d:`M${px+1.2} ${py+1.2}l7.6 7.6m0 -7.6l-7.6 7.6`,fill:'none',stroke:`var(--${m})`,'stroke-width':3.6,'stroke-linecap':'round'},v)}")
rep("'stroke-dasharray':'2 4','stroke-linecap':'round'},map);","'stroke-dasharray':'2 4','stroke-linecap':'round',id:'routeLine'},map);")
rep("fill:'none',stroke:'var(--red)','stroke-width':2},s);","fill:'none',stroke:'var(--red)','stroke-width':2,pathLength:1},s);")
rep("d.forEach((p,i)=>{const g=el('g',{},s);","d.forEach((p,i)=>{const g=el('g',{style:`--i:${i}`},s);")
rep("const g=el('g',{class:'pin',tabindex:0,","const g=el('g',{class:'pin',style:`--i:${i}`,tabindex:0,")
rep("g.addEventListener('click',()=>show(i));","g.addEventListener('animationend',()=>g.classList.add('done'));g.addEventListener('click',()=>show(i));")
rep("el('path',{d:'M0 3.5q4-3 8 0t8 0',fill:'none',stroke:'var(--water)','stroke-width':.8,opacity:.55},pt);","el('path',{d:'M0 3.5q4-3 8 0t8 0',fill:'none',stroke:'var(--water)','stroke-width':.8,opacity:.55},pt);if(matchMedia('(prefers-reduced-motion:no-preference)').matches){const an=el('animateTransform',{attributeName:'patternTransform',type:'translate',from:'0 0',to:'16 0',dur:'7s',repeatCount:'indefinite'},pt)}")
rep("$('#toc').insertAdjacentHTML('beforeend',`<li>","$('#toc').insertAdjacentHTML('beforeend',`<li style=\"--i:${$('#toc').children.length}\">")
rep("const ph=s.photo?`<img src=\"${s.photo}\" alt=\"${s.name}\">`:`<span>","const ph=s.photo?`<figure class=\"ph\"><img src=\"${s.photo}\" alt=\"${s.name}\"><figcaption>${s.photoBy||''}</figcaption></figure>`:`<div class=\"photo\"><span>")
rep("Добавьте свой снимок или снимок со свободной лицензией.</span>`;","Добавьте свой снимок или снимок со свободной лицензией.</span></div>`;")
rep('<div class="photo">${ph}</div>','${ph}')
import json
if os.path.exists('photos.json'):
    PH=json.load(open('photos.json',encoding='utf8'))
    for name,(uri,cred) in PH['stops'].items():
        a=f"{{name:'{name}',";assert a in s,name
        i=s.index(a);j=s.index("photo:''",i);s=s[:j]+f"photo:'{uri}',photoBy:{json.dumps(cred,ensure_ascii=False)}"+s[j+8:]
    if PH.get('hero'):
        rep('<div class="facts">','<figure class="frontis"><img src="%s" alt="%s"><figcaption>%s</figcaption></figure>\n  <div class="facts">'%tuple(PH['hero']))

# ---- живые блоки и внешние снимки ----
s=s.replace('</style>',open('live.css',encoding='utf8').read()+'</style>',1)
k=s.index('<script>')+8;s=s[:k]+open('head.js',encoding='utf8').read().replace('__PH__',open('PH.json',encoding='utf8').read())+s[k:]
rep('${ph}','${galleryHTML(i)}')
rep('<div class="facts">','<div class="slides" id="slides" aria-label="Снимки Карелии"></div>\n  <div class="facts">')
k=s.rindex('</script>');s=s[:k]+open('live.js',encoding='utf8').read()+s[k:]
s=s.replace('</style>',open('glossary.css',encoding='utf8').read()+'</style>',1)
k=s.rindex('</script>');s=s[:k]+open('glossary.js',encoding='utf8').read()+s[k:]
SKEL='<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<meta name="description" content="Интерактивный путеводитель по Карелии: камень, дерево, вода. Маршрут из 12 остановок от Ладоги до Белого моря.">\n<style>html{color-scheme:light}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
open('../index.html','w',encoding='utf8').write(SKEL+s.replace('<nav ','</head>\n<body>\n<nav ',1)+'\n</body>\n</html>\n');print('index.html',len(s)//1024,'KB')
