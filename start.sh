#!/bin/bash

echo "Создаем образ..."
docker build -t $1 .
echo "Разворачиваем..."
docker-compose up -d