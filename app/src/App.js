import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import { Users } from './components/Users'
import ScanOrg from './components/ScanOrg'
import { getAllUsers, scanOrg } from './services/UserService'

class App extends Component {

  state = {
    org: {},
    // leaving these here to avoid errors while im converting
    user: {},
    users: [],
    numberOfUsers: 0
  }

  scanOrg = (e) => {
      scanOrg(this.state.user)
        .then(response => {
          console.log(response);
      });
  }

  getAllUsers = () => {
    getAllUsers()
      .then(users => {
        console.log(users)
        this.setState({users: users, numberOfUsers: users.length})
      });
  }

  onChangeForm = (e) => {
      let org = this.state.org
      if (e.target.name === 'inputOrg') {
          org.firstName = e.target.value;
      } else if (e.target.name === 'inputToken') {
          org.lastName = e.target.value;
      }
      this.setState({org})
  }

  render() {
    
    return (
      <div className="App">
        <Header></Header>
        <ScanOrg 
          user={this.state.user}
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