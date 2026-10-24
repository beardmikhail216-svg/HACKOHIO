const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projectRoutes")
const registrationRoutes = require("./routes/registrationRoutes")
const recommendationRoutes = require("./routes/recommendations");


const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    //private session cookie(keeps logged in, shopping carts, progress in forms, etc)
    secret: process.env.SESSION_SECRET,
    //dont save unchanged session
    resave: false,
    //dont create session unnecessarily
    saveUninitialized: false,
    //keep sessions in MongoDB
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        crypto: {
            secret: process.env.SESSION_SECRET
        }
    }),
    cookie: {
        //session cookie inaccessible on client side
        httpOnly: true,
        //https in prod, http allowed during dev
        secure: process.env.NODE_ENV === "production",
        //session cookie lasts 24 hrs
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(express.json());


app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/registrations", registrationRoutes);

app.use("/api/recommendations", recommendationRoutes);

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "ProjectHub API is running"
    });
});

module.exports = app;