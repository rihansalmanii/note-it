const connectDB = require("./db/db")
const app = require("./app")


connectDB()

app.listen(3000, () => {
    console.log("app is listening at port 3000")
})
