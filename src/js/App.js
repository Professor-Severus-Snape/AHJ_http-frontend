import createRequest from '../libs/createRequest';
import Form from './Form';
import Ticket from './Ticket';

export default class App {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
  }

  init() {
    this.render();
  }

  // первоначальная отрисовка страницы:
  render() {
    this.renderAddBtn(); // кнопка добавления тикета
    this.renderTicketsList(); // контейнер для тикетов
    this.renderTickets(); // полученные с сервера тикеты
    this.addListeners(); // посадка слушателей
  }

  // TODO: вынести в отдельный компонент:
  renderAddBtn() {
    this.addBtn = document.createElement('button');
    this.addBtn.classList.add('btn_add-ticket');
    this.addBtn.type = 'button';
    this.addBtn.textContent = 'Добавить тикет';
    this.container.append(this.addBtn);
  }

  // TODO: вынести в отдельный компонент:
  renderTicketsList() {
    this.ticketsList = document.createElement('ul');
    this.ticketsList.classList.add('tickets');
    this.container.append(this.ticketsList);
  }

  async renderTickets() {
    const options = { url: 'method=allTickets', method: 'GET' };
    const allTickets = await createRequest(options); // массив объектов-тикетов

    if (allTickets.error) {
      console.error('Ошибка: ', allTickets.status);
      return;
    }

    allTickets.forEach((element) => {
      const {
        id, name, description, status, created,
      } = element;
      const ticket = new Ticket(id, name, created, status, description);
      this.ticketsList.append(ticket.ticket);
    });
  }

  addListeners() {
    this.addBtn.addEventListener('click', this.onAddBtnClick.bind(this));
    this.ticketsList.addEventListener('click', this.onTicketClick.bind(this));
  }

  onAddBtnClick() {
    this.form = new Form();
    this.form.createTicket();
    this.onCreateTicket = this.onCreateTicket.bind(this);
    this.form.form.addEventListener('submit', this.onCreateTicket);
  }

  async onCreateTicket(event) {
    console.log('Событие добавления тикета'); // NOTE: отладка
    event.preventDefault();

    const options = {
      method: 'POST',
      url: 'method=createTicket',
      body: {
        name: this.form.getTicketName(),
        description: this.form.getTicketDescription(),
        status: false,
      },
    };

    const element = await createRequest(options); // POST-запрос на сервер (сразу возвращает данные)
    const {
      id, name, created, status, description,
    } = element; // деструктуризация объекта-тикета
    const ticket = new Ticket(id, name, created, status, description); // создание узла-тикета
    this.ticketsList.append(ticket.ticket); // добавление узла-тикета в DOM

    this.form.form.removeEventListener('submit', this.onCreateTicket); // удаление обработчика с формы
    this.form.removeForm(); // удаление формы из DOM
  }

  async onTicketClick(event) {
    const { target } = event;

    if (target.classList.contains('ticket__btn_status')) {
      console.log('нужно сменить статус'); // NOTE: отладка
      // обновить тикет на сервере, переключить класс 'done'
      const { id } = target.closest('.ticket').dataset; // id текущего тикета
      const currentTicket = await this.getTicketById(id);
      const { status } = currentTicket;
      await this.updateStatus(id, status);
      target.classList.toggle('done');
    } else if (target.classList.contains('ticket__btn_update')) {
      console.log('нужно отредактировать тикет'); // NOTE: отладка
      // создать форму, обновить тикет на сервере, изменить отображение тикета
      const { id } = target.closest('.ticket').dataset; // id текущего тикета
      const currentTicket = await this.getTicketById(id);
      const { name, description } = currentTicket;

      this.form = new Form();
      this.form.changeTicket(name, description);

      this.onUpdateTicketById = this.onUpdateTicketById.bind(this, id); // передаем id в качестве аргумента
      this.form.form.addEventListener('submit', this.onUpdateTicketById);
    } else if (target.classList.contains('ticket__btn_delete')) {
      console.log('нужно удалить тикет'); // NOTE: отладка
      // создать форму, удалить тикет на сервере, удалить тикет из DOM
      this.form = new Form();
      this.form.removeTicket();
      const { id } = target.closest('.ticket').dataset; // id текущего тикета
      this.onDeleteTicketById = this.onDeleteTicketById.bind(this, id); // передаем id в качестве аргумента
      this.form.form.addEventListener('submit', this.onDeleteTicketById);
    } else if (target.closest('.ticket')) {
      console.log('нужно показать/скрыть подробное описание тикета'); // NOTE: отладка
      // переключить класс hidden у узла с подробным описанием
      target.closest('.ticket').querySelector('.ticket__full-description').classList.toggle('hidden');
    }
  }

  async updateStatus(id, status) {
    const options = {
      method: 'POST',
      url: `method=updateById&id=${id}`,
      body: {
        status: !status,
      },
    };

    await createRequest(options);
  }

  async getTicketById(id) {
    const options = {
      method: 'GET',
      url: `method=ticketById&id=${id}`,
    };

    const ticket = await createRequest(options);
    return ticket;
  }

  // FIXME: на втором изменении страница почему-то перезагружается, а id = undefined ...
  async onUpdateTicketById(id, event) {
    console.log('Событие изменения тикета'); // NOTE: отладка
    event.preventDefault();

    console.log('id: ', id); // NOTE: отладка

    const options = {
      method: 'POST',
      url: `method=updateById&id=${id}`,
      body: {
        name: this.form.getTicketName(),
        description: this.form.getTicketDescription(),
      },
    };

    await createRequest(options);

    const oldTicket = this.ticketsList.querySelector(`[data-id="${id}"]`);
    const obj = await this.getTicketById(id);
    console.log('obj: ', obj);
    const {
      name, created, status, description,
    } = obj;
    const newTicket = new Ticket(id, name, created, status, description); // создание узла-тикета
    oldTicket.after(newTicket.ticket); // добавление узла-тикета в DOM
    oldTicket.remove();

    this.form.form.removeEventListener('submit', this.onUpdateTicketById); // удаление обработчика с формы
    this.form.removeForm(); // удаление формы из DOM
  }

  // FIXME: на втором удалении страница почему-то перезагружается, а id = undefined ...
  async onDeleteTicketById(id, event) {
    console.log('Событие удаления тикета'); // NOTE: отладка
    event.preventDefault();

    console.log('id: ', id); // NOTE: отладка

    const options = {
      method: 'GET',
      url: `method=deleteById&id=${id}`,
    };

    await createRequest(options);

    // const ticket = [...this.ticketsList.children].find((ticket) => ticket.dataset.id === id);
    const ticket = this.ticketsList.querySelector(`[data-id="${id}"]`);
    // console.log('ticket: ', ticket);
    ticket.remove(); // удаление узла-тикета из DOM

    this.form.form.removeEventListener('submit', this.onDeleteTicketById); // удаление обработчика с формы
    this.form.removeForm(); // удаление формы из DOM
  }
}
