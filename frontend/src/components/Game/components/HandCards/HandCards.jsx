import React, { Component } from 'react';
// Game subcomponents
import { Card } from "../";

class HandCards extends Component {
  render() {
    // Extract data and event functions from props
    const { className, cards, onPlayCard } = this.props;

    // function in render for generating `Card`s
    const generateCards = cards => {
      let elems = [];
      // Hard coded 4 as the max of loop as every user has 4 hand cards
      for (let i = 0; i < 4; ++i) {
        // Prepare properties for `Card`
        let cardProperties = {
          key: i,
          cardId: cards[i]
        };
        // If onPlayCard function is set, bind it with the onClick event of `Card`
        if (onPlayCard) {
          cardProperties.onClick = () => { onPlayCard(i) };
        }
        // Put the `Card` to `elems` array
        elems.push(<Card { ...cardProperties } />);
      }
      return elems;
    };

    return (
      <div className={`HandCards${ className ? ' ' + className : '' }`}>
        { generateCards(cards) }
      </div>
    )
  }
}

export default HandCards;
