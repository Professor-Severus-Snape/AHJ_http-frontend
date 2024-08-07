import TicketService from './TicketService';

/**
 *  Основной класс приложения
 * */
export default class App {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.ticketService = new TicketService();
  }

  init() {}
}
