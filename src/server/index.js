require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls

// example API call
app.get('/marsAPI', async (req, res) => {
    try {
        let name = req.get('roverName');
        let image = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?sol=10&api_key=${process.env.API_KEY}`)
            .then(res => res.json());
        res.send({ image });
    } catch (err) {
        console.log('error:', err);
    }
})
/*
app.get("/rover/curiosity", async (req, res) => {
  try {
	let ROVERURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/`
    let data = await fetch(
      `${ROVERURL}curiosity/photos?earth_date=2020-09-13&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
  } catch (err) {
    res.send("err");
  }
});

app.get("/rover/opportunity", async (req, res) => {
  try {
	let ROVERURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/`
    let data = await fetch(
      `${ROVERURL}opportunity/photos?earth_date=2018-06-11&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
  } catch (err) {
    res.send("err");
  }
});

app.get("/rover/spirit", async (req, res) => {
  try {
	let ROVERURL = `https://api.nasa.gov/mars-photos/api/v1/rovers/`
    let data = await fetch(
      `${ROVERURL}spirit/photos?earth_date=2010-03-21&api_key=${process.env.API_KEY}`
    ).then((res) => res.json());
    res.send({ data });
  } catch (err) {
    res.send("err");
  }
});
*/
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))