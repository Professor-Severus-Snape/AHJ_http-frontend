export default class Form {
  constructor() {
    this.form = document.createElement('form');
    this.form.classList.add('form');
    document.body.append(this.form);
  }

  createTicket(name = '', description = '') {
    this.renderTitle('Добавить тикет');
    this.renderShortFieldset(name);
    this.renderFullFieldset(description);
    this.renderBtnsFieldset();
    // TODO: как перенести обработчики события формы из app.js ???
  }

  changeTicket(name = '', description = '') {
    this.renderTitle('Изменить тикет');
    this.renderShortFieldset(name);
    this.renderFullFieldset(description);
    this.renderBtnsFieldset();
    // TODO: как перенести обработчики события формы из app.js ???
  }

  removeTicket() {
    this.renderTitle('Удалить тикет');
    this.renderQuestion();
    this.renderBtnsFieldset();
    // TODO: как перенести обработчики события формы из app.js ???
  }

  getTicketName() {
    return this.shortInput.value;
  }

  getTicketDescription() {
    return this.fullTextarea.value;
  }

  removeForm() {
    this.form.remove();
  }

  renderTitle(title) {
    this.title = document.createElement('h3');
    this.title.classList.add('form__title');
    this.title.textContent = title;

    this.form.append(this.title);
  }

  renderQuestion() {
    this.question = document.createElement('p');
    this.question.classList.add('form__text');
    this.question.textContent = 'Вы уверены, что хотите удалить тикет? Это действие необратимо.';

    this.form.append(this.question);
  }

  renderShortFieldset(name) {
    this.shortFieldset = document.createElement('fieldset');
    this.shortFieldset.classList.add('form__fieldset', 'form__fieldset_short-description');

    this.shortLabel = document.createElement('label');
    this.shortLabel.classList.add('form__label', 'form__label_short');
    this.shortLabel.for = 'short';
    this.shortLabel.textContent = 'Краткое описание';

    this.shortInput = document.createElement('input');
    this.shortInput.classList.add('form__input', 'form__input_short');
    this.shortInput.id = 'short';
    this.shortInput.type = 'text';
    this.shortInput.placeholder = 'Введите описание тикета';
    this.shortInput.required = true;
    this.shortInput.value = name;

    this.shortFieldset.append(this.shortLabel, this.shortInput);

    this.form.append(this.shortFieldset);
  }

  renderFullFieldset(description) {
    this.fullFieldset = document.createElement('fieldset');
    this.fullFieldset.classList.add('form__fieldset', 'form__fieldset_short-description');

    this.fullLabel = document.createElement('label');
    this.fullLabel.classList.add('form__label', 'form__label_full');
    this.fullLabel.for = 'full';
    this.fullLabel.textContent = 'Подробное описание';

    this.fullTextarea = document.createElement('textarea');
    this.fullTextarea.classList.add('form__textarea', 'form__textarea_full');
    this.fullTextarea.id = 'full';
    this.fullTextarea.placeholder = 'Можете описать подробнее';
    this.fullTextarea.value = description;

    this.fullFieldset.append(this.fullLabel, this.fullTextarea);

    this.form.append(this.fullFieldset);
  }

  renderBtnsFieldset() {
    this.btnsFieldset = document.createElement('fieldset');
    this.btnsFieldset.classList.add('form__fieldset', 'form__fieldset_btns');

    this.btnClose = document.createElement('button');
    this.btnClose.classList.add('form__btn', 'form__btn_close');
    this.btnClose.type = 'reset';
    this.btnClose.textContent = 'Отмена';

    this.btnOk = document.createElement('button');
    this.btnOk.classList.add('form__btn', 'form__btn_ok');
    this.btnOk.type = 'submit';
    this.btnOk.textContent = 'Ok';

    this.btnsFieldset.append(this.btnClose, this.btnOk);

    this.form.append(this.btnsFieldset);

    this.onBtnCloseClick = this.onBtnCloseClick.bind(this);
    this.btnClose.addEventListener('click', this.onBtnCloseClick);
  }

  onBtnCloseClick() {
    this.btnClose.removeEventListener('click', this.onBtnCloseClick);
    this.removeForm();
  }
}
