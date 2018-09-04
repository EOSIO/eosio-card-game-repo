// React core
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Components
import { Game, Login } from 'components';

class App extends Component {

  render() {
    // Extract data from state and props (`user` is from redux)
    const { user: { name } } = this.props;

    // If the username is set in redux, display the Game component
    // If the username is NOT set in redux, display the Login component
    return (
      <div className="App">
        { name && <Game /> }
        { !name && <Login /> }
      </div>
    );
  }

}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Export a redux connected component
export default connect(mapStateToProps)(App);
