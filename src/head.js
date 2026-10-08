
/* ---------- снимки: файлы лежат рядом со страницей в photos/ ---------- */
const PH=__PH__;
const pic=id=>`photos/${id}.jpg`,pics=id=>`photos/s/${id}.jpg`;
const credit=id=>{const p=PH[id];return `${p.c}. Фото: ${p.a}, ${p.l}, <a href="${p.u}" target="_blank" rel="noopener">Викисклад</a>`};
const GAL=[['01-valaam-1','s-valaam2-1','s-valaam2-2','01-valaam-3'],['s-sortavala2-1','s-sortavala2-2','02-sortavala-2'],['03-ruskeala-2','s-ruskeala2-3','s-ruskeala2-1'],['04-kinerma-1','04-kinerma-3','04-kinerma-2','s-kinerma2-1'],['s-petro1-3','s-petro2-1','s-petro1-2','h-pg-petro-2'],['06-kizhi-1','s-kizhi2-1','s-kizhi2-3','c-kizhi-house-1'],['07-kondopoga-1','s-kondopoga3-3','s-kondopoga3-2','e-hes-2'],['08-marcial-1','08-marcial-2','s-marcial2-2','s-marcial2-1'],['09-kivach-1','s-kivach2-3','h-pg-kivach-1'],['10-povenets-3','s-povenets-3','10-povenets-1','h-bbk-1'],['s-belomorsk-1','11-petroglyphs-1','11-petroglyphs-3'],['12-kem-3','12-kem-1','s-kem2-2','h-pg-kem-2']];
function galleryHTML(i){const g=GAL[i];return `<figure class="ph"><img class="lb" data-id="${g[0]}" data-grp="${g.join()}" src="${pic(g[0])}" alt="${PH[g[0]].c}"><figcaption>${credit(g[0])}</figcaption></figure>
  <div class="thumbs" role="group" aria-label="Другие снимки">${g.map((id,k)=>`<button class="th" data-id="${id}" aria-pressed="${k===0}" aria-label="${PH[id].c}"><img src="${pics(id)}" alt="" loading="lazy"></button>`).join('')}</div>`}
