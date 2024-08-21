export default async function createRequest(options) {
  // const baseUrl = 'http://localhost:7070/?'; // локальный сервер
  const baseUrl = 'https://ahj-http-backend-82lw.onrender.com/?'; // деплой на render.com

  const { method, url, body } = options;

  try {
    const response = await fetch(baseUrl + url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body), // NB! при GET-запросе получим 'undefined'
    });

    if (response.ok) {
      // проверка подключения к серверу и удаление тикетов:
      if (response.status === 204) {
        return { error: false, status: response.status };
      }

      return await response.json(); // сразу присылает данные обратно!
    }

    return { error: true, status: response.status };
  } catch (err) {
    return { error: true, status: 520 };
  }
}
