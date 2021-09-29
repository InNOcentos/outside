#!/bin/sh

DIR=`dirname $0`

echo "Делаем миграции..."

bash $DIR/migration_2021_09_28.sh $1 $2