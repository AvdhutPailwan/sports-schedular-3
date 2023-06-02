const express = require("express");
const app = express();
const { Session } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/sportSession", async (req, res) => {
  const allSessions = await Session.getAllSessions();

  // console.log(allSessions);
  if (req.accepts("html")) {
    res.render("index", {
      allSessions,
    });
  } else {
    res.json({
      allSessions,
    });
  }
});

app.post("/sportSession", async (req, res) => {
  try {
    const session = await Session.createSession({
      time: req.body.time,
      place: req.body.place,
      players: req.body.players,
      noOfPlayers: req.body.noOfPlayers,
    });
    if (req.accepts("html")) {
      res.redirect("/sportSession");
    } else {
      res.json(session);
    }
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

app.delete("/sportSession/:id", async (req, res) => {
  try {
    await Session.deleteSession(req.params.id);
    if (req.accepts("html")) {
      res.redirect("/sportSession");
    } else {
      res.send(req.params.id);
    }
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

app.get("/details/:id", async (req, res) => {
  const details = await Session.findByPk(req.params.id);
  try {
    if (req.accepts("html")) {
      res.render("sessionDetails", {
        details,
      });
    } else {
      res.json(details);
    }
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

module.exports = app;
