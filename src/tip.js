export class Tip {
  static create(tip) {
    return fetch('https://tips-playground-default-rtdb.firebaseio.com/tip.json', {
      method: 'POST',
      body: JSON.stringify(tip),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((response) => {
        tip.id = response.name;
        return tip;
      })
      .then(addToLocalStorage)
      .then(Tip.renderList)
      .catch((reason) => {
        console.error('Error in fetch: ', reason)
      })
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve('<p class="error">Нет токена</p>');
    }
    return fetch(`https://tips-playground-default-rtdb.firebaseio.com/tip.json?auth=${token}`)
    .then((response) => response.json())
    .then((response) => {
      if (response && response.error) {
        return `<p class="error">${response.error}</p>`;
      }

      return response 
        ? Object.keys(response).map((key) => ({
          ...response[key],
          id: key
        }))
        : [];
    })
  }

  static renderList() {
    const tips = getTipsFromLocalStorage();
    const html = tips.length
      ? tips.map(toCard).join('')
      : `<div class="mui--text-headline">Заметок пока нет. Вперёд!</div>`;

    console.log('before get list html: ', html);
    const list = document.getElementById('list');
    console.log('after get list: ', list);

    list.innerHTML = html;
    console.log('after inner');
  }

  static listToHtml(tips) {
    return tips.length 
      ? `<ol>${tips.map(t => `<li><h3>${t.title}</h3><p>${t.text}</p></li>`)}</ol>`
      : '<p>Пустой лист</p>';
  }
}

function addToLocalStorage(tip) {
  const tips = getTipsFromLocalStorage();
  const newLs = [
    ...tips,
    tip
  ]
  localStorage.setItem('tips', JSON.stringify(newLs));
};

function getTipsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('tips') || '[]');
};

function toCard(tip) {
  return `
    <div class="mui--text-headline">${tip.title}</div>
    <div class="mui--text-black-54">Оставлена ${new Date(tip.date).toLocaleString()}</div>
    <div>${tip.text}</div>
    <br/>`;
};