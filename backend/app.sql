BEGIN;

SET client_encoding="UTF-8";

CREATE TABLE users (uid UUID PRIMARY KEY DEFAULT gen_random_uuid(), password text NOT NULL, username text NOT NULL UNIQUE, chats UUID[] NOT NULL DEFAULT ARRAY[]::UUID[]);

CREATE TABLE chats (uid uuid PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, people UUID[] NOT NULL DEFAULT ARRAY[]::UUID[], messages JSON[] NOT NULL DEFAULT ARRAY[]::JSON[]);

COMMIT;
