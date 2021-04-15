import './style.css';
import { isValid, createAndOpenModal } from './utils';
import { Tip } from './tip';
import getAuthForm, { authWithEmailAndPassword } from './auth';

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const titleInput = form.querySelector('#title-input');
const textInput = form.querySelector('#text-input');
const submitBtn = form.querySelector('#submit');

window.addEventListener('load', Tip.renderList);
modalBtn.addEventListener('click', openModal);

const submitFormHandler = (e) => {
  e.preventDefault();

  if (isValid(textInput.value)) {
    const tip = {
      title: titleInput.value,
      text: textInput.value,
      date: new Date().toJSON()
    }

    submitBtn.disabled = true;

    // async request to server
    Tip.create(tip).then(() => {
      titleInput.value = '';
      titleInput.className = ''; 
      textInput.value = '';
      textInput.className = ''; 
      submitBtn.disabled = false;
    });
  }
}

form.addEventListener('submit', submitFormHandler);
titleInput.addEventListener('input', () => {
  submitBtn.disabled = !isValid(titleInput.value);
});

function openModal() {
  createAndOpenModal('Авторизация', getAuthForm());
  document
    .getElementById('auth-form')
    .addEventListener('submit', authFormHandler, { once: true });
};

function authFormHandler(event) {
  event.preventDefault();

  const btn = event.target.querySelector('button');
  const email = event.target.querySelector('#email').value;
  const password = event.target.querySelector('#password').value;

  btn.disabled = true;
  authWithEmailAndPassword(email, password)
    .then(Tip.fetch)
    .then(renderModelAfterAuth)
    .then(() => {
      btn.disabled = false;
    });
}

function renderModelAfterAuth(content) {
  if (typeof content === 'string') {
    createAndOpenModal('Ошибка!', content);
  } else {
    createAndOpenModal("Список заметок", Tip.listToHtml(content));
  }
}