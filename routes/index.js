const authRoutes = require("./authRoutes")
const mainRoutes = require("./mainRoutes")

const configRoutes = (app) => {
    app.use("/", mainRoutes)
    app.use("/auth", authRoutes)


    app.use("*", (req, res) => {
        return res.status(404).json({error: "Page not found"})
    })
}

module.exports = configRoutes