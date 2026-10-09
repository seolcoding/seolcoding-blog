'use strict';
const bench=window.BENCH, UI=window.BenchControls;
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const usd=(v,digits=3)=>'$'+Number(v).toFixed(digits);
const ids=['nano21','flare','sunburst'];
const short={nano21:'Nano Banana 2.1',flare:'GPT Image 2.5 Flare',sunburst:'GPT Image 2.5 Sunburst'};
const providerLogo=id=>`<img class="provider-logo ${id==='nano21'?'':'openai-logo'}" src="brand/providers/${id==='nano21'?'google':'openai'}.svg" alt="${id==='nano21'?'Google':'OpenAI'}" title="${id==='nano21'?'Google':'OpenAI'}" width="24" height="24">`;
const storeKey='cafe-image-bench-v1';
let saved={checks:{},notes:{},votes:[]};
const validReview=v=>v&&typeof v.checks==='object'&&v.checks&&!Array.isArray(v.checks)&&typeof v.notes==='object'&&v.notes&&!Array.isArray(v.notes)&&Array.isArray(v.votes);
try{const old=JSON.parse(localStorage.getItem(storeKey));if(validReview(old))saved=old;}catch(e){}
let sceneId=bench.scenes[0].id;
const scene=()=>bench.scenes.find(s=>s.id===sceneId);
const model=id=>bench.models.find(m=>m.id===id);
const result=id=>bench.results.find(r=>r.scene_id===sceneId&&r.model_id===id);
const cost=id=>bench.costs.rows.find(r=>r.id===id);
const title=s=>s.title.replace(/^\d+ · /,'');
const persist=()=>{try{localStorage.setItem(storeKey,JSON.stringify(saved));}catch(e){$('#review-status').textContent='브라우저 저장 공간을 사용할 수 없습니다. 검토를 내보내 보관하세요.';}};
function download(name,value){const u=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function imageCard(id){
 const r=result(id);const e=bench.editorial?.[sceneId];
 if(!r||r.status!=='success')return `<article class="image-result"><h3 class="model-label">${providerLogo(id)}<span>${esc(short[id])}</span></h3><p>생성 결과 없음</p></article>`;
 const note=e?.notes[id]||bench.reviews[r.id]?.note||'원본 이미지와 상세 검토를 함께 확인하세요.';
 const lowest=cost(r.id).usd===Math.min(...ids.map(i=>cost(result(i).id).usd));
 const price=lowest?`<span class="sc-mark" data-tone="value">${usd(cost(r.id).usd)}</span>`:usd(cost(r.id).usd);
 const attention=sceneId==='09_comic'||(sceneId==='07_package'&&id!=='flare');
 return `<article class="image-result" data-model="${id}"><div class="image-head"><h3 class="model-label">${providerLogo(id)}<span>${esc(short[id])}</span></h3><div class="image-price" data-usd="${cost(r.id).usd}">${price}<small>/장</small></div></div><div class="viewport" data-model="${id}" tabindex="0" role="button" aria-label="${esc(short[id])} 이미지 크게 보기" style="aspect-ratio:${scene().aspect_ratio?.replace(':','/')||'16/9'}"><img src="previews/${r.id}.webp" alt="${esc(short[id])}의 ${esc(title(scene()))}" width="${r.width}" height="${r.height}" decoding="sync"></div><div class="image-foot"><span>${r.width.toLocaleString()}×${r.height.toLocaleString()} · ${r.elapsed_seconds.toFixed(1)}초</span><div class="image-actions"><a class="download-button" href="${esc(r.path)}" download="${esc(r.id)}.${esc(r.path.split('.').pop())}">원본 다운로드</a></div></div><p class="image-note">${attention?'<strong class="note-label sc-mark" data-tone="attention">수정 필요</strong> ':''}${esc(note)}</p></article>`;
}
function viewerRecords(){return [...bench.results.filter(r=>r.scene_id===sceneId&&r.status==='success'),...(bench.legacy?.records||[]).filter(r=>r.scene_id===sceneId&&r.status==='success')].sort((a,b)=>['nano21','flare','sunburst','agy_nano2','codex_builtin'].indexOf(a.model_id)-['nano21','flare','sunburst','agy_nano2','codex_builtin'].indexOf(b.model_id)).map(r=>({...r,name:short[r.model_id]||r.display_name||r.image_model||'구모델',company:r.company||(r.model_id==='nano21'?'Google':'OpenAI'),price:cost(r.id)?usd(cost(r.id).usd):r.price_label||'비용 미확인'}));}
function openImageViewer(id=ids[0],original=false,opener=document.activeElement){UI.viewer({title:title(scene()),records:viewerRecords(),selected:id,original,opener});}
function renderImages(){
 $('#images').innerHTML=ids.map(imageCard).join('');
 UI.views((original,opener)=>openImageViewer(ids[0],original,opener));
 $('#view-hint').textContent='이미지를 누르면 큰 화면에서 전체 이미지와 원본 100%를 확인할 수 있습니다. 원본 다운로드는 축소본이 아닌 생성 파일을 저장합니다.';
 document.querySelectorAll('#images .viewport').forEach(v=>{
  v.addEventListener('click',()=>openImageViewer(v.dataset.model,false,v));
  v.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openImageViewer(v.dataset.model,false,v);}});
 });
 renderLegacy();
}
function renderLegacy(){
 const rows=(bench.legacy?.records||[]).filter(r=>r.scene_id===sceneId&&r.status==='success');
 $('#legacy-section').hidden=!rows.length;
 $('#legacy-images').innerHTML=rows.map(r=>`<article class="image-result"><h3 class="model-label"><img class="provider-logo ${r.company==='OpenAI'?'openai-logo':''}" src="brand/providers/${r.company==='Google'?'google':'openai'}.svg" alt="${esc(r.company)}"><span>${esc(r.display_name)}</span></h3><button class="legacy-preview" type="button" data-legacy-model="${esc(r.model_id)}" aria-label="${esc(r.display_name)} 이미지 크게 보기"><img src="${esc(r.preview)}" alt="${esc(r.display_name)}의 ${esc(title(scene()))}"></button><div class="image-foot"><span>${r.width.toLocaleString()}×${r.height.toLocaleString()} · ${esc(r.agent)} 내장</span><a class="download-button" href="${esc(r.path)}" download="${esc(r.id)}.${esc(r.path.split('.').pop())}">원본 다운로드</a></div><p class="image-note">${esc(r.review_note||'실제 생성 원본입니다. 해상도·도구 조건을 함께 확인하세요.')}</p><p class="fine-print"><strong>${esc(r.price_label)}</strong><br>${esc(r.price_note)}</p><details><summary>생성 조건과 원문 대조</summary><p>${esc(r.comparison_note||'내장 도구 결과이며 최신 직접 API의 품질·해상도·비용 조건과 다릅니다.')}</p><a href="${esc(r.evidence_path)}">생성 기록</a> · <a href="legacy/pricing/api_price_reference.json">공식 단가와 계산 근거</a></details></article>`).join('');
 document.querySelectorAll('[data-legacy-model]').forEach(b=>b.addEventListener('click',()=>openImageViewer(b.dataset.legacyModel,false,b)));
}
function renderReviews(){
 $('#reviews').innerHTML=ids.map(id=>{
  const r=result(id),rev=bench.reviews[r.id],ocr=bench.ocr[r.id];
  return `<article class="review-row"><h3 class="model-label">${providerLogo(id)}<span>${esc(short[id])}</span></h3><p><strong>${esc(rev?.readiness||'작성자 검토')}</strong><br>${esc(rev?.note||'')}</p><ul>${scene().checks.map((c,i)=>`<li>${rev?.passed[i]===true?'✓ 확인':rev?.passed[i]===false?'✕ 수정':'? 보류'} · ${esc(c)}</li>`).join('')}</ul>${rev?.inspection_paths?`<p>${rev.inspection_paths.map((p,i)=>`<a href="commercial/${esc(p)}" target="_blank" rel="noopener">검토 확대 ${i+1}</a>`).join(' · ')}</p>`:''}${ocr?`<details><summary>OCR 원문 대조 ${ocr.matched}/${ocr.total} 발견</summary><p>${esc(ocr.interpretation)}</p><ul>${ocr.lines.map(l=>`<li>${l.matched?'원문 발견':'눈 검토 필요'} · ${esc(l.text)}</li>`).join('')}</ul><a href="${esc(scene().ground_truth_path)}" download>검수 원문</a><p>${ocr.raw_paths.map((p,i)=>`<a href="${esc(p)}">OCR 추출 ${i+1}</a>`).join(' · ')}</p></details>`:''}<h4>내 검토</h4><div class="check-list">${scene().checks.map((c,i)=>`<label><input type="checkbox" data-check="${r.id}:${i}" ${saved.checks[r.id+':'+i]?'checked':''}>${esc(c)}</label>`).join('')}</div><textarea data-note="${r.id}" aria-label="${esc(short[id])} 검토 메모" placeholder="직접 확인한 점을 적어 주세요">${esc(saved.notes[r.id]||'')}</textarea><details><summary>정확한 모델·요청·원본 기록</summary><pre>${esc(JSON.stringify({requested_model:r.requested_model,response_model:r.response_model||'응답에 없음',config:r.requested_config,prompt_sha256:r.prompt_sha256,image_sha256:r.sha256,reference:r.reference,cost_usd_estimate:cost(r.id).usd},null,2))}</pre><a href="${esc(r.evidence_path)}">API 응답 기록</a></details></article>`;
 }).join('');
 document.querySelectorAll('[data-check]').forEach(el=>el.addEventListener('change',()=>{saved.checks[el.dataset.check]=el.checked;persist();}));
 document.querySelectorAll('[data-note]').forEach(el=>el.addEventListener('input',()=>{saved.notes[el.dataset.note]=el.value;persist();}));
 $('#votes').innerHTML=ids.map(id=>`<button data-vote="${id}">${esc(short[id])} 선호</button>`).join('')+'<button data-vote="tie">비슷해요</button><button data-vote="neither">셋 다 아쉬워요</button>';
 document.querySelectorAll('[data-vote]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.vote;const pref=ids.includes(id)?'abc'[ids.indexOf(id)]:id;saved.votes.push({scene_id:sceneId,comparison_mode:'triple',compared_model_ids:[...ids],a:ids[0],b:ids[1],c:ids[2],preference:pref,model_names_hidden:false,time:new Date().toISOString()});persist();$('#review-status').textContent='이 브라우저에 선호를 저장했습니다.';}));
}
function render(){
 const s=scene(),e=bench.editorial?.[s.id];
 $('#scene-title').textContent=title(s);$('#scene-question').textContent=s.question;
 $('#recommendation').innerHTML='<strong>이 과제에서 고른다면</strong> · '+esc(e?.recommendation||'미감과 지시 준수는 원본으로 비교해 주세요. 비용을 우선하면 Nano Banana 2.1이 가장 저렴합니다.');
 $('#prompt-summary').textContent=e?.prompt_summary||s.use_case||s.question;
 $('#prompt-text').textContent=s.prompt;$('#prompt-link').href=s.prompt_path;$('#copy-status').textContent='';
 $('#reference-info').hidden=!s.reference_path;$('#reference-info').innerHTML=s.reference_path?`<a href="${esc(s.reference_path)}" target="_blank" rel="noopener"><img src="previews/08_character_sunburst.webp" alt="세 모델에 함께 보낸 캐릭터 기준 시트" loading="lazy"></a><p>코믹·동화는 세 모델에 동일한 Sunburst 첫 캐릭터 시트를 참조로 보냈습니다. 참조의 출처가 비교에 영향을 줄 수 있습니다.</p>`:'';
 UI.scenes(bench.scenes,sceneId,id=>{sceneId=id;render();});
 renderImages();renderReviews();$('#review-status').textContent='';
}
UI.copy(async()=>{try{await navigator.clipboard.writeText(scene().prompt);$('#copy-status').textContent='공통 프롬프트 원문을 복사했습니다.';}catch(e){$('#prompt-details').open=true;$('#copy-status').textContent='클립보드를 사용할 수 없습니다. 원문을 선택하거나 내려받아 주세요.';}});
const media=matchMedia('(prefers-color-scheme: dark)');
function isDark(){return document.documentElement.dataset.theme?document.documentElement.dataset.theme==='dark':media.matches;}
function renderTheme(){UI.theme(isDark(),()=>{const theme=isDark()?'light':'dark';document.documentElement.dataset.theme=theme;try{localStorage.setItem('seolcoding-theme',theme);}catch(e){}renderTheme();});}
media.addEventListener('change',renderTheme);renderTheme();
$('#export').addEventListener('click',()=>download('cafe_bench_my_review.json',{benchmark_date:bench.date,reviewer:'사용자',...saved}));
$('#import-button').addEventListener('click',()=>$('#import-file').click());
$('#import-file').addEventListener('change',async e=>{try{const file=e.target.files[0];if(!file)return;const value=JSON.parse(await file.text());if(value.benchmark_date!==bench.date||!validReview(value))throw Error('검토 파일 형식 또는 벤치 날짜가 다릅니다.');saved={checks:value.checks,notes:value.notes,votes:value.votes};persist();renderReviews();$('#review-status').textContent='검토를 가져왔습니다.';}catch(err){$('#review-status').textContent=err.message;}e.target.value='';});
const choices=[['nano21','가격 우선 · 메뉴와 문서 초안','이번 사례에서 가장 저렴합니다. 코믹의 화자·소품 오류는 수정해야 합니다.'],['flare','빠른 상업 시안 · 메뉴와 패키지','Sunburst와 같은 생성비로 평균 대기 시간이 짧았습니다. 시안의 조판도 좋았습니다.'],['sunburst','캐릭터 기준 · 풍부한 장면','이번 캐릭터 시트와 코믹 배경에서 강점이 보였습니다. 추가 문구와 여백은 교정하세요.']];
$('#choices').innerHTML=choices.map(([id,label,note])=>{const c=bench.costs.models.find(m=>m.id===id);return `<article class="choice-row"><div><h3 class="model-label">${providerLogo(id)}<span>${esc(short[id])}</span></h3><small>${esc(label)}</small></div><p>${esc(note)}</p><div class="mean-price">${usd(c.mean_usd)}<span>장당 평균 · ${c.mean_seconds.toFixed(1)}초</span></div></article>`;}).join('');
const totals=bench.costs.totals_usd;
$('#total-cost').textContent=usd(totals.benchmark,2);
$('#saving').textContent=Math.round((1-bench.costs.models.find(m=>m.id==='nano21').mean_usd/bench.costs.models.find(m=>m.id==='flare').mean_usd)*100)+'%';
$('#cost-content').innerHTML=`<p><strong>고해상도 벤치 30장 ${usd(totals.benchmark,4)}</strong> · 그중 상업 제작 18장 ${usd(totals.commercial,4)}. 초기 Google 직접 API 테스트 2건까지 합친 측정 범위는 32건 ${usd(totals.measured_scope,4)}입니다.</p><p>2026.10.09 공식 Standard 가격 × 저장된 응답 사용량으로 계산했습니다. 실제 청구서와 대조한 금액은 아닙니다. 세금·환율·크레딧·별도 계약 할인·개발 에이전트 비용은 제외했습니다.</p><div class="table-wrap" role="region" aria-label="모델별 이미지당 가격" tabindex="0"><table><thead><tr><th>모델</th><th>장당 평균</th><th>장당 범위</th><th>평균 생성 시간</th><th>10장 합계</th></tr></thead><tbody>${ids.map(id=>{const c=bench.costs.models.find(m=>m.id===id);return `<tr><td><span class="model-label">${providerLogo(id)}<span>${esc(short[id])}</span></span></td><td>${usd(c.mean_usd,4)}</td><td>${usd(c.min_usd,4)}–${usd(c.max_usd,4)}</td><td>${c.mean_seconds.toFixed(1)}초</td><td>${usd(c.total_usd,4)}</td></tr>`;}).join('')}</tbody></table></div><p>Sunburst·Flare는 같은 토큰 단가이며 이번 과제별 사용 토큰도 같아 생성비가 같습니다. Nano의 4K 이미지 출력분 $0.1134에 입력·텍스트·추론 비용을 더한 장당 총액을 비교했습니다.</p><div class="exact-models">${ids.map(id=>{const c=bench.costs.models.find(m=>m.id===id);return `<article><h3 class="model-label">${providerLogo(id)}<span>${esc(short[id])}</span></h3><code>${esc(model(id).model)}</code><p>${esc(c.official_role)}</p><p>100만 토큰당: ${id==='nano21'?'입력 $1.50 · 텍스트·추론 출력 $7.50 · 이미지 출력 $30':'텍스트 입력 $5 · 이미지 입력 $8 · 이미지 출력 $30'}</p></article>`;}).join('')}</div><h3>전체 제작비에서 미확인인 부분</h3><p>초기 OpenAI 테스트 6건은 사용량 기록이 없어 비용을 산정하지 못했습니다. Codex·AGY 내장 도구의 이미지 생성과 조사·개발 에이전트 비용도 별도입니다. 전체 제작 총액은 현재 기록만으로 확정할 수 없습니다.</p><details><summary>요청별 비용과 사용량 ${bench.costs.rows.length}건</summary><div class="table-wrap" role="region" aria-label="요청별 비용" tabindex="0"><table><thead><tr><th>요청</th><th>산정 비용</th><th>사용 토큰</th><th>기록</th></tr></thead><tbody>${bench.costs.rows.map(r=>`<tr><td>${esc(r.id)}</td><td>${usd(r.usd,6)}</td><td>${Object.entries(r.components).map(([k,v])=>esc(k)+': '+v.tokens.toLocaleString()).join('<br>')}</td><td>${r.evidence?`<a href="${esc(r.evidence)}">응답</a>`:'초기 사용량 기록'}</td></tr>`).join('')}</tbody></table></div></details><p>가격 근거: ${bench.costs.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join(' · ')}</p>`;
$('#sources').innerHTML=bench.sources.map(s=>`<article class="source"><h3><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a></h3><p><strong>기존 방법</strong> · ${esc(s.finding)}</p><p><strong>이번 적용</strong> · ${esc(s.adoption)}</p></article>`).join('');
$('#storyboard').innerHTML=bench.scenes.filter(s=>s.group==='commercial').map((s,i)=>`<article class="story-row"><h3>${i*8}–${(i+1)*8}초 · ${esc(title(s))}</h3><p>${esc(s.narration)}</p><p>비교 질문: ${esc(s.question)}</p><div class="story-images">${ids.map(id=>{const r=bench.results.find(r=>r.scene_id===s.id&&r.model_id===id);return `<div><img src="previews/${r.id}.webp" alt="${esc(short[id])} · ${esc(title(s))}" loading="lazy"><small>${esc(short[id])}</small></div>`;}).join('')}</div></article>`).join('');
render();
