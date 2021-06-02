const express = require("express");
const app = express();
const genres = require("./routes/genres");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/genres", genres);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
