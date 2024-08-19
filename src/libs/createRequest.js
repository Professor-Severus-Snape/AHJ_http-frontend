export default async function createRequest(options) {
  const baseUrl = 'http://localhost:7070/?'; // TODO: менять при деплое на Render !!!
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
      // удаление тикетов:
      if (response.status === 204) {
        return { error: false, status: response.status };
      }

      return await response.json(); // сразу присылает данные обратно!
    }

    // FIXME: как лучше обработать удачную проверку подключения к серверу - что вернуть???:
    // FIXME: как избавиться от ошибки 404 в консоли ???
    if (url === '' && response.status === 404) {
      return { error: false, status: 200 };
    }

    return { error: true, status: response.status };
  } catch (err) {
    // console.log(err.name, err.message); // TODO: проверить ошибку на Render!!!
    return { error: true, status: 520 };
  }
}
