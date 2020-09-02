const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const socketIo = require("socket.io");
const http = require("http");
const axios = require("axios").default;

const app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = socketIo(server);

const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

let timeout = 0;

const streamURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream?tweet.fields=context_annotations&expansions=author_id"
);

const rulesURL = new URL(
  "https://api.twitter.com/2/tweets/search/stream/rules"
);

const errorMessage = {
  title: "Please Wait",
  detail: "Waiting for new Tweets to be posted...",
};

const authMessage = {
  title: "Could not authenticate",
  details: [
    `Please make sure your bearer token is correct.
      If using Glitch, remix this app and add it to the .env file`,
  ],
  type: "https://developer.twitter.com/en/docs/authentication",
};

const sleep = async (delay) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

const config = () => {
  const headers = {
    Authorization: `Bearer ${BEARER_TOKEN}`,
  };
  return {
    headers,
  };
};

app.get("/api/rules", async (req, res) => {
  if (!BEARER_TOKEN) {
    res.status(400).send(authMessage);
  }

  try {
    const response = await axios.get(rulesURL.href, config());

    if (response.status !== 200) {
      if (response.status === 403) {
        res.status(403).send(response.data);
      } else {
        throw new Error(response.data.error.message);
      }
    }

    res.send(response.data);
  } catch (e) {
    res.send(e);
  }
});

app.post("/api/rules", async (req, res) => {
  console.log("aargh");
  if (!BEARER_TOKEN) {
    res.status(400).send(authMessage);
  }

  try {
    const response = await axios.post(rulesURL.href, req.body, config());

    if (response.status === 200 || response.status === 201) {
      console.log(JSON.stringify(response.data));
      res.send(response.data);
    } else {
      console.log(response);
      throw new Error(JSON.stringify(response));
    }
  } catch (e) {
    console.log(e);
    res.send("error");
    // res.send(e);
  }
});

const streamTweets = async (socket, token) => {
  try {
    const response = await axios.get(streamURL.href, {
      ...config(),
      responseType: "stream",
    });
    const stream = response.data;

    stream
      .on("data", (data) => {
        try {
          const json = JSON.parse(data);
          if (json.connection_issue) {
            socket.emit("error", json);
            reconnect(stream, socket, token);
          } else {
            if (json.data) {
              socket.emit("tweet", json);
            } else {
              socket.emit("authError", json);
            }
          }
        } catch (e) {
          socket.emit("heartbeat");
        }
      })
      .on("error", (error) => {
        // Connection timed out
        socket.emit("error", errorMessage);
        reconnect(stream, socket, token);
      });
  } catch (e) {
    socket.emit("authError", authMessage);
  }
};

const reconnect = async (stream, socket, token) => {
  timeout++;
  stream.abort();
  await sleep(2 ** timeout * 1000);
  streamTweets(socket, token);
};

io.on("connection", async (socket) => {
  try {
    const token = BEARER_TOKEN;
    io.emit("connect", "Client connected");
    streamTweets(io, token);
  } catch (e) {
    io.emit("authError", authMessage);
  }
});

console.log("NODE_ENV is", process.env.NODE_ENV);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, res) => {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  });
} else {
  port = 3001;
}

server.listen(port, () => console.log(`Listening on port ${port}`));
