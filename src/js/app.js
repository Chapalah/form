import CustomSelect from './modules/CustomSelect';
import inputMask from './libs/inputMask.js';
import { customModal, ininModalEvents } from './modules/CustomModal';

const rangeSlider = document.querySelector('.form__range');
const rangeSliderValue = document.querySelector('.js-range-value');

const nextStepButton = document.querySelector('.js-step-next');
const prevStepButton = document.querySelector('.js-step-prev');
const submitButton = document.querySelector('.js-form-submit');

const currentStepView = document.querySelector('.js-current-step');
const formSteps = [...document.querySelectorAll('.form__step')];

let currentStep = 1;

rangeSlider.addEventListener('input', (event) => {
  rangeSliderValue.innerHTML = `${event.target.value} лет`;
});

const renderStep = () => {
  formSteps.forEach((step) => {
    step.getAttribute('data-step') == currentStep
      ? step.classList.remove('form__step--hidden')
      : step.classList.add('form__step--hidden');
  });

  currentStepView.innerHTML = currentStep;

  currentStep > 1
    ? document.querySelector('.button-wrap').classList.remove('button--hidden')
    : document.querySelector('.button-wrap').classList.add('button--hidden');

  if (currentStep === 3) {
    nextStepButton.classList.add('button--hidden');
    submitButton.classList.remove('button--hidden');
  } else {
    submitButton.classList.add('button--hidden');
    nextStepButton.classList.remove('button--hidden');
  }
};

nextStepButton.addEventListener('click', () => {
  currentStep += 1;
  renderStep();
  nextStepButton.setAttribute('disabled', 'true');
});

prevStepButton.addEventListener('click', () => {
  currentStep -= 1;
  renderStep();
  checkStep();
});

const s1 = new CustomSelect('#town', 'Выберите город');
s1.init();

const telSelector = document.querySelector('#tel');
let masks = {
  BY: '+375(##)###-##-##',
  RU: '+7(###)###-##-##',
};

fetch('https://ipapi.co/json/')
  .then((data) => data.json())
  .then((data) => {
    telSelector.setAttribute('country', `${data.country}`);
    telSelector.setAttribute(
      'data-inputmask',
      `'mask': '${masks[data.country]}'`
    );
    Inputmask().mask(telSelector);
  });

const getValue = (input) => {
  if (input.getAttribute('type') === 'radio' && input.checked) {
    return input.id;
  }

  if (input.getAttribute('type') === 'checkbox') {
    return input.checked;
  }

  return input.value;
};

const validateStep = (stepNumber) => {
  return Object.keys(formData[stepNumber]).every((key) => {
    if (key === 'sex' && formData[stepNumber][key] === 'on') {
      return false;
    }

    if (key === 'tel') {
      if (
        formData[stepNumber][key].replace('_', '').length ===
        masks[telSelector.getAttribute('country')]?.length
      ) {
        return true;
      }
    }

    return !!formData[stepNumber][key];
  });
};

const checkErrors = () => {
  return [...document.querySelectorAll('.form__item')].every(
    (item) => !item.classList.contains('form__item--error')
  );
};

const checkStep = () => {
  if (!checkErrors()) {
    nextStepButton.setAttribute('disabled', 'true');
    return;
  }

  if (currentStep === 3) {
    if (validateStep(currentStep)) {
      submitButton.removeAttribute('disabled');
      return;
    }

    submitButton.setAttribute('disabled', 'true');
  }

  if (validateStep(currentStep)) {
    nextStepButton.removeAttribute('disabled');
    return;
  }

  nextStepButton.setAttribute('disabled', 'true');
};

let formData = {};

formSteps.forEach((step) => {
  const stepNumber = step.getAttribute('data-step');

  const inputs = [
    ...step.querySelectorAll('.form input'),
    ...step.querySelectorAll('.form select'),
    ...step.querySelectorAll('.form textarea'),
  ];

  inputs.forEach((input) => {
    formData = {
      ...formData,
      [stepNumber]: { ...formData[stepNumber], [input.name]: getValue(input) },
    };

    input.addEventListener('input', (event) => {
      if (event.target.getAttribute('name') === 'message') {
        if (event.target.value.length >= 371) {
          if (!event.target.parentNode.querySelector('p')) {
            const errorElement = document.createElement('p');
            errorElement.innerHTML = 'Количество символов не более 370';
            event.target.before(errorElement);
          }

          event.target.parentNode.classList.add('form__item--error');
          event.target.value = formData[currentStep]['message'];
        } else {
          if (event.target.parentNode.querySelector('p')) {
            event.target.parentNode.removeChild(
              event.target.parentNode.querySelector('p')
            );
          }
          event.target.parentNode.classList.remove('form__item--error');
        }
      }

      formData = {
        ...formData,
        [stepNumber]: {
          ...formData[stepNumber],
          [event.target.getAttribute('name')]: getValue(event.target),
        },
      };

      checkStep();
    });
  });
});

submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  submitButton.classList.add('button--loading');

  setTimeout(() => {
    // axios.post('form-url', formData).then(() => {
    //   submitButton.classList.remove('button--loading');
    // });
    document.body.innerHTML =
      customModal(`      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" fill="none">
    <mask id="mask0_5_395" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="6" y="6" width="84" height="84">
      <path d="M48 88C53.2538 88.0068 58.4573 86.9753 63.3112 84.9647C68.1651 82.954 72.5738 80.004 76.284 76.284C80.0039 72.5739 82.954 68.1652 84.9646 63.3112C86.9752 58.4573 88.0068 53.2539 88 48C88.0067 42.7462 86.9751 37.5428 84.9644 32.6889C82.9538 27.835 80.0038 23.4262 76.284 19.716C72.5738 15.9961 68.1651 13.046 63.3112 11.0354C58.4573 9.02478 53.2538 7.99323 48 8.00003C42.7461 7.99334 37.5427 9.02494 32.6888 11.0356C27.8349 13.0462 23.4262 15.9962 19.716 19.716C15.9961 23.4262 13.0461 27.835 11.0355 32.6889C9.02488 37.5428 7.99327 42.7462 7.99997 48C7.99317 53.2539 9.02472 58.4573 11.0353 63.3112C13.046 68.1652 15.996 72.5739 19.716 76.284C23.4262 80.0039 27.8349 82.9539 32.6888 84.9645C37.5427 86.9751 42.7461 88.0067 48 88Z" fill="white" stroke="white" stroke-width="4" stroke-linejoin="round"/>
      <path d="M32 48L44 60L68 36" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </mask>
    <g mask="url(#mask0_5_395)">
      <path d="M0 0H96V96H0V0Z" fill="url(#paint0_linear_5_395)"/>
    </g>
    <defs>
      <linearGradient id="paint0_linear_5_395" x1="48" y1="0" x2="48" y2="96" gradientUnits="userSpaceOnUse">
        <stop stop-color="#3E42FB"/>
        <stop offset="1" stop-color="#07FFD2"/>
      </linearGradient>
    </defs>
  </svg>

  <h3>Ваша заявка успешно отправлена!</h3>

  <button class="button button--primary js-modal-ok">
    Закрыть
  </button>`);

    ininModalEvents();
  }, 2500);
});
