import dotenv from "dotenv"

import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})



connectDB()
.then(() => {
    app.on('error', (error) => {
        console.log("Error while starting the server", error);
        throw error
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on PORT: ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MONGO db connection faild !!! ", error);
    process.exit(1);
})