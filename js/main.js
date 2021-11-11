const modal = document.querySelector('.page__overlay_modal');
const openModalBtn = document.querySelector('.present__order-btn');
const closeModalBtn = document.querySelector('.modal__close');

const handlerModal = (openBtn, openSelector, modalElem, closeBtn, userSpeed = 'default') => {

  let opacity = 0;

  const speed = {
    slow: 10,
    medium: 5,
    fast: 1,
    default: 3,
  };

  openBtn.addEventListener('click', () => {
    modalElem.style.opacity = opacity;
    modalElem.classList.add(openSelector);
    const timer = setInterval(() => {
      opacity += 0.02;
      modalElem.style.opacity = opacity;
      if (opacity >= 1) clearInterval(timer);
    }, speed[userSpeed] ? speed[userSpeed] : userSpeed);
  });
  closeBtn.addEventListener('click', () => {
    const timer = setInterval(() => {
      opacity -= 0.02;
      modalElem.style.opacity = opacity;
      if (opacity <= 0) {
        modalElem.classList.remove(openSelector);
        clearInterval(timer);
      }
    }, speed[userSpeed] ? speed[userSpeed] : userSpeed);
  });
};

handlerModal(openModalBtn, 'page__overlay_modal_open', modal, closeModalBtn);
