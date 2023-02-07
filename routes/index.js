const authRoutes = require("./authRoutes")
const mainRoutes = require("./mainRoutes")
const bookInfoRoutes = require("./bookInfoRoutes")

const configRoutes = (app) => {
    app.use("/", mainRoutes)
    app.use("/auth", authRoutes)
    app.use("/bookinfo", bookInfoRoutes)

    app.use("*", (req, res) => {
        return res.status(404).json({error: "Page not found"})
    })
}

module.exports = configRoutes