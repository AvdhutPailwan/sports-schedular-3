const express = require("express");
const app = express();
const { Session, Sport } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");
const moment = require("moment");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");
// const session = require("express-session")

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secreat string"));
// app.use(session({ secret: "keyboard cat" }));
// order matters: above three must come first
app.use(
  csrf(
    // "123456789iamasecret987654321look", // secret -- must be 32 bits or chars in length
    // ["POST"], // the request methods we want CSRF protection for
    // ["/detail", /\/detail\.*/i], // any URLs we want to exclude, either as strings or regexp
    // [process.env.SITE_URL + "/service-worker.js"]  // any requests from here will not see the token and will not generate a new one
    "this_should_be_32_character_long",
    ["POST", "PUT", "DELETE"]
  )
);
// eslint-disable-next-line no-undef
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const listSports = await Sport.findAll();
  res.render("index", {
    listSports,
    csrfToken: req.csrfToken,
  });
});

// list all sport session
app.get("/sportSession/:sportId", async (req, res) => {
  console.log("Display the list of sessions");
  const sport = await Sport.findByPk(req.params.sportId);
  const allSessions = await Session.getAllSessions(req.params.sportId);
  // console.log(sport);
  // console.log(allSessions);
  if (req.accepts("html")) {
    res.render("sportSessions", {
      allSessions,
      sport,
      csrfToken: req.csrfToken(),
    });
  } else {
    res.json({
      allSessions,
      sport,
    });
  }
});

// create session
app.get("/createSession/:sportId", async (req, res) => {
  const sport = await Sport.findByPk(req.params.sportId);
  console.log(sport);
  res.render("createSession", {
    sport,
    csrfToken: req.csrfToken(),
  });
});
app.post("/sportSession/:sportId", async (req, res) => {
  console.log("Create session : ", req.body);
  try {
    const session = await Session.createSession({
      time: req.body.time,
      place: req.body.place,
      players: req.body.players,
      noOfPlayers: req.body.noOfPlayers,
      sportId: req.params.sportId,
    });
    if (req.accepts("html")) {
      res.redirect(`/sportSession/${req.params.sportId}`);
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
  const sport = await Sport.findByPk(details.sportId);
  try {
    if (req.accepts("html")) {
      res.render("sessionDetails", {
        sport,
        details,
        csrfToken: req.csrfToken(),
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
      csrfToken: req.csrfToken(),
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

// create sport
app.get("/createSport", async (req, res) => {
  try {
    res.render("createSport", {
      csrfToken: req.csrfToken(),
    });
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

app.post("/createSport", async (req, res) => {
  console.log("creating sport : ", req.body.sportName);
  try {
    const object = await Sport.create({
      sportName: req.body.sportName,
    });
    console.log(object);
    res.redirect(`/sportSession/${object.dataValues.id}`);
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

// edit sport

app.get("/editSport/:sportId", async (req, res) => {
  const sport = await Sport.findByPk(req.params.sportId);
  res.render("editSport", {
    sport,
    csrfToken: req.csrfToken(),
  });
});

app.post("/editSport/:sportId", async (req, res) => {
  try {
    await Sport.update(
      { sportName: req.body.sportName },
      {
        where: {
          id: req.params.sportId,
        },
      }
    );
    res.redirect(`/sportSession/${req.params.sportId}`);
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});

// delete sport
app.delete("/deleteSport/:sportId", async (req, res) => {
  try {
    await Session.destroy({
      where: {
        sportId: req.params.sportId,
      },
    });

    await Sport.destroy({
      where: {
        id: req.params.sportId,
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(422).json(err);
  }
});
module.exports = app;
