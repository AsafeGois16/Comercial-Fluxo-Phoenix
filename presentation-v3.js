/* PHOENIX PROPOSTAS 360 · Motor editorial V0.3 · 7 seções
 * Incremento não destrutivo sobre o piloto 0.2. Mantém processamento local.
 * Nenhuma informação de cobertura ou de seguradora é fabricada automaticamente.
 */
(function(){
'use strict';
const P={
 'Saúde':{item:'VIDAS / BENEFICIÁRIOS',extra:'IDADE',line:'Mensalidade por vida',defaultPeriod:'mensal',plural:'beneficiários',focus:'rede credenciada, acomodação, abrangência, coparticipação, reembolso e carências',heading:'Assistência médica e proteção à saúde',hint:'Cada linha representa uma vida. Informe o preço dessa vida em cada plano.'},
 'Odontológico':{item:'VIDAS / BENEFICIÁRIOS',extra:'IDADE',line:'Mensalidade por vida',defaultPeriod:'mensal',plural:'beneficiários',focus:'rede odontológica, procedimentos, abrangência, carências e condições',heading:'Cuidado odontológico para pessoas e empresas',hint:'Cada linha representa uma vida. Informe a mensalidade individual de cada opção.'},
 'Vida':{item:'PESSOA / GRUPO SEGURADO',extra:'IDADE',line:'Prêmio por segurado',defaultPeriod:'mensal',plural:'segurados',focus:'capital segurado, garantias, assistência e exclusões',heading:'Proteção financeira para pessoas',hint:'Informe o prêmio por segurado em cada opção. Descreva o capital e as coberturas no campo técnico.'},
 'Automóvel':{item:'VEÍCULO / IDENTIFICAÇÃO',extra:'ANO',line:'Prêmio por veículo',defaultPeriod:'anual',plural:'veículos',focus:'casco, franquia, terceiros, assistências e parcelamento',heading:'Proteção para veículos',hint:'Cada linha é um veículo. O valor é o prêmio completo referente ao veículo no período escolhido.'},
 'Frota':{item:'VEÍCULO / IDENTIFICAÇÃO',extra:'ANO',line:'Prêmio por veículo',defaultPeriod:'anual',plural:'veículos',focus:'coberturas, franquias, assistência, uso e condições de frota',heading:'Gestão e proteção de frotas',hint:'Cada linha é um veículo e seu prêmio. Não multiplique novamente por uma quantidade.'},
 'Empresarial':{item:'ITEM / RISCO SEGURADO',extra:'QTD.',line:'Prêmio por item',defaultPeriod:'anual',plural:'itens segurados',focus:'riscos cobertos, limites de indenização, franquias e exclusões',heading:'Proteção ao patrimônio empresarial',hint:'Informe o prêmio total da opção ou os prêmios por item apenas quando separados pela seguradora. Quantidade é informativa.'},
 'Residencial':{item:'ITEM / BEM SEGURADO',extra:'QTD.',line:'Prêmio por item',defaultPeriod:'anual',plural:'itens segurados',focus:'coberturas patrimoniais, limites, franquias e assistências',heading:'Cuidado e proteção patrimonial',hint:'Informe o prêmio total da opção ou os prêmios por item apenas quando separados pela seguradora. Quantidade é informativa.'},
 'Outros':{item:'ITEM / OBJETO SEGURADO',extra:'QTD.',line:'Prêmio por item',defaultPeriod:'anual',plural:'itens',focus:'coberturas, condições financeiras, vigência e franquias',heading:'Soluções de proteção personalizadas',hint:'Descreva os itens e informe valores efetivamente cotados, sem rateios presumidos.'}
};
const editor={
 about:'A Phoenix Insurance atua com consultoria em seguros e benefícios para pessoas e empresas. Nosso trabalho une escuta, comparação cuidadosa de alternativas e acompanhamento em cada etapa da contratação.',
 aboutTagline:'Proteção com inteligência. Atendimento com proximidade.',
 summary:'',
 characteristics:'',
 differentials:{},
 documents:'',
 conditions:'',
 validity:'',
 contact:'(11) 94007-8833',
 email:'atendimento@phoenixseg.com.br',
 touched:{}
};
let currentProduct='Saúde';
let previousReaderNote='';
const EL=id=>document.getElementById(id);
const safe=v=>escapeHtml(v);
const dateLong=()=>new Date().toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'});
const fmt=n=>n===null||n===undefined?'—':BRL.format(n/100);
const lines=v=>String(v||'').split(/\n/).map(x=>x.trim()).filter(Boolean);
const profile=()=>P[EL('product')?.value]||P.Outros;
const period=()=>EL('v3period')?.value||profile().defaultPeriod;
const periodText=()=>period()==='mensal'?'mensal':period()==='anual'?'anual':'único';
const perLabel=()=>period()==='mensal'?'MENSAL':period()==='anual'?'ANUAL':'DO PERÍODO';
const periodNotes=()=>period()==='mensal'?'Projeção de 12 meses, mantidas as mesmas condições e sem antecipar reajustes.':period()==='anual'?'Valores cotados para o período anual indicado.':'Valores informados como prêmio único; não há projeção de 12 meses.';
const get=key=>EL('v3'+key)?.value ?? editor[key];
function pageHead(index,label){return '<div class="v3-doc-top"><div class="v3-brand"><img src="logo.svg" alt=""><div><strong>PHOENIX</strong><small>INSURANCE</small></div></div><div><span>PHOENIX PROPOSTAS 360</span><small>'+safe(label)+'</small></div></div><div class="v3-top-line"></div>'}
function pageFoot(num,label){return '<div class="v3-doc-footer"><span>PHOENIX INSURANCE <i>·</i> '+safe(label)+'</span><span>'+num+' / 07</span></div>'}
function nudgeTag(n,heading){return '<div class="v3-doc-nudge"><span>'+n+'</span><div class="v3-nudge-line"></div><b>'+safe(heading)+'</b></div>'}
function backgroundOrbs(){return '<div class="v3-orb v3-orb-a"></div><div class="v3-orb v3-orb-b"></div><div class="v3-orb v3-orb-c"></div>'}
const oldCompute=compute;
compute=function(){
  const calc=oldCompute();
  return calc.map(c=>({...c,annual:c.total===null?null:(period()==='mensal'?c.total*12:period()==='anual'?c.total:null)}));
};
const oldRenderTable=renderTable;
renderTable=function(){oldRenderTable();decorateComparison()};
function decorateComparison(){
  const c=profile(),tbl=EL('compareTable');
  if(!tbl)return;
  const header=tbl.querySelectorAll('thead tr:first-child th');
  if(header[0])header[0].childNodes[0].nodeValue=c.item;
  if(header[1])header[1].childNodes[0].nodeValue=c.extra;
  tbl.querySelectorAll('input[data-field="age"]').forEach(el=>{
    el.setAttribute('aria-label',c.extra+' do item');
    if(c.extra==='ANO'){el.min='1900';el.max='2100';el.placeholder='2024'}else if(c.extra==='IDADE'){el.min='0';el.max='120';el.placeholder='—'}else{el.min='0';el.max='120';el.placeholder='1'}
  });
  tbl.querySelectorAll('input[data-field="name"]').forEach(el=>el.placeholder=c.extra==='ANO'?'Modelo / identificação':c.extra==='QTD.'?'Risco ou item':'Nome completo');
  const trs=tbl.querySelectorAll('tfoot tr');
  if(trs[0])trs[0].querySelector('td').textContent='SUBTOTAL '+perLabel();
  if(trs[1])trs[1].querySelector('td').textContent='IOF (se aplicável)';
  if(trs[2])trs[2].querySelector('td').textContent='TOTAL '+perLabel();
  if(trs[3])trs[3].querySelector('td').textContent=period()==='mensal'?'PROJEÇÃO 12 MESES*':period()==='anual'?'PRÊMIO ANUAL*':'SEM PROJEÇÃO ANUAL';
  const hint=EL('v3financeHint');if(hint)hint.textContent=c.hint;
}
renderSummary=function(){
  const c=compute(),valid=c.map((x,i)=>({...x,i})).filter(x=>x.valid),lowest=valid.length?valid.reduce((a,b)=>a.total<=b.total?a:b):null;
  const baseline=c[0]?.total??null;
  const diff=lowest&&baseline!==null?baseline-lowest.total:null;
  const compareText=diff===null?'—':fmt(diff);
  const third=period()==='mensal'?(diff===null?'—':fmt(diff*12)):period()==='anual'?(diff===null?'—':fmt(diff)):'—';
  EL('kpis').innerHTML='<div class="kpi gold"><span>Menor total '+perLabel().toLowerCase()+'</span><strong>'+(lowest?fmt(lowest.total):'—')+'</strong><small>'+(lowest?safe(state.plans[lowest.i].name):'Preencha os valores de todas as linhas')+'</small></div><div class="kpi"><span>Diferença versus a referência</span><strong>'+compareText+'</strong><small>Comparação apenas de preço, sem recomendação de cobertura</small></div><div class="kpi"><span>'+(period()==='mensal'?'Diferença projetada em 12 meses*':period()==='anual'?'Diferença anual':'Projeção não aplicável')+'</span><strong>'+third+'</strong><small>'+safe(periodNotes())+'</small></div>';
};
function mount(){
  if(EL('v3editor'))return;
  const top=EL('apresentacao');
  if(!top)return;
  const holder=document.createElement('div');
  holder.id='v3editor';
  holder.innerHTML='<div class="v3-section-header"><div class="eyebrow dark">03 / CONTEÚDO EDITORIAL</div><h2>Personalização da apresentação</h2><p>As sete seções serão geradas automaticamente. Revise os textos e só inclua benefícios confirmados pela seguradora.</p></div>'+
  '<div class="v3-editor-grid">'+
  '<section class="v3-card"><div class="v3-card-head"><span>02</span><div><h3>Sobre a Phoenix</h3><small>Mensagem institucional e posicionamento</small></div></div><label>Apresentação institucional<textarea id="v3about" maxlength="1200" rows="4"></textarea></label><label>Chamada principal<input id="v3aboutTagline" maxlength="100"></label></section>'+
  '<section class="v3-card"><div class="v3-card-head"><span>04</span><div><h3>Descrição do produto</h3><small>Características, coberturas e condições</small></div></div><label>Resumo do produto<textarea id="v3summary" maxlength="1800" rows="4"></textarea></label><label>Informações técnicas confirmadas<textarea id="v3characteristics" maxlength="1800" rows="3" placeholder="Ex.: abrangência, acomodação, capital segurado, franquia, coberturas, parcelamento..."></textarea></label></section>'+
  '<section class="v3-card"><div class="v3-card-head"><span>05</span><div><h3>Diferenciais das seguradoras</h3><small>Uma descrição para cada opção comparada</small></div></div><div id="v3differentialEditors"></div></section>'+
  '<section class="v3-card"><div class="v3-card-head"><span>06</span><div><h3>Documentação e condições</h3><small>Checklist a confirmar com cada seguradora</small></div></div><label>Documentos para contratação (um por linha)<textarea id="v3documents" maxlength="2500" rows="4" placeholder="Ex.: Documento de identificação dos proponentes (conforme cotação)&#10;Formulário exigido pela seguradora..."></textarea></label><label>Validade da cotação<input id="v3validity" type="date"></label><label>Condições e observações<textarea id="v3conditions" maxlength="1400" rows="3"></textarea></label></section>'+
  '<section class="v3-card v3-card-contact"><div class="v3-card-head"><span>07</span><div><h3>Contracapa e contatos</h3><small>Confirme os dados da corretora</small></div></div><div class="v3-two"><label>Telefone / WhatsApp<input id="v3contact"></label><label>E-mail institucional<input id="v3email" type="email"></label></div></section>'+
  '</div><p class="v3-guard">A estrutura visual é automática, mas coberturas, diferenciais, regras e documentação devem vir de documentos válidos ou informações confirmadas pelo consultor. O piloto ainda não executa agentes de IA generativa.</p>';
  top.parentNode.insertBefore(holder,top);
  const rate=EL('iof').parentNode.parentNode;
  rate.insertAdjacentHTML('afterbegin','<label class="v3-period-picker">Período <select id="v3period"><option value="mensal">Mensal</option><option value="anual">Anual</option><option value="unico">Único</option></select></label>');
  const financeHint=document.createElement('p');financeHint.id='v3financeHint';financeHint.className='v3-finance-hint';EL('compareTable').closest('.table-scroller').before(financeHint);
  EL('v3about').value=editor.about;EL('v3aboutTagline').value=editor.aboutTagline;EL('v3contact').value=editor.contact;EL('v3email').value=editor.email;
  for(const key of ['about','aboutTagline','summary','characteristics','documents','validity','conditions','contact','email']){
    const e=EL('v3'+key);e.addEventListener('input',()=>{editor[key]=e.value;editor.touched[key]=true;renderPreview()})
  }
  EL('v3period').value=profile().defaultPeriod;
  EL('v3period').addEventListener('change',()=>renderAll());
  EL('product').addEventListener('change',()=>{currentProduct=EL('product').value;EL('v3period').value=profile().defaultPeriod;setDefaultProductText();renderAll()});
  EL('btnAddPlan').addEventListener('click',()=>renderDifferentials());
  EL('compareTable').addEventListener('change',e=>{if(e.target.dataset.field==='planName')renderDifferentials()});
  setDefaultProductText();
  renderDifferentials();
  decorateComparison();
  renderAll();
}
function setDefaultProductText(){
  const p=profile();
  if(!editor.touched.summary){editor.summary='A proposta contempla uma análise das alternativas de '+EL('product').value.toLowerCase()+'. Os custos constam do comparativo financeiro e as condições efetivas devem ser conferidas nos documentos da seguradora.';EL('v3summary').value=editor.summary}
  if(!editor.touched.characteristics){editor.characteristics='Pontos de avaliação: '+p.focus+'. As características específicas, coberturas, limites e exclusões dependem do produto efetivamente cotado.';EL('v3characteristics').value=editor.characteristics}
  if(!editor.touched.documents){editor.documents='Documentação necessária: validar com a seguradora de cada opção cotada.\nFormulários, declarações, comprovações e documentos adicionais: conforme requisitos de contratação.';EL('v3documents').value=editor.documents}
  if(!editor.touched.conditions){editor.conditions='Valores, aceitação e vigência sujeitos às regras, aos documentos e à análise da respectiva seguradora. Este documento não substitui a apólice nem constitui garantia de cobertura.';EL('v3conditions').value=editor.conditions}
}
function renderDifferentials(){
  const list=EL('v3differentialEditors');if(!list)return;
  list.innerHTML=state.plans.map((p,i)=>'<div class="v3-diff"><div><b>'+safe(p.name)+'</b><span>Opção '+(i+1)+'</span></div><textarea rows="3" maxlength="600" data-diff="'+safe(p.id)+'" placeholder="Informe somente diferenciais verificados: assistências, programas, coberturas adicionais, facilidades...">'+safe(editor.differentials[p.id]||'')+'</textarea></div>').join('');
  list.querySelectorAll('textarea').forEach(el=>el.addEventListener('input',()=>{editor.differentials[el.dataset.diff]=el.value;renderPreview()}))
}
function splitText(t,max){
  const str=String(t||'').trim();if(!str)return [''];
  const chunks=[];let buffer='';
  for(const para of str.split(/\n+/)){
    const words=para.split(/\s+/);for(const w of words){if((buffer+' '+w).trim().length>max&&buffer){chunks.push(buffer.trim());buffer=''}buffer+=(buffer?' ':'')+w}
    if(buffer)buffer+='\n';
  }
  if(buffer.trim())chunks.push(buffer.trim());return chunks.length?chunks:[''];
}
const para=t=>safe(t).replace(/\n/g,'<br>');
function premiumCover(){
  const client=EL('client').value.trim()||'Cliente a identificar',consultor=EL('consultor').value.trim()||'A informar';
  return '<article class="paper v3-cover">'+backgroundOrbs()+'<img class="v3-cover-symbol" src="logo.svg" alt=""><div class="v3-cover-main"><div class="v3-cover-brand"><img src="logo.svg" alt=""><div><strong>PHOENIX</strong><span>INSURANCE</span></div></div><div class="v3-gold-rule"></div><div class="v3-cover-kicker">CONSULTORIA EM SEGUROS E BENEFÍCIOS</div><h1>Proposta<br>Comercial<span class="v3-dot">.</span></h1><div class="v3-cover-product">'+safe(EL('product').value)+'</div><p>Uma apresentação preparada para facilitar escolhas com clareza, estratégia e cuidado.</p></div><div class="v3-cover-footer"><div><small>PREPARADA PARA</small><strong>'+safe(client)+'</strong></div><div><small>CONSULTOR RESPONSÁVEL</small><strong>'+safe(consultor)+'</strong></div><div><small>DATA DE ELABORAÇÃO</small><strong>'+dateLong()+'</strong></div></div><div class="v3-cover-rule"></div></article>';
}
function aboutPhoenix(){
  return '<article class="paper v3-about">'+pageHead('02','A CORRETORA')+'<div class="v3-main-text"><div class="v3-big-num">02<span> / 07</span></div>'+nudgeTag('NOSSA ESSÊNCIA','PHOENIX INSURANCE')+'<h2>Seguros se escolhem<br>com <em>confiança.</em></h2><p class="v3-about-lead">'+para(get('about'))+'</p><div class="v3-about-panel"><div class="v3-about-mark"><img src="logo.svg" alt=""></div><div><span>O QUE NOS MOVE</span><h3>'+safe(get('aboutTagline'))+'</h3><p>Cuidamos da apresentação das opções para que o cliente conheça as condições relevantes antes de decidir.</p></div></div><div class="v3-three-values"><div><span class="v3-icon">◎</span><strong>Proximidade</strong><small>Atendimento consultivo</small></div><div><span class="v3-icon">◇</span><strong>Transparência</strong><small>Informações organizadas</small></div><div><span class="v3-icon">↗</span><strong>Direcionamento</strong><small>Comparação fundamentada</small></div></div></div>'+pageFoot('02','QUEM SOMOS')+'</article>';
}
function financeData(){
  const calc=compute(),c=profile(),ref=calc[0]?.total??null,valid=calc.map((x,i)=>({...x,i})).filter(x=>x.valid);
  const best=valid.length?valid.reduce((a,b)=>a.total<=b.total?a:b):null,delta=best&&ref!==null?ref-best.total:null;
  return {calc,c,ref,best,delta};
}
function financePages(){
  const {calc,c,best,delta}=financeData(),lives=state.lives,plans=state.plans,per=period();
  const limit=11,sets=[];for(let i=0;i<Math.max(lives.length,1);i+=limit)sets.push(lives.slice(i,i+limit));
  return sets.map((set,j)=>{
    const last=j===sets.length-1,headers='<thead><tr><th rowspan="2" class="v3-col-name">'+safe(c.item)+'</th><th rowspan="2">'+safe(c.extra)+'</th>'+plans.map((p,i)=>'<th class="'+(i===0?'v3-current-col':'v3-option-col')+'">'+safe(p.name)+'</th>').join('')+'</tr><tr class="v3-product-row">'+plans.map(p=>'<th>'+safe(p.product)+'</th>').join('')+'</tr></thead>';
    const body='<tbody>'+set.map((life,x)=>'<tr><td>'+safe(life.name||c.item.split('/')[0]+' '+(j*limit+x+1))+'</td><td>'+safe(life.age||'—')+'</td>'+plans.map((p,i)=>'<td>'+fmt(moneyCents(life.values[i]))+'</td>').join('')+'</tr>').join('')+'</tbody>';
    const totals=last?'<tfoot>'+[['SUBTOTAL '+perLabel(),'subtotal'],['IOF (SE APLICÁVEL)','tax'],['TOTAL '+perLabel(),'total'],[per==='mensal'?'PROJEÇÃO 12 MESES*':per==='anual'?'TOTAL ANUAL*':'SEM PROJEÇÃO ANUAL','annual']].map(([label,key])=>'<tr class="'+(key==='total'?'v3-total':'')+'"><td colspan="2">'+label+'</td>'+calc.map(x=>'<td>'+fmt(x[key])+'</td>').join('')+'</tr>').join('')+'</tfoot>':'';
    const num=String(j+1).padStart(2,'0');
    const overview=last?'<div class="v3-calc-highlights"><div><span>MENOR VALOR '+perLabel()+'</span><b>'+(best?fmt(best.total):'—')+'</b><small>'+(best?safe(plans[best.i].name):'Dados incompletos')+'</small></div><div><span>DIFERENÇA VERSUS REFERÊNCIA</span><b>'+(delta!==null?fmt(delta):'—')+'</b><small>Comparação exclusivamente de preço</small></div></div>':'';
    return '<article class="paper v3-finance">'+pageHead('03','COMPARATIVO '+perLabel())+'<div class="v3-finance-content">'+nudgeTag('03','COMPARATIVO PERSONALIZADO')+'<h2>Comparativo<br><em>Financeiro</em></h2><div class="v3-caption-line"><p>'+safe(EL('client').value.trim()||'Cliente a identificar')+' · '+safe(EL('product').value)+'</p><span>'+set.length+' '+safe(c.plural)+' nesta página</span></div><div class="v3-table-wrap"><table class="v3-pdf-table">'+headers+body+totals+'</table></div>'+overview+'<div class="v3-doc-warning"><b>Nota de conferência.</b> '+safe(c.hint)+' Valores extraídos ou informados estão sujeitos à documentação e à vigência da cotação. '+safe(periodNotes())+'</div>'+(sets.length>1?'<p class="v3-continued">Detalhamento '+num+' de '+sets.length+'</p>':'')+'</div>'+pageFoot('03','COMPARATIVO FINANCEIRO')+'</article>';
  }).join('');
}
function productPages(){
  const pieces=splitText(get('summary'),680),features=splitText(get('characteristics'),780);
  const count=Math.max(pieces.length,features.length);
  let html='';
  for(let i=0;i<count;i++){
    html+='<article class="paper v3-product">'+pageHead('04','O PRODUTO')+'<div class="v3-regular-body">'+nudgeTag('04','ENTENDA A SOLUÇÃO')+'<h2>'+safe(profile().heading)+'</h2><div class="v3-section-accent"><span>'+safe(EL('product').value)+'</span><b>PRODUTO EM ANÁLISE</b></div><div class="v3-editorial-block"><span>VISÃO GERAL</span><p>'+para(pieces[i]||'Continuação da descrição principal nas páginas anteriores.')+'</p></div><div class="v3-editorial-block v3-featured"><span>CONDIÇÕES E CARACTERÍSTICAS</span><p>'+para(features[i]||'Conferir dados técnicos da cotação válida.')+'</p></div><div class="v3-editorial-footnote"><strong>Para uma decisão fundamentada</strong><p>Consulte a documentação oficial de cada proposta. Itens não informados não devem ser presumidos como incluídos ou excluídos.</p></div></div>'+pageFoot('04','DESCRIÇÃO DO PRODUTO')+'</article>';
  }
  return html;
}
function insurerPages(){
  const opts=state.plans;
  const groups=[];for(let i=0;i<opts.length;i+=2)groups.push(opts.slice(i,i+2));
  return groups.map((group,k)=>{
    const cards=group.map((p,index)=>{const diff=editor.differentials[p.id]||'';return '<div class="v3-insurer-card"><div class="v3-insurer-num">'+String(k*2+index+1).padStart(2,'0')+'</div><div class="v3-insurer-content"><span>OPÇÃO COMERCIAL</span><h3>'+safe(p.name)+'</h3><small>'+safe(p.product)+'</small><p>'+(diff?para(diff):'<i>Os diferenciais específicos desta opção ainda não foram confirmados no material enviado. Preencha esta seção com informações verificadas na cotação ou em documento oficial da seguradora.</i>')+'</p></div></div>'}).join('');
    return '<article class="paper v3-insurers">'+pageHead('05','SEGURADORAS')+'<div class="v3-regular-body">'+nudgeTag('05','BENEFÍCIOS COMPROVADOS')+'<h2>O que diferencia<br>cada <em>opção.</em></h2><p class="v3-lead">Além do preço, é importante avaliar as condições e os serviços que fazem sentido para suas necessidades.</p><div class="v3-insurer-grid">'+cards+'</div><div class="v3-insurers-bottom"><b>Critérios de comparação</b><p>'+safe(profile().focus)+'. Os diferenciais dependem do produto efetivamente contratado e deverão ser confirmados nos documentos da seguradora.</p></div></div>'+pageFoot('05','DIFERENCIAIS')+'</article>';
  }).join('');
}
function documentationPages(){
  const docs=lines(get('documents'));if(!docs.length)docs.push('Conferir os documentos exigidos pela seguradora para a contratação.');
  const sets=[];for(let i=0;i<docs.length;i+=10)sets.push(docs.slice(i,i+10));
  return sets.map((group,k)=>{
    const checklist=group.map((d,i)=>'<div class="v3-doc-item"><div class="v3-check-box"></div><div><b>'+String(k*10+i+1).padStart(2,'0')+'</b><span>'+safe(d.replace(/^[-•]\s*/,''))+'</span></div></div>').join('');
    const extra=k===sets.length-1?'<div class="v3-terms"><span>VALIDADE DA COTAÇÃO</span><strong>'+safe(get('validity')?new Date(get('validity')+'T12:00:00').toLocaleDateString('pt-BR'):'A confirmar nos documentos')+'</strong></div><div class="v3-terms"><span>CONDIÇÕES IMPORTANTES</span><p>'+para(get('conditions'))+'</p></div>':'';
    return '<article class="paper v3-documents">'+pageHead('06','DOCUMENTAÇÃO')+'<div class="v3-regular-body">'+nudgeTag('06','DOCUMENTOS PARA CONTRATAÇÃO')+'<h2>Próximos passos,<br><em>sem dúvidas.</em></h2><p class="v3-lead">Esta relação é um checklist de apoio e deverá ser conferida com os requisitos atualizados de cada seguradora.</p><div class="v3-doc-list">'+checklist+'</div>'+extra+'</div>'+pageFoot('06','DOCUMENTAÇÃO')+'</article>';
  }).join('');
}
function closing(){
  const consultant=EL('consultor').value.trim()||'Equipe Phoenix';
  return '<article class="paper v3-close">'+backgroundOrbs()+'<div class="v3-close-upper"><div class="v3-cover-brand"><img src="logo.svg" alt=""><div><strong>PHOENIX</strong><span>INSURANCE</span></div></div><span class="v3-close-kicker">UMA PARCERIA QUE COMEÇA COM CONFIANÇA</span><h2>Obrigado<br>pela <em>confiança.</em></h2><p>A Phoenix Insurance agradece a oportunidade de apresentar estas alternativas de proteção. Conte conosco para esclarecer as condições e apoiar os próximos passos.</p></div><div class="v3-close-bottom"><div class="v3-close-line"></div><span>FALE COM A NOSSA EQUIPE</span><h3>'+safe(consultant)+'</h3><p>WhatsApp: '+safe(get('contact'))+'</p><p>E-mail: '+safe(get('email'))+'</p><div class="v3-close-banner">PROTEGEMOS O QUE É IMPORTANTE PARA VOCÊ.</div><div class="v3-finish">PHOENIX INSURANCE <b>·</b> PROPOSTAS 360</div></div></article>';
}
proposalPages=function(){return premiumCover()+aboutPhoenix()+financePages()+productPages()+insurerPages()+documentationPages()+closing()};
renderPreview=function(){
  const html=proposalPages();
  const holder=document.createElement('div');holder.innerHTML=html;
  EL('proposalPreview').innerHTML=Array.from(holder.children).map(page=>'<div class="v3-preview-frame"><div class="v3-mini-inner">'+page.outerHTML+'</div></div>').join('');
  EL('printRoot').innerHTML=html;
};
document.addEventListener('DOMContentLoaded',mount);
})();