const modal = document.querySelector('.page__overlay_modal');
const openModalBtn = document.querySelector('.present__order-btn');
const closeModalBtn = document.querySelector('.modal__close');
const burgerBtn = document.querySelector('.header__contacts-burger');
const burgerMenu = document.querySelector('.header__contacts');
const portfolioList = document.querySelector('.portfolio__list');

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
  })
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
})

handlerModal(openModalBtn, 'page__overlay_modal_open', modal, closeModalBtn);
handlerBurger(burgerBtn, burgerMenu, 'header__contacts_open');
