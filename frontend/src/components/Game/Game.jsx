// React core
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Game subcomponents
import { PlayerProfile } from './components';
// Services and redux action
import { UserAction } from 'actions';
import { ApiService } from 'services';

class Game extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // Bind functions
    this.loadUser = this.loadUser.bind(this);
    // Call `loadUser` before mounting the app
    this.loadUser();
  }

  // Get latest user object from blockchain
  loadUser() {
    // Extract `setUser` of `UserAction` and `user.name` of UserReducer from redux
    const { setUser, user: { name } } = this.props;
    // Send request the blockchain by calling the ApiService,
    // Get the user object and store the `win_count`, `lost_count` and `game_data` object
    return ApiService.getUserByName(name).then(user => {
      setUser({
        win_count: user.win_count,
        lost_count: user.lost_count,
        game: user.game_data,
      });
    });
  }

  render() {
    // Extract data from user data of `UserReducer` from redux
    const { user: { name, win_count, lost_count } } = this.props;

    return (
      <section className="Game">
        <PlayerProfile
          name={ name }
          winCount={ win_count }
          lostCount={ lost_count }
        />
      </section>
    )
  }

}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(Game);
