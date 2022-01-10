BEGIN;

SET client_encoding="UTF-8";

CREATE TABLE users (uid UUID PRIMARY KEY DEFAULT gen_random_uuid(), password text NOT NULL, username text NOT NULL UNIQUE, chats UUID[] NOT NULL DEFAULT ARRAY[]::UUID[]);

CREATE TABLE chats (uid uuid PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, people UUID[] NOT NULL DEFAULT ARRAY[]::UUID[], messages JSON[] NOT NULL DEFAULT ARRAY[]::JSON[]);

INSERT INTO users(password, username, chats) VALUES ('234', 'testuser1', ARRAY[gen_random_uuid()]::UUID[]);
INSERT INTO chats(uid, name, people) VALUES ((SELECT chats FROM users WHERE username = 'testuser1')[1], 'testchat1', ARRAY(SELECT uid FROM users WHERE username = 'testuser1')::UUID[]);

COMMIT;
