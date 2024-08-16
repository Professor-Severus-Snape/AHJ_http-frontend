import AddButton from '../components/addButton/AddButton';
import Form from '../components/form/Form';
import Service from '../libs/Service';
import ServerConnection from '../components/serverConnection/ServerConnection';
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
    this.ticketsContainer = this.ticketsContainerFactory.getTicketsContainerElement();
  }

  async init() {
    const foundServer = await this.checkServer(); // проверка подключения к серверу

    if (!foundServer) {
      this.serverConnection = new ServerConnection();
      this.serverConnection.render(this.container);
      return;
    }

    this.render(); // первоначальная отрисовка страницы
    this.setEvents(); // посадка слушателей на кнопку создания тикета и на контейнер с тикетами
  }

  async checkServer() {
    try {
      await fetch('http://localhost:7070/');
      return true;
    } catch (e) {
      return false;
    }
  }

  render() {
    this.addBtn.render(this.container); // кнопка добавления тикета
    this.ticketsContainerFactory.render(this.container); // контейнер для тикетов
    this.renderTickets(); // все тикеты с сервера
  }

  async renderTickets() {
    const allTickets = await this.service.getTickets();

    if (allTickets.error) {
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
    this.addBtn.setClickEvent(this.onAddBtnClick.bind(this));
    this.ticketsContainerFactory.setClickEvent(this.onTicketClick.bind(this));
  }

  onAddBtnClick() {
    this.form = new Form();
    this.form.createTicketForm(); // отрисовываем форму создания нового тикета

    this.onAddTicket = this.onAddTicket.bind(this);
    this.form.setSubmitEvent(this.onAddTicket); // вешаем событие 'submit' на форму
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

    this.form.onFormClose(); // удаление обработчиков с формы и самой формы из DOM
  }

  async onTicketClick(event) {
    const { target } = event;

    this.clickedTicket = target.closest('.ticket'); // тикет, на который кликнули
    this.id = this.clickedTicket.dataset.id; // id текущего тикета

    if (target.classList.contains('ticket__btn_status')) {
      const clickedTicketData = await this.service.getTicketById(this.id); // данные текущего тикета
      const { status } = clickedTicketData; // изначальный статус текущего тикета
      await this.service.updateStatusById(this.id, status); // обновление статуса тикета на сервере
      target.classList.toggle('done'); // переключение галочки (класс 'done')
    } else if (target.classList.contains('ticket__btn_update')) {
      const clickedTicketData = await this.service.getTicketById(this.id); // данные текущего тикета
      const { name, description } = clickedTicketData; // изначальные имя и описание текущего тикета
      this.form = new Form();
      this.form.changeTicketForm(name, description); // отрисовываем форму редактирования тикета
      this.onUpdateTicket = this.onUpdateTicket.bind(this); // привязываем контекст
      this.form.setSubmitEvent(this.onUpdateTicket); // вешаем 'submit' на форму
    } else if (target.classList.contains('ticket__btn_delete')) {
      this.form = new Form();
      this.form.removeTicketForm(); // отрисовываем форму удаления тикета
      this.onDeleteTicket = this.onDeleteTicket.bind(this); // привязываем контекст
      this.form.setSubmitEvent(this.onDeleteTicket); // вешаем 'submit' на форму
    } else {
      this.clickedTicket.querySelector('.ticket__full-description').classList.toggle('hidden');
    }
  }

  async onUpdateTicket(event) {
    event.preventDefault(); // событие 'submit' на форме

    const name = this.form.getTicketName(); // новое имя тикета
    const description = this.form.getTicketDescription(); // новое описание тикета

    if (!name) {
      return; // если имя тикета пустое, ничего не делаем
    }

    await this.service.updateTextById(this.id, name, description); // меняем текст тикета на сервере
    const newTicketData = await this.service.getTicketById(this.id); // все данные текущего тикета
    const { created, status } = newTicketData;
    const newTicket = new Ticket(name, created, status, description, this.id); // создание тикета
    this.clickedTicket.after(newTicket.getTicketElement()); // добавление нового узла-тикета в DOM
    this.clickedTicket.remove(); // удаление старого узла-тикета из DOM

    this.form.onFormClose(); // удаление обработчиков с формы и формы из DOM
  }

  async onDeleteTicket(event) {
    event.preventDefault(); // событие 'submit' на форме

    await this.service.deleteTicketById(this.id); // удаление тикета на сервере
    this.clickedTicket.remove(); // удаление узла-тикета из DOM

    this.form.onFormClose(); // удаление обработчиков с формы и формы из DOM
  }
}
