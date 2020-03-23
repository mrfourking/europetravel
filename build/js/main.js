'use strict';

/**
 * Модуль открытия меню шапки
 */
(function () {
  var headerButton = document.querySelector('.header__menu-button');
  var headerButtonIcons = headerButton.querySelectorAll('.header__icon');
  var headerMenu = document.querySelector('.header__menu');

  headerButton.classList.remove('header__menu-button--nojs');
  headerMenu.classList.remove('header__menu--nojs');

  headerButton.addEventListener('click', function () {
    headerButton.classList.toggle('header__menu-button--open');
    headerMenu.classList.toggle('header__menu--open');
    document.body.classList.toggle('scroll-hidden');
    headerButtonIcons.forEach(function (item) {
      item.classList.toggle('header__icon--active');
    });
  });
})();

/**
 * Модуль свайпа меню со списком стран и переключения слайдов
 */
(function () {
  var menu = document.querySelector('.countries__carousel');
  var menuItems = menu.querySelectorAll('.countries__carousel-item');
  var blocks = document.querySelectorAll('.countries__item');
  var activeItem = menu.querySelector('.countries__carousel-item--active');
  var activeBlock = document.querySelector('.countries__item--active');
  var touchStart = 0;
  var touchPosition = 0;
  var menuStart = 0;

  /**
   * Функция обработки нажатия touch
   * @param {Object} evt - Объект Event
   */
  var onMenuTouchStart = function (evt) {
    touchStart = evt.changedTouches[0].clientX;
    menuStart = menu.offsetLeft;

    document.addEventListener('touchmove', onMenuTouchMove);
    document.addEventListener('touchend', onMenuTouchEnd);
  };

  /**
   * Функция перемещения меню при свайпе
   * @param {Object} evt - объект Event
   */
  var onMenuTouchMove = function (evt) {
    var menuLength = menu.getBoundingClientRect().right - menu.getBoundingClientRect().left;
    var marginLength = parseInt(window.getComputedStyle(menu, null).marginLeft, 10);
    var finalShift = 0;
    var shift = 0;
    touchPosition = evt.changedTouches[0].clientX;
    shift = (touchPosition - touchStart);

    finalShift = menuStart + shift;

    if (menuLength > document.body.clientWidth) {
      if (finalShift < 0 && Math.abs(finalShift) < (menuLength - document.body.clientWidth + marginLength * 2)) {
        menu.style.left = (menuStart + shift) + 'px';
      }
    }

  };

  /**
   * Фукнция обработки конца нажатия touch
   */
  var onMenuTouchEnd = function () {

    document.removeEventListener('touchmove', onMenuTouchMove);
    document.removeEventListener('touchend', onMenuTouchEnd);
  };

  /**
   * Функция переключения слайдов
   * @param {Object} item - объект, элемент меню
   * @param {Number} index  - индекс элемента меню по порядку
   */
  var toggleSlides = function (item, index) {
    item.classList.add('countries__carousel-item--active');
    blocks[index].classList.add('countries__item--active');

    if (activeItem) {
      activeItem.classList.remove('countries__carousel-item--active');
      activeBlock.classList.remove('countries__item--active');
    }

    activeItem = item;
    activeBlock = blocks[index];
  };

  menu.addEventListener('touchstart', onMenuTouchStart);

  menuItems.forEach(function (item, index) {
    item.addEventListener('click', function (evt) {
      evt.preventDefault();
      toggleSlides(item, index);
    });
  });
})();

/**
 * Модуль для работы модального окна и формы
 */
(function () {
  var ESC_KEYCODE = 27;
  var openButtons = document.querySelectorAll('.button--modal');
  var modalWrap = document.querySelector('.modal-wrap');
  var modal = document.querySelector('.modal');
  var modalSuccess = document.querySelector('.modal--success');
  var closeButton;
  var userPhone = modal.querySelector('#phone-modal');
  var userMail = modal.querySelector('#mail-modal');

  var form = document.querySelector('.callback__form form');

  var isStorageSupport = true;
  var storagePhone = '';
  var storageMail = '';

  try {
    storagePhone = localStorage.getItem('userPhone');
    storageMail = localStorage.getItem('userMail');
  } catch (err) {
    isStorageSupport = false;
  }

  var saveToLocalStorage = function () {
    if (isStorageSupport) {
      localStorage.setItem('userPhone', userPhone.value);
      localStorage.setItem('userMail', userMail.value);
    }
  };

  var openModal = function (item) {
    closeButton = item.querySelector('.modal__button-close');

    item.classList.add('modal--open');
    document.body.classList.add('scroll-hidden--modal');

    document.addEventListener('keydown', onModalKeydown(item));
    document.addEventListener('click', onRandomAreaClick(item));
    closeButton.addEventListener('click', onModalButtonClick(item));
  };

  var closeModal = function (item) {
    item.classList.remove('modal--open');
    document.body.classList.remove('scroll-hidden--modal');

    document.removeEventListener('keydown', onModalKeydown(item));
    document.removeEventListener('click', onRandomAreaClick(item));
    closeButton.removeEventListener('click', onModalButtonClick(item));
  };

  var onModalButtonClick = function (item) {
    return function () {
      saveToLocalStorage();

      closeModal(item);
    };
  };

  var onModalKeydown = function (item) {
    return function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeModal(item);
      }
    };
  };

  var onRandomAreaClick = function (item) {
    return function (evt) {
      if (evt.target === modalWrap) {
        closeModal(item);
      }

    };
  };

  openButtons.forEach(function (item) {
    item.addEventListener('click', function (evt) {
      evt.preventDefault();
      evt.stopPropagation();

      openModal(modal);

      userPhone.focus();

      if (isStorageSupport) {
        userPhone.value = storagePhone;
        userMail.value = storageMail;
      }
    });
  });

  modal.addEventListener('submit', function (evt) {
    evt.preventDefault();
    saveToLocalStorage();
    closeModal(modal);
    openModal(modalSuccess);
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    openModal(modalSuccess);
  });
})();

/**
 * Модуль с маской и валидацией телефона
 */
(function () {
  var START_SYMBOLS = '+7(';
  var CLOSE_SYMBOL = ')';
  var SEPARATOR = '-';
  var MIN_LENGTH = 4;
  var MAX_LENGTH = 16;
  var ERROR_MESSAGE = 'Номер телефона не соответствует формату +7(ХХХ)ХХХ-ХХ-ХХ';

  var phoneInputs = document.querySelectorAll('input[type="tel"]');

  var checkPhoneNumber = function (item) {
    var startIndex = 0;
    var longNumber = 3;
    var shortNumber = 2;
    var phoneNumber = item.value;

    if (phoneNumber.substr(startIndex, START_SYMBOLS.length) !== START_SYMBOLS) {
      item.setCustomValidity(ERROR_MESSAGE);
    } else {
      startIndex += START_SYMBOLS.length;
      if (isNaN(Number(phoneNumber.substr(startIndex, longNumber)))) {
        item.setCustomValidity(ERROR_MESSAGE);
      } else {
        startIndex += longNumber;
        if (phoneNumber.substr(startIndex, 1) !== CLOSE_SYMBOL) {
          item.setCustomValidity(ERROR_MESSAGE);
        } else {
          startIndex += CLOSE_SYMBOL.length;
          if (isNaN(Number(phoneNumber.substr(startIndex, longNumber)))) {
            item.setCustomValidity(ERROR_MESSAGE);
          } else {
            startIndex += longNumber;
            if (phoneNumber.substr(startIndex, 1) !== SEPARATOR) {
              item.setCustomValidity(ERROR_MESSAGE);
            } else {
              startIndex += SEPARATOR.length;
              if (isNaN(Number(phoneNumber.substr(startIndex, shortNumber)))) {
                item.setCustomValidity(ERROR_MESSAGE);
              } else {
                startIndex += shortNumber;
                if (phoneNumber.substr(startIndex, 1) !== SEPARATOR) {
                  item.setCustomValidity(ERROR_MESSAGE);
                } else {
                  startIndex += SEPARATOR.length;
                  if (isNaN(Number(phoneNumber.substr(startIndex, shortNumber))) || phoneNumber.substr(startIndex, shortNumber).length < shortNumber) {
                    item.setCustomValidity(ERROR_MESSAGE);
                  } else {
                    item.setCustomValidity('');
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  var setValue = function (item) {
    if (item.value.length < MAX_LENGTH) {
      switch (item.value.length) {
        case 0:
        case 1:
        case 2:
        case 3:
          item.value = START_SYMBOLS;
          break;
        case 6:
          item.value += CLOSE_SYMBOL;
          break;
        case 10:
        case 13:
          item.value += SEPARATOR;
          break;
      }
    }
  };

  var onTelInput = function (item) {
    return function (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      if (item.value.length < MIN_LENGTH && evt.data === null) {
        item.value = START_SYMBOLS;
      }
      if (/[\d]/g.test(evt.data)) {
        setValue(item);
      } else {
        item.value = item.value.replace(/[^0-9\+\(\-)]/, '');
      }
      checkPhoneNumber(item);
    };
  };

  phoneInputs.forEach(function (item) {
    item.addEventListener('focus', function () {
      setValue(item);

      item.addEventListener('input', onTelInput(item));
    });

    item.addEventListener('blur', function () {
      if (item.value.length <= START_SYMBOLS.length) {
        item.value = '';
      }
    });
  });

  window.inputMask = {
    checkPhoneNumber: checkPhoneNumber
  };
})();
