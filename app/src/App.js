import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import { Orgs } from './components/Orgs'
import AddOrg from './components/AddOrg'
import { getAllOrgs, addOrg, scanOrg } from './api/orgApi'
import ScanOrg from './components/ScanOrg';

class App extends Component {

  state = {
    org: {
      userID: '1',  //////////////////////// STATIC DEFAULT USER ROOT
    },
    toScanOrg: {
      userID: '1',
    },
    // leaving these here to avoid errors while im converting
    orgs: [],
    numberOfOrgs: 0
  }

  addOrg = (e) => {
      addOrg(this.state.org)
        .then(response => {
          // this isn't working bc .json() just gives the body
          // need to use a then to async get the body after getting the status
          // https://developer.mozilla.org/en-US/docs/Web/API/Response
          if (response.status !== 201){
            alert(response);
          }
          console.log(response);
      }); 
  }

  scanOrg = (e) => {
    scanOrg(this.state.toScanOrg)
      .then(response => {
        console.log(response);
    });
}

  getAllOrgs = () => {
    getAllOrgs()
      .then(orgs => {
        console.log(orgs)
        this.setState({orgs: orgs, numberOfOrgs: orgs.length})
      });
  }

  onChangeForm = (e) => {
      let org = this.state.org
      if (e.target.name === 'inputOrg') {
          org.name = e.target.value;
      } else if (e.target.name === 'inputToken') {
          org.ghAuthToken = e.target.value;
      }
      console.log("ORG: ",org)
      this.setState({org})
  }

  onChangeFormScan = (e) => {
    let toScanOrg = this.state.toScanOrg
    if (e.target.name === 'inputOrgScan') {
        toScanOrg.name = e.target.value;
    }
    console.log("SCAN ORG: ",toScanOrg)
    this.setState({toScanOrg})
}

  render() {
    
    return (
      <div className="App">
        <Header></Header>
        <AddOrg 
          org={this.state.org}
          onChangeForm={this.onChangeForm}
          addOrg={this.addOrg}
          >
        </AddOrg>
        <ScanOrg
          org={this.state.toScanOrg}
          onChangeForm={this.onChangeFormScan}
          scanOrg={this.scanOrg}
        >
        </ScanOrg>
        <div className="row mrgnbtm">
          <Orgs 
            orgs={this.state.orgs}>
          </Orgs>
        </div>
      </div>
    );
  }
}

export default App;