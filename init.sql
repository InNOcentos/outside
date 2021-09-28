CREATE SCHEMA outside;

CREATE EXTENSION "uuid-ossp";

CREATE TABLE outside.user (
    uid UUID NOT NULL DEFAULT uuid_generate_v1(),
    email varchar(100), password varchar(100),
    nickname varchar(30),
    CONSTRAINT  pkey_tbl PRIMARY KEY (uid)
    ) WITH (OIDS=FALSE);

CREATE TABLE outside.tag (id SERIAL, creator uuid, name  varchar(40), sortOrder int DEFAULT 0, UNIQUE(name));

CREATE TABLE outside.user_tag (uid UUID, tags jsonb);