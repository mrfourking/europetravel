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
