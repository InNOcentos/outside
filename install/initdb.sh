#!/bin/sh

DIR=`dirname $0`

CMD="docker exec -it ph_container -U $PG_USER $PG_DB"


echo "Делаем миграции..."
bash $DIR/