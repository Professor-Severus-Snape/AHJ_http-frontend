export default class Ticket {
  constructor(name, created, status, description = '') {
    this.ticket = document.createElement('li');
    this.ticket.classList.add('tickets__item', 'ticket');

    this.content = document.createElement('div');
    this.content.classList.add('ticket__content');

    this.btnStatus = document.createElement('div');
    this.btnStatus.classList.add('ticket__btn', 'ticket__btn_status');
    if (status) {
      this.btnStatus.classList.add('done');
    }

    this.name = document.createElement('p');
    this.name.classList.add('ticket__short-description');
    this.name.textContent = name;

    this.created = document.createElement('time');
    this.created.classList.add('ticket__date');
    this.created.dateTime = created; // TODO: преобразовать timestamp
    this.created.textContent = created; // TODO: преобразовать timestamp

    this.btnUpdate = document.createElement('div');
    this.btnUpdate.classList.add('ticket__btn', 'ticket__btn_update');

    this.btnDelete = document.createElement('div');
    this.btnDelete.classList.add('ticket__btn', 'ticket__btn_delete');

    this.content.append(this.btnStatus, this.name, this.created, this.btnUpdate, this.btnDelete);

    this.description = document.createElement('p');
    this.description.classList.add('ticket__full-description');
    this.description.textContent = description;

    this.ticket.append(this.content, this.description);
  }
}
