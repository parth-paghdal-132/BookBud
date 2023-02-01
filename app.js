const express = require("express")
const configRoutes = require("./routes")
const exphbs = require("express-handlebars")
const Handlebars = require("handlebars")
const session = require("express-session")

const public = express.static(__dirname + "/public")
const app = express()

app.use("/public", public)

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const handlerbarInstance = exphbs.create({
	defaultLayout: "main"
})

app.engine('handlebars', handlerbarInstance.engine)
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(
  	session({
		name: "AuthCookie",
		secret: "some secret string!",
		resave: false,
		saveUninitialized: true,
  	})
);

configRoutes(app)

app.listen(3000, () => {
  console.log("Your server is running at http://localhost:3000");
});
