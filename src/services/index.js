const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req,res)=>{
    res.send("PU-GPT Backend Running 🚀");
});


app.post("/chat",(req,res)=>{

    const userMessage = req.body.message;

    res.json({
        reply:
        "PU-GPT received your question: " + userMessage
    });

});


app.listen(5000,()=>{

    console.log("PU-GPT Server running on port 5000");

});