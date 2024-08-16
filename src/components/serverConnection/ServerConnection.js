import './serverConnection.css';

export default class ServerConnection {
  constructor() {
    this.message = document.createElement('div');
    this.message.classList.add('server-connection');
    this.message.textContent = 'Сервер "http://localhost:7070" не найден';
  }

  render(container) {
    this.container = container;
    this.container.append(this.message);
  }
}
