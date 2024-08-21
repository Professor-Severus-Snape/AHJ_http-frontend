import createRequest from './createRequest';

export default class Service {
  // проверка подключения к серверу:
  static async pingServer() {
    const options = {
      method: 'GET',
      url: 'method=checkServer',
    };

    const data = await createRequest(options);
    return data; // { error: false, status: 204 } || { error: true, status: 520 }
  }

  // получение с сервера всех тикетов:
  static async getTickets() {
    const options = {
      method: 'GET',
      url: 'method=allTickets',
    };

    const data = await createRequest(options); // [{...}, {...}, ...]
    return data;
  }

  // получение данных тикета по id:
  static async getTicketById(id) {
    const options = {
      method: 'GET',
      url: `method=ticketById&id=${id}`,
    };

    const data = await createRequest(options); // { name, created, status, description, id }
    return data;
  }

  // создание тикета на сервере:
  static async createTicket(name = '', description = '') {
    const options = {
      method: 'POST',
      url: 'method=createTicket',
      body: {
        name,
        description,
        status: false,
      },
    };

    const data = await createRequest(options); // { name, created, status, description, id }
    return data;
  }

  // изменение статуса тикета на сервере:
  static async updateStatusById(id, status) {
    const options = {
      method: 'POST',
      url: `method=updateById&id=${id}`,
      body: {
        status: !status,
      },
    };

    const data = await createRequest(options); // [{...}, {...}, ...]
    return data;
  }

  // изменение имени и описания тикета на сервере:
  static async updateTextById(id, name, description) {
    const options = {
      method: 'POST',
      url: `method=updateById&id=${id}`,
      body: {
        name,
        description,
      },
    };

    const data = await createRequest(options); // [{...}, {...}, ...]
    return data;
  }

  // удаление тикета на сервере (ничего не возвращает):
  static async deleteTicketById(id) {
    const options = {
      method: 'GET',
      url: `method=deleteById&id=${id}`,
    };

    const data = await createRequest(options); // { error: false, status: response.status }
    return data;
  }
}
