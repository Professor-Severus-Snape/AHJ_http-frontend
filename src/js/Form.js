export default class Form {
  // TODO: передать нужный заголовок:
  constructor(titleName = 'Добавить тикет') {
    this.titleName = titleName;

    this.form = document.createElement('form');
    this.form.classList.add('form');

    this.renderForm();

    document.body.append(this.form);
  }

  // TODO: в зависимости от ситуации сделать разное наполнение формы:
  renderForm() {
    this.createTitle();
    this.createQuestion();
    this.createShortFieldset();
    this.createFullFieldset();
    this.createBtnsFieldset();

    // TODO: в зависимости от ситуации вешать разные обработчики на кнопку 'Ok'
  }

  createTitle() {
    this.title = document.createElement('h3');
    this.title.classList.add('form__title');
    this.title.textContent = this.titleName;

    this.form.append(this.title);
  }

  createQuestion() {
    this.question = document.createElement('p');
    this.question.classList.add('form__text');
    this.question.textContent = 'Вы уверены, что хотите удалить тикет? Это действие необратимо.';

    this.form.append(this.question);
  }

  createShortFieldset() {
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

    this.shortFieldset.append(this.shortLabel, this.shortInput);

    this.form.append(this.shortFieldset);
  }

  createFullFieldset() {
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

    this.fullFieldset.append(this.fullLabel, this.fullTextarea);

    this.form.append(this.fullFieldset);
  }

  createBtnsFieldset() {
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
  }

  // NOTE: по закрытии формы удалить саму форму из DOM:
  removeForm() {
    this.form.remove();
  }
}
