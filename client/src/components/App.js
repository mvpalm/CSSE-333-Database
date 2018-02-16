import React, { Component } from 'react';
import NavBar from './navbar/NavBar';
import FlashMessagesList from './flash/FlashMessagesList';

class App extends Component {

  render() {
    return (
      <div className="container-fluid">
        <NavBar />
        <FlashMessagesList />
        {this.props.children}
      </div>
    )
  }

}

export default App
