require('dotenv').config();

const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");

const app = express();
app.set('view engine', 'ejs');

app.use(express.static('static'));
// by using the bodyparser we are able to parse http request that we get
// by using urlencoded we can get form data
app.use(bodyparser.urlencoded({ extended: true }));

// -------------------------------------

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/back", function (req, res) {
  res.redirect('/');
});

app.post("/", function (req, res) {
 
  var usercity = req.body.city;

  api_id = process.env.API_KEY

  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + usercity + "&appid="+ api_id + "&units=metric";

  https.get(url, function (response) {
    response.on("data", function (data) {
      var weatherdata = JSON.parse(data);

      var weather = weatherdata.weather[0]["main"];
      var temp = weatherdata.main['temp'];
      var icon = weatherdata.weather[0]["icon"];
      const img_icon = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

      res.render('showweather', {temprature:temp, weather:weather, image:img_icon, city:usercity})
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is on 3000 port");
});
