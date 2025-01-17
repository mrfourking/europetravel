# europetravel
Тестовый проект Акселератора Лиги А.

## Перед началом работы

Для работы шаблона необходимо установить `nodejs` (вместе с `npm`)

- [Установка Nodejs](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager "Installing Node.js via package manager")

## Установка шаблона

``` sh
$ git clone https://github.com/tsergeytovarov/grunt-project.git project-name
$ cd project-name
$ npm install
```

По окончанию выполнения будут установлены все необходимые пакеты.


### Задачи Gulp

 - `$ gulp clean` - очистка каталога `build/`
 - `$ gulp server` - запуск локального веб-сервера для livereload
 - `$ gulp build` - полная сборка проекта
 - `$ gulp watch` - запуск задачи `server` и отслеживания изменений
 - `$ gulp images` - оптимизация изображений
 - `$ gulp webp` - генерация изображений WebP
 - `$ gulp sprite` - генерация svg-спрайта
 - `$ gulp css` - сборка css-файла
 - `$ gulp cssmin` - сборка минифицированного css-файла
 - `$ gulp html` - импорт спрайта в html-файл
 - `$ gulp copy` - копирование шрифтов, изображений и скриптов в build/
 - `$ gulp compress` - копирование и минификация скриптов в build/

## Общая концепция

- `source/` - каталог для размещения рабочих файлов (html, sass, js, изображения)
- `build/` - каталог для размещения готовой верстки

Вся работа осуществляется в каталоге `src/`.

## Концепции работы


### Компиляция Sass

Задачи `$ gulp css` и `$ gulp cssmin`

Файл `src/css/style.sass` является диспетчером подключений для всех прочих sass-файлов.

Организация файлов проекта осуществляется по методологии MCSS.

При компиляции происходит объединение всех файлов, компиляция в CSS, форматирование стиля кодирования, добавление вендорных префиксов, минификация и запись sourcemaps.
Итоговые файлы стилевых таблиц помещаются в каталог `build/css` (style.css, style.min.css, style.min.css.map)

### Очистка каталога сборки

Задача `$ gulp clean`

При выполнении задачи полностью удаляется содержимое каталога `build/` за исключением файла `build/.gitignore`

### Полная сборка проекта

Задача `$ gulp build`

При запуске задачи последовательно выполняются задачи  `clean`, `copy`, `css`, `cssmin`, `compress`, `sprite`, `html`.

В итоге выполнения в каталоге `build/` формируется полная сборка проекта.

### Livereload и синхронизация между браузерами

Задача `$ gulp server`

При выполнении задачи запускается локальный веб-сервер BrowserSync и открыватся index.html проекта.  

[Подробнее о BrowserSync](http://www.browsersync.io/ "Подробнее о BrowserSync")  

Сервер использует каталог `build/` в качестве корня проекта.

### Отслеживание изменений

Задача `$ gulp watch`

При запуске сначала выполняется задача `$ gulp server`, затем при изменении или добавлении в каталоге `source/` каких  
либо файлов, автоматически запускается соответсвующая задача по их обработке.
