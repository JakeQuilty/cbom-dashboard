const { Octokit } = require("@octokit/rest");
const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;
const Organization = require('./organization.js');

// place holder for the data
const users = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../app/build')));

app.get('/api/users', (req, res) => {
  console.log('api/users called!')
  res.json(users);
});

app.post('/api/org/new'), (req,res) => {
  const orgData = req.body.org;
  console.log('Creating Org:::::', orgData.name);
  var name = orgData.name;
  var token = orgData.token;
  var org = new Organization(name, token);

  // validate token and org
  var tokenVal = await org.validateToken();
  if (!tokenVal){
    console.log("User sent an invalid token");
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/406
    res.status(406).send("invalid token");

  }
  var orgVal = await org.validateOrg();
  if (!orgVal){
      console.log("User sent an invalid org");
      res.status(406).send("invalid org");
  }

  //check if org already exists in db
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
  // res.status(409);

  //create new org entry in db
  org.initializeDB();
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  res.status(201);
}

app.post('/api/org/scan', (req, res) => {

  console.log('Scanning Org:::::', org.name);
  //scan org
  
  res.json("org scanned");
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});