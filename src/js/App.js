import createRequest from '../libs/createRequest';
import Form from './Form';
import TicketService from './TicketService';

// NOTE: временно (до налаживания связи с сервером):
let tickets = [
  {
    id: crypto.randomUUID(),
    name: 'Поменять краску в принтере, ком. 404',
    description: 'Принтер HP LJ-1210, картриджи на складе',
    status: false,
    created: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Переустановить Windows, PC-Hall24',
    description: '',
    status: false,
    created: Date.now(),
  },
  {
    id: crypto.randomUUID(),
    name: 'Установить обновление KB-31642dv3875',
    description: 'Вышло критическое обновление для Windows',
    status: true,
    created: Date.now(),
  },
];

export default class App {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    
    this.ticketService = new TicketService();
  }

  init() {
    this.render();
    // в зависимости от ситуации сделать разное наполнение формы и передать нужный заголовок:
    // this.form = new Form();

    // NOTE: попытка обратиться к серверу:
    this.request();
  }

  render() {
    // отрисовка кнопки добавления тикета:
    this.renderAddBtn();

    // отрисовка контейнера для тикетов:
    this.renderTicketsList();

    // отрисовка всех имеющихся тикетов:
    for (let i = 0; i < tickets.length; i += 1) {
      const ticket = this.renderTickets(
        tickets[i].name,
        tickets[i].created,
        tickets[i].status,
        tickets[i].description);
      this.ticketsList.append(ticket);
    }
  }

  // TODO: вынести в отдельный компонент кнопку:
  renderAddBtn() {
    this.addBtn = document.createElement('button');
    this.addBtn.classList.add('btn_add-ticket');
    this.addBtn.type = 'button';
    this.addBtn.textContent = 'Добавить тикет';
    this.container.append(this.addBtn);
  }

  // NOTE: по идее тоже можно отдельным компонентом сделать..
  renderTicketsList() {
    this.ticketsList = document.createElement('ul');
    this.ticketsList.classList.add('tickets');
    this.container.append(this.ticketsList);
  }

  // TODO: вынести в отдельный компонент (в Ticket или в TicketView - ???)
  renderTickets(name, created, status, description) {
    const ticket = document.createElement('li');
    ticket.classList.add('tickets__item', 'ticket');

    const content = document.createElement('div');
    content.classList.add('ticket__content');

    const btnStatus = document.createElement('div');
    btnStatus.classList.add('ticket__btn', 'ticket__btn_status');
    if (status) {
      btnStatus.classList.add('done');
    } else {
      btnStatus.classList.remove('done');
    }

    const shortDescription = document.createElement('p');
    shortDescription.classList.add('ticket__short-description');
    shortDescription.textContent = name;

    const date = document.createElement('time');
    date.classList.add('ticket__date');
    date.dateTime = created;
    date.textContent = created;

    const btnUpdate = document.createElement('div');
    btnUpdate.classList.add('ticket__btn', 'ticket__btn_update');

    const btnDelete = document.createElement('div');
    btnDelete.classList.add('ticket__btn', 'ticket__btn_delete');

    content.append(btnStatus, shortDescription, date, btnUpdate, btnDelete);

    const fullDescription = document.createElement('p');
    fullDescription.classList.add('ticket__full-description');
    fullDescription.textContent = description;

    ticket.append(content, fullDescription);

    return ticket;
  }

  // NOTE: обращение к серверу (асинхронно!!!):
  async request() {
    const options = {
      url: 'method=createTicket', // нужный кусок url-а
      method: 'POST', // нужный метод
      body: { // при GET-запросе body не отправляем!
        name: 'Поменять краску в принтере, ком. 40400000000',
        description: 'Принтер HP LJ-1210, картриджи на складе 0000000000'
      },
    };

    const dataRequest = await createRequest(options);

    if (!dataRequest.error) {
      console.log('dataRequest: ', dataRequest);
    }
  }

}
