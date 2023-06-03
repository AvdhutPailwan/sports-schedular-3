const express = require("express");
const app = express();
const { Session } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/sportSession");
});

// list all sport session
app.get("/sportSession", async (req, res) => {
  console.log("Display the list of sessions");
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

// create session
app.get("/createSession", (req, res) => {
  res.render("createSession");
});
app.post("/sportSession", async (req, res) => {
  console.log("Create session : ", req.body);
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

// remove session
app.delete("/sportSession", async (req, res) => {
  console.log("delete session with id : ", req.body.id);
  try {
    await Session.deleteSession(req.body.id);
    // if (req.accepts("html")) {
    // res.redirect("/sportSession");
    // } else {
    res.json(req.body.id);
    // }
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

app.put("/sportSession", async (req, res) => {
  console.log("update status to cancelled of session id : ", req.body.id);
  try {
    await Session.update(
      { cancelled: true },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.json(req.body.id);
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

// single session
app.get("/details/:id", async (req, res) => {
  console.log("Display session with id : ", req.params.id);
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

// remove player
app.put("/details/:playername/:id", async (req, res) => {
  console.log("removing player : ", req.params.playername);
  const sessions = await Session.findByPk(req.params.id);
  console.log(sessions);
  try {
    const updatedplayer = await Session.removePlayer(
      req.params.playername,
      req.params.id
    );
    // if (
    // req.user.sessionId.includes(sessions.id) &&
    // req.user.fname == req.params.playername
    // ) {
    // await user.removeSessionId(sessions.id, req.user.id);
    // }
    return res.json(updatedplayer);
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

// edit session
app.get("/sportSession/:id/edit", async (req, res) => {
  const sessionDetails = await Session.findByPk(req.params.id);
  try {
    res.render("editSession", {
      sessionDetails,
      time: moment(sessionDetails.time).format("YYYY-MM-DDTHH:mm"),
    });
  } catch (err) {
    console.error(err);
    res.statusCode(422).json(err);
  }
});

app.post("/sportSession/:id/update", async (req, res) => {
  // const session = await Session.findByPk(req.params.id)
  // session.time = req.body.time;
  // session.place = req.body.place;
  // session.players = req.body.players.split(",");
  // session.noOfPlayers = req.body.noOfPlayers;
  console.log("update the session with id : ", req.params.id);
  try {
    await Session.update(
      {
        time: req.body.time,
        place: req.body.place,
        players: req.body.players.split(","),
        noOfPlayers: req.body.noOfPlayers,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.redirect(`/details/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});
module.exports = app;
