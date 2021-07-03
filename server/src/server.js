const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;
const Organization = require('./organization.js');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../app/build')));

// NOT DONE - PLACE HOLDER RETURNS ROOT
app.get('/api/user/login', (req, res) => {
  console.log('USING A NOT IMPLEMENTED LOGIN ENDPOINT');
  console.log('RETURNING DEFAULT VALUES');
  let username = 'root';
  let session_token = '1';
  // user class?
  // expects username and md5 hashed password
  // checks db for existence and correctness
  // if good - 200 and return user_id
  // ^^^ this is not a best practice but will be a place holder
  // some day make the return a session token that aligns with security practices
  // if bad - 401 and error "username or password is incorrect"
  console.log(`Login Initiated: ${username}`);
  let data = {
    user: username,
    token: session_token
  }
  res.status(200).json(data)
});

app.get('/api/org/list', (req, res) => {
  // return list of orgs
});

app.post('/api/org/new', async (req,res) => {
  const request = req.body.org;
  console.log('Creating Org:::::', request.name);
  let name = request.name;
  let ghAuthToken = request.ghAuthToken;
  let userID = request.userID;

  // Need error handling here if any of these required params aren't given

  let orgConfig = {
    name: name,
    token: ghAuthToken,
    userID: userID
  };
  let org = new Organization(orgConfig);

  try{
    // validate token and org
    let tokenVal = await org.validateToken(ghAuthToken);
    if (!tokenVal){
      console.log("User sent an invalid token");
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401
      return res.status(401).json("invalid token");
    }
    let orgVal = await org.validateOrg();
    if (!orgVal){
      console.log("User sent an invalid org");
      return res.status(404).json("invalid organization");
    }

    //check if org already exists in db
    let ghID = await org.getGithubID();
    let dup = await org.existsInDB(userID);
    if (dup){
      console.log("User sent a duplicate org");
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409
      return res.status(409).json("organization already exists in database");
    }
    
    await org.initializeDB();
    let data = {
      githubid: ghID
    }
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
    return res.status(201).json(data);
  } catch (error){
    console.log("ERROR: /api/org/new\n", error);
    return res.status(500);
  }

});

// REQUIRE USER_ID & ORG_NAME IN BODY
app.post('/api/org/scan', (req, res) => {
  const orgData = req.body.org;
  console.log('Scanning Org:::::', orgData.name);
  //scan org

  let name = orgData.name;
  let userID = orgData.userID;
  let orgConfig = {
    name: name,
    userID: userID
  }
  let org = new Organization(orgConfig);
  org.getFromDatabase();
  
  
  res.json("org scanned");
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});