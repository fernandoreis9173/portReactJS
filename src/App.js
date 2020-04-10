import React, { Component } from 'react';
import Header from './components/Header';
import ContactBox from './components/Contact';
import Footer from './components/Footer';
import './App.css';

class App extends Component {
  render () {
    return (
      <div className="container">
        <Header/>
        <ContactBox/>
        <Footer/>
      </div>
    );
  }
}

export default App;