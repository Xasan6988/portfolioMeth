const modal = document.querySelector('.page__overlay_modal');
const openModalBtn = document.querySelector('.present__order-btn');
const closeModalBtn = document.querySelector('.modal__close');
const burgerBtn = document.querySelector('.header__contacts-burger');
const burgerMenu = document.querySelector('.header__contacts');
const portfolioList = document.querySelector('.portfolio__list');
const portfolioBtn = document.querySelector('.portfolio__add');

const disableScroll = () => {
  document.body.dataset.scrollY = window.scrollY;

  const scrollWidth = window.innerWidth - document.body.offsetWidth;

  document.body.style.cssText = `
  overflow:hidden;
  top:-${window.scrollY}px;
  left:0;
  width:100%;
  position:fixed;
  height:100vh;
  padding-right: ${scrollWidth}px;
  `;
};

const enableScroll = () => {
  document.body.style.cssText = '';
  window.scroll({
    top: document.body.dataset.scrollY,
  });
};


const handlerModal = (openBtn, openSelector, modalElem, closeBtn, userSpeed = 'default') => {

  let opacity = 0;

  const speed = {
    slow: 10,
    medium: 5,
    fast: 1,
    default: 3,
  };

  const open = () => {
    disableScroll();
    modalElem.style.opacity = opacity;
    modalElem.classList.add(openSelector);
    const timer = setInterval(() => {
      opacity += 0.02;
      modalElem.style.opacity = opacity;
      if (opacity >= 1) clearInterval(timer);
    }, speed[userSpeed] ? speed[userSpeed] : userSpeed);
  }

  const close = () => {
    enableScroll();
    const timer = setInterval(() => {
      opacity -= 0.02;
      modalElem.style.opacity = opacity;
      if (opacity <= 0) {
        modalElem.classList.remove(openSelector);
        clearInterval(timer);
      }
    }, speed[userSpeed] ? speed[userSpeed] : userSpeed);
  };

  openBtn.addEventListener('click', () => {
    open();
  });
  closeBtn.addEventListener('click', () => {
    close();
  });
  document.addEventListener('click', e => {
    if (e.target.contains(modal)) {
      close();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      close();
    }
  });
};

const handlerBurger = (btn, menu, openSelector) => {
  btn.addEventListener('click', () => {
    if (menu.classList.contains(openSelector)) {
      menu.style.height = '';
      menu.classList.remove(openSelector);
    } else {
      menu.style.height = menu.scrollHeight + 'px';
      menu.classList.add(openSelector);
    }
  });
};

portfolioList.addEventListener('click', e => {
  const pageOverlay = document.createElement('div');
  pageOverlay.classList.add('page__overlay');

  const target = e.target;
  const card = target.closest('.card');

  if (card) {
    document.body.append(pageOverlay);
    const title = card.querySelector('.card__client');

    const picture = document.createElement('picture');

    picture.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 1440px;
    `;

    picture.innerHTML = `
      <source srcset="${card.dataset.fullImage}.avif" type="image/avif">
      <source srcset="${card.dataset.fullImage}.webp" type="image/webp">
      <img src="${card.dataset.fullImage}.jpg" alt="${title.textContent}">
    `;

    pageOverlay.append(picture);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        enableScroll();
        pageOverlay.textContent = '';
        pageOverlay.remove();
      }
    });

    pageOverlay.addEventListener('click', () => {
      enableScroll();
      pageOverlay.textContent = '';
      pageOverlay.remove();
    })
    disableScroll();
  }
});

{// Работа с БД
const COUNT_CARD = 2;

const getData = () => {
  return fetch('db.json')
  .then(data => {
    if (data.ok) {
      return data.json();
    } else {
      throw `Что то пошло не так, попробуйте позже, ошибка: ${data.status}`;
    }
  })
  .catch(e => console.log(e.message));
};

  const createStore = async () => {
  const data = await getData();

  return {
    data,
    counter: 0,
    count: COUNT_CARD,
    get length() {
      return this.data.length;
    },
    get cardData() {
      const renderData = this.data.slice(this.counter, this.counter + this.count);
      console.log(renderData)
      this.counter += renderData.length;
      return renderData;
    },
  };
};

  const renderCard = data => {
    const cards = data.map(({preview, year, type, client, image}) => {
      const li = document.createElement('li');
      li.classList.add('portfolio__item');
      li.innerHTML = `
      <li class="portfolio__item">
            <article class="card" tabindex="0" role="button" aria-label="открыть макет" data-full-image="${image}">
              <picture class="card__picture">
                <source srcset="${preview}.avif" type="image/avif">
                <source srcset="${preview}.webp" type="image/webp">
                <img src="${preview}.jpg" alt="превью ${client}" width="166" height="103">
              </picture>

              <p class="card__data">
                <span class="card__client">Клиент: ${client}</span>
                <time class="card__date" datetime="${year}">год: ${year}</time>
              </p>

              <h3 class="card__title">${type}</h3>
            </article>
          </li>
      `
      return li;
    });
    portfolioList.append(...cards)
  };

  const initPortfolio = async () => {
    const store = await createStore();
    console.log(store)
    renderCard(store.cardData);

    portfolioBtn.addEventListener('click', () => {
      renderCard(store.cardData);
      console.log(store.length, store.counter)
      if (store.length === store.counter) {
        portfolioBtn.remove();
      };
    });
  };
  initPortfolio();
}


handlerModal(openModalBtn, 'page__overlay_modal_open', modal, closeModalBtn);
handlerBurger(burgerBtn, burgerMenu, 'header__contacts_open');
