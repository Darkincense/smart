import React, { Component } from 'react';
import Header from './components/Header';
import Home from './components/Home';

class App extends Component {
  constructor() {
    super();
    this.state ={
      homeLink: "Header",
      homeMounted: true
    }
  }
  onGreet(age) {
    alert(age)
  }
  onChangeHomeLink(newName) {
    this.setState({
      homeLink:newName
    })
  }
  onChangeHomeMounted() {
    this.setState({
      homeMounted: !this.state.homeMounted
    })
  }
  render() {
    const user = {
      name: "yue",
      hobbies: ["sports","reading"]
    }
    let homeCmp= "";
    if (this.state.homeMounted) {
      homeCmp = (
        <Home name={"niu"}
        age={12}
        user={user}
        greet={this.onGreet}
        changeLink={this.onChangeHomeLink.bind(this)}
        initialName={this.state.homeLink} >
      <p>I am a child</p>
      </Home>
      )

     }
    return (
      <div className="container">
         <div className="row">
              <div className="col-xs-1  col-xs-offset-11">
               <Header homeLink={this.state.homeLink}/>
              </div>
          </div>
          <div className="row">
              <div className="col-xs-1  col-xs-offset-11">
                <h1>Hello world!</h1>
              </div>
          </div>
          <div className="row">
              <div className="col-xs-1  col-xs-offset-11">
                {homeCmp}
              </div>
          </div>
          <hr />
          <div className="row">
          <div className="col-xs-1 col-xs-offset-11">
            <button onClick={this.onChangeHomeMounted.bind(this)} className="btn btn-primary">(Un)mount Home Component</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
