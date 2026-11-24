const params = new URLSearchParams(location.search);
// Ссылка ?to=Дорогие Александр и Мария! задаёт полное обращение.
const greeting = params.get('to');
if (greeting && greeting.trim().length <= 180) document.querySelector('#greeting').textContent = greeting.trim();
const days = document.querySelector('#days');
for(let n=0;n<4;n++) days.append(document.createElement('span'));
for(let n=1;n<=31;n++){const cell=document.createElement('span');cell.textContent=n;if(n===16){cell.className='selected';cell.setAttribute('aria-label','16 января — день свадьбы')}days.append(cell)}
const url=window.WEDDING_CONFIG?.rsvpUrl;
if(url && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url)){
 const frame=document.createElement('iframe');frame.title='Анкета подтверждения присутствия';frame.src=url;document.querySelector('#form-host').replaceChildren(frame);
}else{document.querySelector('#preview-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#form-status').textContent='Ответ не отправлен: приём анкет ещё не подключён. Свяжитесь с Никитой и Надеждой.'})}


// Сворачиваем рабочую анкету только после подтверждённого сохранения.
window.addEventListener("message", event => {
 const frame=document.querySelector("#form-host iframe");
 if (!frame || event.source !== frame.contentWindow || event.data?.type !== "wedding-rsvp-saved") return;
 const details=document.querySelector(".rsvp-details");
 details.open=false;
 details.querySelector("summary").textContent="Ответ сохранён. Изменить ответ";
 details.querySelector("summary").focus();
});

const preview=document.querySelector('#preview-form');
if(preview){
 const group=preview.querySelector('#additional-guests'),list=preview.querySelector('#guest-list'),add=preview.querySelector('#add-guest');
 preview.addEventListener('change',()=>{group.hidden=preview.elements.attend.value!=='Да, с радостью';list.querySelectorAll('input').forEach(i=>i.disabled=group.hidden)});
 add.addEventListener('click',()=>{if(list.children.length>=12)return;const row=document.createElement('label');row.className='guest-row';const input=document.createElement('input');input.name='guests';input.placeholder='Имя и фамилия';input.maxLength=150;input.required=true;input.setAttribute('aria-label','Имя и фамилия дополнительного гостя');const remove=document.createElement('button');remove.type='button';remove.textContent='Удалить';remove.addEventListener('click',()=>{row.remove();add.disabled=false});row.append(input,remove);list.append(row);add.disabled=list.children.length>=12;input.focus()});
}

// SVG-сердечко: настоящий контур, который можно прорисовать.
const selectedDay=document.querySelector('.days .selected');
if(selectedDay){
 const ns='http://www.w3.org/2000/svg';
 const heart=document.createElementNS(ns,'svg');
 heart.setAttribute('viewBox','0 0 60 54');
 heart.setAttribute('class','date-heart');
 heart.setAttribute('aria-hidden','true');
 const path=document.createElementNS(ns,'path');
 path.setAttribute('d','M30 49C23 42 4 30 4 17C4 2 23 0 30 14C38 0 56 3 56 17C56 30 38 44 30 49Z');
 path.setAttribute('pathLength','1');
 heart.append(path);selectedDay.append(heart);
}
const motionAllowed=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(motionAllowed && 'IntersectionObserver' in window){
 const targets=[...document.querySelectorAll('.reveal,.verse-photo')];
 document.documentElement.classList.add('motion-ready');
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   entry.target.classList.add('visible');
   observer.unobserve(entry.target);
  }
 },{threshold:0.12});
 targets.forEach(el=>observer.observe(el));
 // Фотография и имена появляются последовательно при открытии.
 document.documentElement.classList.add('hero-motion');
}
