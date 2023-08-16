const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectwithRetry = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(mongoURL)
    .then(() => console.log("Successfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectwithRetry, 5000);
    });
};

connectwithRetry();
app.enable("trust proxy");
app.use(cors());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 300000000000,
    },
  })
);

app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi There Robin Mike Muhia!!!!<h2>");
  console.log("Yeeee");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on port ${port}`));
