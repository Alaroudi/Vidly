const express = require("express");
const app = express();

require("./startup/validation")();
require("./startup/logging")();
require("./startup/db")();
require("./startup/routes")(app);
require("./startup/config")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening to port ${port}`));

module.exports = server;
