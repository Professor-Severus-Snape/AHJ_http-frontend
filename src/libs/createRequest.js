export default async function createRequest(options) {
  const baseUrl = 'http://localhost:7070/?';
  const { method, url, body } = options;

  const response = await fetch(baseUrl + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body), // NB! при GET-запросе получим 'undefined'
  });

  if (response.ok) {
    const data = await response.json(); // сразу присылает данные обратно!
    return data;
  }

  return { error: true, status: response.status };
}
