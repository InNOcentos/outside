docker exec -it 31510490baa1 psql -U psqluser psqldb -c "CREATE SCHEMA outside;"
docker exec -it 31510490baa1 psql -U psqluser psqldb -c 'CREATE EXTENSION "uuid-ossp"'
docker exec -it 31510490baa1 psql -U psqluser psqldb -c "CREATE TABLE outside.user (uid UUID NOT NULL DEFAULT uuid_generate_v1(), email varchar(100), password varchar(100), nickname varchar(30), CONSTRAINT  pkey_tbl PRIMARY KEY (uid)) WITH (OIDS=FALSE);"
docker exec -it 31510490baa1 psql -U psqluser psqldb -c "INSERT INTO outside.user (email, password, nickname) VALUES ('testemail', 'pass', 'name');"