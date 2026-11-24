function doGet() {
  return HtmlService.createHtmlOutputFromFile('Form').setTitle('Анкета гостя').setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function submitRsvp(data) {
  if (!data || !['Да, с радостью','К сожалению, не смогу'].includes(data.attend)) throw new Error('Выберите ответ о присутствии.');
  if (!Array.isArray(data.guests) || data.guests.length > 12 || data.guests.some(g => typeof g !== 'string' || !g.trim() || g.length > 150)) throw new Error('Проверьте дополнительных гостей.');
  data.attendance = data.attend === 'Да, с радостью' ? 'Да' : 'Нет';
  data.companion = data.attendance === 'Да' ? data.guests.join('; ') : '';

  if (!data || typeof data.name !== 'string' || !data.name.trim() || data.name.length > 150 || !['Да','Нет'].includes(data.attendance)) throw new Error('Проверьте имя и ответ о присутствии.');
  if (String(data.companion || '').length > 150 || String(data.comment || '').length > 1000) throw new Error('Слишком длинный ответ.');
  if (data.website) throw new Error('Не удалось принять ответ.');
  const p = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  let sheet, row;
  try {
    sheet = SpreadsheetApp.openById(p.getProperty('SHEET_ID')).getSheetByName('Ответы');
    if (!sheet) throw new Error('Таблица ещё не настроена.');
    // Предотвращаем выполнение пользовательского текста как формул.
    const safe = s => /^[=+@\-]/.test(String(s || '')) ? "'" + s : String(s || '');
    sheet.appendRow([new Date(), safe(data.name.trim()), data.attendance, safe(data.companion), safe(data.comment), 'Ожидает']);
    row = sheet.getLastRow();
  } finally { lock.releaseLock(); }
  // Ответ сохранён независимо от доступности Telegram.
  try {
    const token = p.getProperty('BOT_TOKEN'), chat = p.getProperty('CHAT_ID');
    if (!token || !chat) throw new Error('Бот не настроен');
    const result = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/sendMessage', {method:'post',contentType:'application/json',payload:JSON.stringify({chat_id:chat,text:'Новый ответ на приглашение\n\nИмя: '+data.name+'\nПрисутствие: '+data.attendance+'\nДополнительные гости: '+(data.companion||'—')+'\nКомментарий: '+(data.comment||'—')}),muteHttpExceptions:true});
    if (!JSON.parse(result.getContentText()).ok) throw new Error('Telegram не принял уведомление');
    sheet.getRange(row,6).setValue('Отправлено');
  } catch (_) { sheet.getRange(row,6).setValue('Не отправлено — проверьте настройки бота'); }
  return {ok:true};
}
function setup() {
  const id=PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const book=SpreadsheetApp.openById(id);
  const sheet=book.getSheetByName('Ответы')||book.insertSheet('Ответы');
  if(!sheet.getLastRow()) sheet.appendRow(['Дата ответа','Имя','Присутствие','Дополнительные гости','Комментарий','Уведомление Telegram']);
  sheet.setFrozenRows(1);
}
