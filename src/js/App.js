import AddButton from '../components/addButton/AddButton';
import Form from '../components/form/Form';
import Service from '../libs/Service';
import ServerConnection from '../components/serverConnection/ServerConnection';
import Spinner from '../components/spinner/Spinner';
import Ticket from '../components/ticket/Ticket';
import TicketsContainer from '../components/ticketContainer/TicketsContainer';

export default class App {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }

    this.container = container;
    this.addBtn = new AddButton();
    this.spinner = new Spinner();
    this.ticketsContainerFactory = new TicketsContainer();
    this.ticketsContainer = this.ticketsContainerFactory.getTicketsContainerElement();
  }

  async init() {
    this.spinner.render(this.container); // ожидание первого ответа от сервера...
    const server = await Service.pingServer(); // проверка подключения к серверу
    this.spinner.removeSpinner(); // убираем спиннер после получения ответа от сервера

    // обработка ошибки подключения к серверу:
    if (server.status === 520) {
      this.serverConnection = new ServerConnection();
      this.serverConnection.render(this.container);
      return;
    }

    this.render(); // первоначальная отрисовка страницы
    this.setEvents(); // посадка слушателей на кнопку создания тикета и на контейнер с тикетами
  }

  render() {
    this.addBtn.render(this.container); // кнопка добавления тикета
    this.ticketsContainerFactory.render(this.container); // контейнер для тикетов
    this.renderTickets(); // все тикеты с сервера
  }

  async renderTickets() {
    const allTickets = await Service.getTickets();

    // обработка ошибки запроса:
    if (!allTickets.error) {
      allTickets.forEach((obj) => {
        const {
          id, name, description, status, created,
        } = obj;

        const ticket = new Ticket(name, created, status, description, id);
        ticket.render(this.ticketsContainer);
      });
    }
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
      return; // если имя тикета пустое, ничего не делаем
    }

    const ticketObjInfo = await Service.createTicket(name, description);

    // обработка ошибки запроса:
    if (!ticketObjInfo.error) {
      const { id, created, status } = ticketObjInfo;
      const ticket = new Ticket(name, created, status, description, id); // создание узла-тикета
      ticket.render(this.ticketsContainer); // отрисовка нового узла-тикета в DOM
    }

    this.form.onFormClose(); // удаление обработчиков с формы и самой формы из DOM
  }

  async onTicketClick(event) {
    const { target } = event;

    this.clickedTicket = target.closest('.ticket'); // тикет, на который кликнули
    this.id = this.clickedTicket.dataset.id; // id текущего тикета

    if (target.classList.contains('ticket__btn_status')) {
      const clickedTicketData = await Service.getTicketById(this.id); // данные текущего тикета
      // обработка ошибки запроса:
      if (!clickedTicketData.error) {
        const { status } = clickedTicketData; // изначальный статус текущего тикета
        const data = await Service.updateStatusById(this.id, status); // обновление на сервере
        // обработка ошибки запроса:
        if (!data.error) {
          target.classList.toggle('done'); // переключение галочки (класс 'done')
        }
      }
    } else if (target.classList.contains('ticket__btn_update')) {
      const clickedTicketData = await Service.getTicketById(this.id); // данные текущего тикета
      // обработка ошибки запроса:
      if (!clickedTicketData.error) {
        const { name, description } = clickedTicketData; // изначальные имя и описание тикета
        this.form = new Form();
        this.form.changeTicketForm(name, description); // отрисовываем форму редактирования тикета
        this.onUpdateTicket = this.onUpdateTicket.bind(this); // привязываем контекст
        this.form.setSubmitEvent(this.onUpdateTicket); // вешаем 'submit' на форму
      }
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

    const data = await Service.updateTextById(this.id, name, description); // меняем на сервере

    // обработка ошибки запроса:
    if (!data.error) {
      const newTicketData = await Service.getTicketById(this.id); // все данные текущего тикета

      // обработка ошибки запроса:
      if (!newTicketData.error) {
        const { created, status } = newTicketData;
        const newTicket = new Ticket(name, created, status, description, this.id); // создаем тикет
        this.clickedTicket.after(newTicket.getTicketElement()); // добавляем новый узел-тикет в DOM
        this.clickedTicket.remove(); // удаление старого узла-тикета из DOM
      }
    }

    this.form.onFormClose(); // удаление обработчиков с формы и формы из DOM
  }

  async onDeleteTicket(event) {
    event.preventDefault(); // событие 'submit' на форме

    const data = await Service.deleteTicketById(this.id); // удаление тикета на сервере

    // обработка ошибки запроса:
    if (!data.error && data.status === 204) {
      this.clickedTicket.remove(); // удаление узла-тикета из DOM
    }

    this.form.onFormClose(); // удаление обработчиков с формы и формы из DOM
  }
}
