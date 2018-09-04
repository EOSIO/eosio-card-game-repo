import React, { Component } from 'react';
// Components
import { Button } from 'components';

class Info extends Component {
  render() {
    // Extract data and event functions from props
    const { className, deckCardCount, handCardCount, onEndGame } = this.props;
    // Display:
    // Round number: 18 <-- ((max deck = 17) + 1) - Deck Cards - Hand Cards
    // Button to end the current game
    return (
      <div className={`Info${ className ? ' ' + className : '' }`}>
        { <p>ROUND <span className="round-number">{ 18 - deckCardCount - handCardCount }/17</span></p> }
        <div><Button onClick={ onEndGame } className="small red">QUIT</Button></div>
      </div>
    )
  }
}

export default Info;
