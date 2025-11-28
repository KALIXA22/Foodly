const express=require("express");
const dotenv=require('dotenv').config();
const app=express();
const cors=require('cors');
const connectDb=require("./config/connectionDb")
connectDb();


const PORT=process.env.PORT || 3000;
app.use(express.json())
app.use(cors());
app.use(express.static("public"));
app.use("/",require("./routes/user"));
app.use("/recipe",require("./routes/recipe"));

app.listen(PORT,(err)=>{
    console.log(`app is listening to port ${PORT}`)
})
