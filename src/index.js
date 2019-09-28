const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
const API2 = 'http://us-central1-escuelajs-api.cloudfunctions.net/characters';

window.addEventListener("beforeunload", function (e) {
    localStorage.removeItem('next_fetch');
});

const getData = api => {
    const next_fetch = localStorage.getItem('next_fetch');
    let API_URL = api;

    if (!next_fetch) {
        console.log('next_fetch?, no, doesnt exist that.')
    } else {
        console.log('Yes!, next_fetch exist!')
        API_URL = next_fetch
    }

    fetch(API_URL)
        .then(response => response.json())
        .then(response => {
            const characters = response.results;
            localStorage.setItem('next_fetch', response.info.next);
            let output = characters.map(character => {
                return `
                  <article class="Card">
                    <img src="${character.image}" />
                    <h2>${character.name}<span>${character.species}</span></h2>
                  </article>
                `
            }).join('');
            let newItem = document.createElement('section');
            newItem.classList.add('Items');
            newItem.innerHTML = output;
            $app.appendChild(newItem);
        })
        .catch(error => console.log(error));
};

const loadData = async () => {
  try {
    return await getData(API);
  } catch (e) {
    console.log(e)
  }
};

const intersectionObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        loadData();
    }
}, {
    rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);
