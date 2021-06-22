import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import { Users } from './components/Users'
import ScanOrg from './components/ScanOrg'
import { getAllOrgs, scanOrg } from './services/OrgService'

class App extends Component {

  state = {
    org: {},
    // leaving these here to avoid errors while im converting
    orgs: [],
    numberOfOrgs: 0
  }

  scanOrg = (e) => {
      scanOrg(this.state.org)
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
          org.token = e.target.value;
      }
      console.log("ORG: ",org)
      this.setState({org})
  }

  render() {
    
    return (
      <div className="App">
        <Header></Header>
        <ScanOrg 
          org={this.state.org}
          onChangeForm={this.onChangeForm}
          scanOrg={this.scanOrg}
          >
        </ScanOrg>
        <div className="row mrgnbtm">
          <Users 
            users={this.state.users}>
          </Users>
        </div>
      </div>
    );
  }
}

export default App;