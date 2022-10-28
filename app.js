import express from "express";
import bodyParser from "body-parser";
import usersRounter from "./apps/user.js";
import postRounter from "./apps/post.js"

const app = express();

const PORT = 4000; 
app.use(bodyParser.json());
app.use("/users",usersRounter)

app.use("/posts",postRounter)

app.listen(PORT, () => { 
    console.log(`Server start at Port ${PORT}`);
 });