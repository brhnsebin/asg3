// 1. library/modules import/load
const usersRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const mongoose = require('mongoose');
const express = require('express');
const expressHbs = require('express-handlebars');
const app = express();
const http = require('http');
const path = require('path');
const User = require('./models/user');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const server = http.createServer(app);
const process = require('process');

const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');
const morgan = require('morgan');
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flag:'a'});
require('dotenv').config();

const dbUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.n7dam.mongodb.net/${process.env.MONGO_DB}`; // 2. Add Your database url
// 3. create the session store
const store = new MongoDBStore({
    uri: dbUrl,
    collection: 'sessions'
})

app.engine(
    "hbs",
    expressHbs({
        extname: ".hbs",
        layoutsDir: "views/layout",
        defaultLayout: "main",
        partialsDir: __dirname + "/views/partials",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// 4. Add the session middleweare
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use((req, res, next) => {

    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        }).catch(err => console.log(err));
    });
app.use(authRoutes);
app.use(usersRoutes);
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});



app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: logStream }))
// 5.connect to database and start the server
const port = process.env.PORT || 3000;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true  }).then(() =>{
    console.log('Connected to DB')
    app.listen({port});
}).catch(err => console.log(err));


