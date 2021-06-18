const { Octokit } = require("@octokit/rest");
const mysql = require('mysql');
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

app.post('/api/scan', (req, res) => {
  const org = req.body.org;
  console.log('Creating Org:::::', org);
  //create new org entry in db
  let name = org.name;
  let token = org.token;
  curr = new Organization(name, token);
  curr.createDBEntry();

  console.log('Scanning Org:::::', org);
  //scan org
  
  res.json("user added");
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

async function scanOrg(org){
  const octokit = new Octokit({
    auth: 'token ' + process.env.GITHUB_API_TOKEN
  });

async function createOrg(org){

}

}