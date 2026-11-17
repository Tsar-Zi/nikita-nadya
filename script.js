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
if('IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}
