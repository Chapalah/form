class CustomSelect {
  static target = null;
  static select = document.createElement('div');
  static placeholder = null;

  constructor(target, placeholder) {
    this.target = document.querySelector(target);
    this.placeholder = placeholder || 'Select';
  }

  init() {
    this.target.classList.add('--hidden');

    this._createCustomSelect();
    this._addEvents();

    document.querySelectorAll('.custom-select__option').forEach((option) => {
      option.addEventListener('click', (event) => {
        this._updateSelect(
          event.target.getAttribute('value'),
          event.target.innerHTML
        );
      });
    });
  }

  _getOptions() {
    const options = [...this.target.querySelectorAll('option:not(:disabled)')];

    return options.map((option) => ({
      value: option.getAttribute('value'),
      text: option.innerHTML,
    }));
  }

  _createCustomOptions(options) {
    return options.reduce(
      (acc, option) =>
        (acc += `
        <li value="${option.value}" class="custom-select__option">${option.text}</li>
      `),
      ''
    );
  }

  _createWrapper() {
    return `<ul class="custom-select__list">${this._createCustomOptions(
      this._getOptions()
    )}</ul>`;
  }

  _updateSelect(value, text) {
    this.select.querySelector('.custom-select__value').innerHTML = text;
    this.select
      .querySelector('.custom-select__value')
      .classList.remove('custom-select__value--placehoder');
    this.target.value = value;
    this.target.dispatchEvent(new Event("input"));
    this.select.classList.toggle('custom-select--opened');
  }

  _createCustomSelect() {
    this.select = document.createElement('div');
    this.select.classList.add('custom-select');
    this.select.innerHTML = `<div class="custom-select__value custom-select__value--placehoder">${
      this.placeholder
    }</div>
    <i class="custom-select__arrow">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M28.3334 16.6667L20.0001 25L11.6667 16.6667" stroke="#3D46FA" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
</i> ${this._createWrapper()}`;
    this.target.parentNode.append(this.select);
  }

  _addEvents() {
    window.addEventListener('click', (event) => {
      if (!this.select.contains(event.target)) {
        this.select.classList.remove('custom-select--opened');
      }
    });

    this.select.addEventListener('click', (event) => {
      if (event.target.classList.contains('custom-select__option')) {
        return;
      }

      if (this.select.contains(event.target)) {
        this.select.classList.toggle('custom-select--opened');
      }
    });
  }
}

export default CustomSelect;
