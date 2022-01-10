const pg = require("pg"),
	Pool = pg.Pool,
	options = { host: "psql", user: "postgres", password: "docker", db: "postgres" };

module.exports = { pg, Pool, options };
