ЗАПУСК:

выполнить в корневой папке в терминале:
1. ". .env"
2. ./start.sh $IMAGE_NAME

МИГРАЦИИ (тут она одна):

зайти в ./install и выполнить:
1. ./initdb.sh $PG_USER $PG_DB

---

Таблицу userTag я не стал создавать (не совсем понял зачем она нужна, если у нас есть связь one-to-may, а если мы хотим хранить в ней массив id тегов пользователя, то это просто лишние запросы будут к обеим таблицам)
POST Метод /user/tag сделал на таблицу tag, другие два метода уже по сути существуют, но по-другому называются

Этот вот момент я совсем не понял, но какое-то решение надо было принять

---

На оба токена один секрет - с нестом работаю впервые, там своя jwt библиотека под капотом и сколько не искал - на оба токена создать разные секреты без паспорта не нашел как, была идея подключить jsonwebtoken, но оставил nest реализацию


