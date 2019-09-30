const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';

window.addEventListener("beforeunload", () => {
    localStorage.removeItem('next_fetch');
});

const appendElement = (el, cont, classes) => {
    let element = document.createElement(el);
    element.classList.add(classes);
    element.innerHTML = cont;
    $app.appendChild(element);
};

const getData = api => {
    const next_fetch = localStorage.getItem('next_fetch');
    let API_URL = api;

    next_fetch ? API_URL = next_fetch : console.log('next_fetch?, no, doesn\'t exist.')

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
            appendElement('section', output, 'Items')
            if (!response.info.next) {
                localStorage.removeItem('next_fetch');
                appendElement('h3', "Ya no hay personajes...", 'Warning')
                intersectionObserver.disconnect()
            }
        })
        .catch(error => console.log(error));
};

const loadData = async () => {
    try {
        return await getData(API);
    } catch (error) {
        console.log(error)
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
