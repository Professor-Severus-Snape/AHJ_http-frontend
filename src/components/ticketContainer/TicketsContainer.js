export default class TicketsContainer {
  constructor() {
    this.ticketsContainer = document.createElement('ul');
    this.ticketsContainer.classList.add('tickets');
    // чтобы текст тикета не выделялся:
    this.ticketsContainer.addEventListener('mousedown', (event) => event.preventDefault());
  }

  get container() {
    return this.ticketsContainer;
  }

  render(container) {
    container.append(this.ticketsContainer);
  }

  setEvent(handler) {
    this.ticketsContainer.addEventListener('click', handler);
  }
}
