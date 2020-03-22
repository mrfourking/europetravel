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
