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

app.post('/api/org/new', async (req,res) => {
  const orgData = req.body.org;
  console.log('Creating Org:::::', orgData.name);
  let name = orgData.name;
  let token = orgData.token;
  let org = new Organization(name, token);

  // validate token and org
  let tokenVal = await org.validateToken();
  let orgVal = await org.validateOrg();

  if (!tokenVal){
    console.log("User sent an invalid token");
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
    res.status(401).json("invalid token");
  }
  else if (!orgVal){
    console.log("User sent an invalid org");
    res.status(404).json("invalid organization");
  }
  else {
    //check if org already exists in db
    let ghID = await org.getGithubID();
    let dup = await org.isDuplicate(ghID);
    if (dup){
      console.log("User sent a duplicate org");
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
      res.status(409).json("organization already exists in database");
    }
    else {
      await org.initializeDB();

      let data = {
        githubid: ghID
      }
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
      res.status(201).json(data);
    }
  }
});

app.post('/api/org/scan', (req, res) => {
  const orgData = req.body.org;
  console.log('Scanning Org:::::', orgData.name);
  //scan org
  
  res.json("org scanned");
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});