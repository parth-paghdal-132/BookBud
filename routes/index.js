const authRoutes = require("./authRoutes")

const configRoutes = (app) => {
    app.use("/login", authRoutes)
    app.use("/signup", authRoutes)


    app.use("*", (req, res) => {
        return res.status(404).json({error: "Page not found"})
    })
}

module.exports = configRoutes