import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { increment, increment_ASYNC } from "./actions/counter";
import { get_user } from "./actions/user";

class App extends Component {
  
  render() {
 
    return (
      <div className="App">
        <p className="App-intro">
        { this.props.counter }
        </p>
        <p>
          <button onClick={this.props.increment}>+</button>
          <br/>
          <button onClick={this.props.increment_ASYNC}>Async +</button>
          <br/>
          <button onClick={this.props.get_user}>GET USER +</button>
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

export default connect(mapStateToProps, { increment,increment_ASYNC, get_user })(App);