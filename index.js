const express = require("express");
const app = express();

app.use(express.json());

// hard coded genres
const genres = [
  { id: 1, genre: "Action" },
  { id: 2, genre: "Horror" },
];

//Get Requests
app.get("/", (req, res) => {
  res.send("Welcome to Vidly");
});

app.get("/api/genres", (req, res) => {
  res.send(genres);
});

app.get("/api/genres/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const genre = genres.find((element) => element.id === id);

  if (!genre) {
    return res.status(404).send("Genre with given id is not found.");
  }

  res.send(genre);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
