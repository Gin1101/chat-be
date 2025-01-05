import "./config.js"
import app from "#src/app.js"
import { connectDB } from "#src/database/mongoDB.js"

app.listen(process.env.SERVER_PORT, () => {
    connectDB();
})