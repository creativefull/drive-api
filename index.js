const express = require('express'),
    app = express(),
    request = require('request')

const drive = require('./drive')

app.get("/", (req,res,next) => {
    res.send("Hello api")
})
app.get("/get/:id", drive.generate)

app.listen(8089, () => console.log("Application listen on port 8089"))