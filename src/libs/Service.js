import createRequest from './createRequest';

export default class Service {
  // получение с сервера всех тикетов:
  async getTickets() {
    const options = {
      method: 'GET',
      url: 'method=allTickets',
    };

    const data = await createRequest(options); // [{...}, {...}, ...]
    return data;
  }

  // получение тикета по id:
  async getTicketById(id) {
    const options = {
      method: 'GET',
      url: `method=ticketById&id=${id}`,
    };

    const data = await createRequest(options); // { name, created, status, description, id }
    return data;
  }

  // создание тикета на сервере:
  async createTicket(name = '', description = '') {
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
  async updateStatusById(id, status) {
    const options = {
      method: 'POST',
      url: `method=updateById&id=${id}`,
      body: {
        status: !status,
      },
    };

    await createRequest(options); // [{...}, {...}, ...]
  }

  // изменение имени и описания тикета на сервере:
  async updateTextById(id, name, description) {
    const options = {
      method: 'POST',
      url: `method=updateById&id=${id}`,
      body: {
        name,
        description,
      },
    };

    await createRequest(options); // [{...}, {...}, ...]
  }

  // удаление тикета на сервере (ничего не возвращает):
  async deleteTicketById(id) {
    const options = {
      method: 'GET',
      url: `method=deleteById&id=${id}`,
    };

    await createRequest(options); // undefined
  }
}
