import createRequest from '../libs/createRequest';
import Form from './Form';
import Ticket from './Ticket';

export default class App {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.tickets = []; // NOTE: для упрощения работы с тикетами (надо ли ???)
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
        name, description, status, created,
      } = element;
      const ticket = new Ticket(name, created, status, description);
      this.ticketsList.append(ticket.ticket);
      this.tickets.push(element); // NOTE: надо ли ???
    });
  }

  addListeners() {
    this.addBtn.addEventListener('click', this.onAddBtnClick.bind(this));
  }

  onAddBtnClick() {
    this.form = new Form();
    this.form.createTicket();
    this.onAddTicket = this.onAddTicket.bind(this);
    this.form.form.addEventListener('submit', this.onAddTicket);
  }

  async onAddTicket(e) {
    e.preventDefault();

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
      name, created, status, description,
    } = element; // деструктуризация объекта-тикета
    const ticket = new Ticket(name, created, status, description); // создание узла-тикета
    this.ticketsList.append(ticket.ticket); // добавление узла-тикета в DOM
    this.tickets.push(element); // NOTE: надо ли ???
    this.form.form.removeEventListener('submit', this.onAddTicket); // удаление обработчика с формы
    this.form.removeForm(); // удаление формы из DOM
  }
}
