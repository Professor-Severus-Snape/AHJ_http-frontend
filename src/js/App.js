import AddButton from '../components/addButton/AddButton';
import Form from '../components/form/Form';
import Service from '../libs/Service';
import Ticket from '../components/ticket/Ticket';
import TicketsContainer from '../components/ticketContainer/TicketsContainer';

export default class App {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }

    this.container = container;
    this.addBtn = new AddButton();
    this.service = new Service();
    this.ticketsContainerFactory = new TicketsContainer();
    this.ticketsContainer = this.ticketsContainerFactory.container;
  }

  init() {
    this.render(); // первоначальная отрисовка страницы
    this.setEvents(); // посадка слушателей на кнопку создания тикета и на контейнер с тикетами
  }

  render() {
    this.addBtn.render(this.container); // кнопка добавления тикета
    this.ticketsContainerFactory.render(this.container); // контейнер для тикетов
    this.renderTickets(); // все тикеты с сервера
  }

  async renderTickets() {
    const allTickets = await this.service.getTickets();

    if (allTickets.error) {
      // eslint-disable-next-line no-console
      console.error(
        'Ошибка при получении данных от сервера: ',
        allTickets.status,
      );
      return;
    }

    allTickets.forEach((obj) => {
      const {
        id, name, description, status, created,
      } = obj;

      const ticket = new Ticket(name, created, status, description, id);
      ticket.render(this.ticketsContainer);
    });
  }

  setEvents() {
    this.addBtn.setEvent(this.onAddBtnClick.bind(this));
    this.ticketsContainerFactory.setEvent(this.onTicketClick.bind(this));
  }

  onAddBtnClick() {
    this.form = new Form();
    this.form.createTicketForm(); // отрисовываем форму создания нового тикета

    this.onAddTicket = this.onAddTicket.bind(this);
    this.form.setEvent(this.onAddTicket); // вешаем событие 'submit' на форму
  }

  async onAddTicket(event) {
    event.preventDefault(); // событие 'submit' на форме

    const name = this.form.getTicketName();
    const description = this.form.getTicketDescription();

    if (!name) {
      // если имя тикета пустое, ничего не делаем
      return;
    }

    const ticketObjInfo = await this.service.createTicket(name, description);

    const { id, created, status } = ticketObjInfo;

    const ticket = new Ticket(name, created, status, description, id); // создание узла-тикета
    ticket.render(this.ticketsContainer); // отрисовка нового узла-тикета в DOM

    this.form.onFormClose(this.onAddTicket); // удаление обработчиков с формы и самой формы из DOM
  }

  async onTicketClick(event) {
    const { target } = event;
    const { id } = target.closest('.ticket').dataset; // id текущего тикета

    if (target.classList.contains('ticket__btn_status')) {
      const currentTicket = await this.service.getTicketById(id); // все данные текущего тикета
      const { status } = currentTicket; // изначальный статус текущего тикета
      await this.service.updateStatusById(id, status); // обновление статуса тикета на сервере
      target.classList.toggle('done'); // переключение галочки (класс 'done')
    } else if (target.classList.contains('ticket__btn_update')) {
      const currentTicket = await this.service.getTicketById(id); // все данные текущего тикета
      const { name, description } = currentTicket; // изначальные имя и описание текущего тикета
      this.form = new Form();
      this.form.changeTicket(name, description); // отрисовываем форму редактирования тикета
      this.onUpdateTicket = this.onUpdateTicket.bind(this, id); // передаем id в качестве аргумента
      this.form.setEvent(this.onUpdateTicket); // вешаем событие 'submit' на форму
    } else if (target.classList.contains('ticket__btn_delete')) {
      this.form = new Form();
      this.form.removeTicket(); // отрисовываем форму удаления тикета
      this.onDeleteTicket = this.onDeleteTicket.bind(this, id); // передаем id в качестве аргумента
      this.form.setEvent(this.onDeleteTicket); // вешаем событие 'submit' на форму
    } else if (target.closest('.ticket')) {
      target
        .closest('.ticket')
        .querySelector('.ticket__full-description')
        .classList.toggle('hidden');
    }
  }

  // FIXME: на 2-ом изменении вызывается method: 'allTickets',
  // страница перезагружается, а id = undefined ...
  async onUpdateTicket(id, event) {
    event.preventDefault(); // событие 'submit' на форме

    const name = this.form.getTicketName(); // новое имя тикета
    const description = this.form.getTicketDescription(); // новое описание тикета

    if (!name) {
      // если имя тикета пустое, ничего не делаем
      return;
    }

    await this.service.updateTextById(id, name, description); // обновляем имя и описание на сервере

    const newTicketData = await this.service.getTicketById(id); // { name, created, status, ... }
    const { created, status } = newTicketData;

    const oldTicket = this.ticketsContainer.querySelector(`[data-id="${id}"]`); // старый тикет
    const newTicket = new Ticket(name, created, status, description, id); // создание нового тикета
    oldTicket.after(newTicket.getTicketElement()); // добавление нового узла-тикета в DOM
    oldTicket.remove(); // удаление старого узла-тикета из DOM

    this.form.onFormClose(this.onUpdateTicket); // удаление обработчиков с формы и формы из DOM
  }

  // FIXME: на 2-ом изменении вызывается method: 'allTickets',
  // страница перезагружается, а id = undefined ...
  async onDeleteTicket(id, event) {
    event.preventDefault();

    await this.service.deleteTicketById(id); // удаление тикета на сервере

    const ticketToRemove = this.ticketsContainer.querySelector(
      `[data-id="${id}"]`,
    );
    ticketToRemove.remove(); // удаление узла-тикета из DOM

    this.form.onFormClose(this.onDeleteTicket); // удаление обработчиков с формы и формы из DOM
  }
}
