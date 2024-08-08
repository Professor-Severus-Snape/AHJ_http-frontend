export default async function createRequest(options = {}) {
  const baseUrl = 'http://localhost:7070/?';
  const { url, method, body } = options;
  // body - объект со свойствами name и description
  // url - 'method=createTicket' || 'method=ticketById&id=<id>'

  // const responsePost = await fetch(`${baseUrl}method=createTicket`, {
  const responsePost = await fetch(baseUrl + url, {
    method, // method: 'GET' || 'POST'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body), // при GET-запросе получим 'undefined'
  });

  console.log('responsePost: ', responsePost);

  if (responsePost.ok) {
    const dataPost = await responsePost.json(); // сразу присылает ответ обратно!
    console.log('dataPost: ', dataPost); // сразу можно запихнуть в массив себе..
    return dataPost;
  } 
  return { error: true, status: responsePost.status };

  // NOTE: POST-запрос:
  // const responsePost = await fetch('http://localhost:7070/?method=createTicket', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     name: 'Имя', // мои данные
  //   }),
  // });

  // console.log('responsePost: ', responsePost);

  // if (responsePost.ok) {
  //   const dataPost = await responsePost.json(); // сразу присылает ответ обратно!
  //   console.log('dataPost: ', dataPost); // можно запихнуть в массив себе..
  // }

  // NOTE: GET-запрос:
  // получаем ответ от сервера (поля: type, url, redirected, ok, statusText и т.д.):
  // const responseGet = await fetch('http://localhost:7070/?method=allTickets');
  // console.log('responseGet: ', responseGet);

  // if (responseGet.ok) {
  //   const data = await responseGet.json();
  //   console.log('data: ', data);
  // }
};
