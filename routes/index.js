const authRoutes = require("./authRoutes")

const configRoutes = (app) => {
    app.use("/auth", authRoutes)


    app.use("*", (req, res) => {
        return res.status(404).json({error: "Page not found"})
    })
}

module.exports = configRoutes