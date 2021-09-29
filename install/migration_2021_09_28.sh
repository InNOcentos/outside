#!/bin/sh
CMD="docker exec -i pg_container /usr/bin/psql -U $1 $2 -c "

CREATE_TAG='"CREATE TABLE outside.tag (id SERIAL, creator uuid NOT NULL, name  varchar(40), sortOrder int DEFAULT 0, UNIQUE(name));"'

echo $CMD $CREATE_TAG | /bin/sh