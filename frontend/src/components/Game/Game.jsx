// React core
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Game subcomponents
import { GameInfo, GameMat, PlayerProfile, Resolution } from './components';
// Services and redux action
import { UserAction } from 'actions';
import { ApiService } from 'services';

class Game extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // State for showing/hiding components when the API (blockchain) request is loading
    this.state = {
      loading: true,
    };
    // Bind functions
    this.loadUser = this.loadUser.bind(this);
    this.handleStartGame = this.handleStartGame.bind(this);
    this.handlePlayCard = this.handlePlayCard.bind(this);
    this.handleNextRound = this.handleNextRound.bind(this);
    this.handleEndGame = this.handleEndGame.bind(this);
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
      // Set the loading state to false for displaying the app
      this.setState({ loading: false });
    });
  }

  handleStartGame() {
    // Send a request to API (blockchain) to start game
    // And call `loadUser` again for react to render latest game status to UI
    return ApiService.startGame().then(()=>{
      return this.loadUser();
    });
  }

  handlePlayCard(cardIdx) {
    // Extract `user.game` of `UserReducer` from redux
    const { user: { game } } = this.props;
    // If it is an empty card, not going to do anything
    if (game.hand_player[cardIdx] === 0) {
      return;
    }
    // Show the loading indicator if the connection took too long
    this.setState({ loading: true });
    // Send a request to API (blockchain) to play card with card index
    // And call `loadUser` again for react to render latest game status to UI
    return ApiService.playCard(cardIdx).then(()=>{
      return this.loadUser();
    });
  }

  handleNextRound() {
    // Send a request to API (blockchain) to trigger next round
    // And call `loadUser` again for react to render latest game status to UI
    return ApiService.nextRound().then(()=>{
      return this.loadUser();
    });
  }

  handleEndGame() {
    // Send a request to API (blockchain) to end the game
    // And call `loadUser` again for react to render latest game status to UI
    return ApiService.endGame().then(()=>{
      return this.loadUser();
    });
  }

  render() {
    // Extract data from state and user data of `UserReducer` from redux
    const { loading } = this.state;
    const { user: { name, win_count, lost_count, game } } = this.props;

    // Flag to indicate if the game has started or not
    // By checking if the deckCard of AI is still 17 (max card)
    const isGameStarted = game && game.deck_ai.length !== 17;

    // If game hasn't started, display `PlayerProfile`
    // If game has started, display `GameMat`, `Resolution`, `Info` screen
    return (
      <section className={`Game${ (loading ? " loading" : "") }`}>
        { !isGameStarted ?
            <PlayerProfile
              name={ name }
              winCount={ win_count }
              lostCount={ lost_count }
              onLogout={ this.handleLogout }
              onStartGame={ this.handleStartGame }
            />
          :
            <div className="container">
              <GameMat
                deckCardCount={ game.deck_ai.length }
                aiLife={ game.life_ai }
                aiHandCards={ game.hand_ai }
                aiName="COMPUTER"
                playerLife={ game.life_player }
                playerHandCards={ game.hand_player }
                playerName={ name }
                onPlayCard={ this.handlePlayCard }
              />
              <Resolution
                status={ game.status }
                aiCard={ game.selected_card_ai }
                aiName="COMPUTER"
                aiLost={ game.life_lost_ai }
                playerCard={ game.selected_card_player }
                playerName={ name }
                playerLost={ game.life_lost_player }
                onNextRound={ this.handleNextRound }
                onEndGame={ this.handleEndGame }
              />
              <GameInfo
                deckCardCount={ game.deck_ai.length }
                handCardCount={ game.hand_ai.filter( x => x > 0 ).length }
                onEndGame={ this.handleEndGame }
              />
            </div>
        }
        {
          isGameStarted && loading &&
          <div className="spinner">
            <div className="image"></div>
            <div className="circles">
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
              <div className="circle">
                <div className="inner"></div>
              </div>
            </div>
          </div>
        }
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
