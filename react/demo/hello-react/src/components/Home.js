import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      age: props.age,
      status: 0,
      homeLink:props.initialName
    }

    setTimeout(() => {
      this.setState({
        status: 1
      })
    }, 3000)
    console.log('Constructor');

    this.MakeOder = this.MakeOder.bind(this)
  }
  handleGreet() {
    this.props.greet(this.state.age)
  }
  onChangeLinkName() {
    this.props.changeLink(this.state.homeLink)
  }
  onhandleChange(event) {
    this.setState({
      homeLink:event.target.value
    })
  }
  MakeOder() {
    this.setState({
      age: this.state.age + 3
    })
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Component should update', nextProps, nextState);
    if (nextState.status === 1) {
      return false;
    }
    return true;
  }

  componentWillMount() {
    console.log("Component will mount");
  }

  componentDidMount() {
    console.log("Component did mount");
  }

  componentWillReceiveProps(nextProps) {
    console.log('Component will receive props', nextProps);
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('Component will update', nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Component did update', prevProps, prevState);
  }

  componentWillUnmount() {
    console.log('Component will unmount');
  }

  render() {
    console.log('render');
    console.log(this.props)
    return (
      <div className="container">
          <div className="row">
              <div className="col-xs-1  col-xs-offset-11">
                <h1>Home</h1>
                <div> your name is {this.props.name}, your age is {this.state.age}</div>
                <p>Status: {this.state.status}</p>
                <button onClick={this.MakeOder} className="btn btn-primary">make me older</button>
                <hr />

                <button onClick={this.handleGreet.bind(this)} className="btn btn-primary">Greet</button>

                <hr />

                <input
                 type="text" 
                 defaultValue = {this.props.initialName}
                 value = {this.state.initialName}
                 onChange={(event)=>this.onhandleChange(event)}
                 />
                <button onClick={this.onChangeLinkName.bind(this)} className="btn btn-primary">Change Header</button>
              
                <div>
                  <h4>hobbies</h4>
                    <ul>
                      {this.props.user.hobbies.map((hobby,i)=><li key={i}>{hobby}</li>)}
                    </ul>
                    {this.props.children}
                </div>
              </div>
          </div>
      </div>
    );
  }
}


Home.propTypes = {
  name: PropTypes.string,
  age: PropTypes.number,
  user: PropTypes.object,
  children: PropTypes.element.isRequired,
  greet: PropTypes.func,
  initialName:PropTypes.string
};