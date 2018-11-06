import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { increment } from "./actions/counter";

class App extends Component {
  
  render() {
 
    return (
      <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
        { this.props.counter }
        </p>
        <p>
          <button onClick={this.props.increment}>++</button>
        </p>
      </div>
    );
  }
}

function mapStateToProps(state , ownProps ){
  return {
    counter: state.counter
  }
}

export default connect(mapStateToProps, { increment })(App);