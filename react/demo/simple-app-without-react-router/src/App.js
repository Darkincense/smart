import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/" component={Home} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/contact/:id" component={Contact} />
          <Route path="/about" component={About} />
          <Footer />
        </div>
      </Router>

    );
  }
}

export default App;
