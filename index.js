/*constants*/
const express = require("express");
const bodyParser = require("body-parser");
const moment = require("moment");
const csvtojson = require("csvtojson");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const urlencodedParser = bodyParser.urlencoded({
    extended: false
});
let weightpr
app.post('/savedata', urlencodedParser, (req, res) => {
    let date = moment().format('YYYY-MM-DD');
    let str = `"${req.body.exercise}","${req.body.weight}","${date}"\n`;
    fs.appendFile(path.join(__dirname, 'data/databaze.csv'), str, function (err) {
        if (err) {
            console.error(err);
            return res.status(400).json({
                success: false,
                message: "Nastala chyba během ukládání souboru"
            });
        }
    });
    res.redirect(301, '/');
});
app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.get("/PRTracks", (req, res) => {
    csvtojson({
            headers: ['exercise', 'weight', 'date']
        }).fromFile(path.join(__dirname, 'data/databaze.csv'))
        .then(data => {
            console.log(data);
            res.render('index', {
                nadpis: "Personal records tracking",
                values: data,
                img: "../img/favicon.ico"
            });
        })
        .catch(err => {
            console.log(err);
            res.render('error', {
                nadpis: "Chyba v aplikaci",
                chyba: err
            });
        });
});
app.listen(port, () => {

    console.log(`Server naslouchá na portu ${port}`);
});