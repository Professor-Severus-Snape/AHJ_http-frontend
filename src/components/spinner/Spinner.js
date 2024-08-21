import './spinner.css';
import spinner from '../../img/spinner.svg';

export default class Spinner {
  constructor() {
    this.element = document.createElement('img');
    this.element.classList = 'spinner';
    this.element.alt = 'preloader';
    this.element.src = spinner;
  }

  render(container) {
    this.container = container;
    this.container.append(this.element);
  }

  removeSpinner() {
    this.element.remove();
  }
}
