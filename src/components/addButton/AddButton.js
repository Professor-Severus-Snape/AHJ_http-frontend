import './addButton.css';

export default class AddButton {
  constructor() {
    this.addBtn = document.createElement('button');
    this.addBtn.classList.add('btn_add-ticket');
    this.addBtn.type = 'button';
    this.addBtn.textContent = 'Добавить тикет';
  }

  render(container) {
    container.append(this.addBtn);
  }

  setEvent(handler) {
    this.addBtn.addEventListener('click', handler);
  }
}
