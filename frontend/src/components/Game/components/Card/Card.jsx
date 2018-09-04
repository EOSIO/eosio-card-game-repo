import React, { Component } from 'react';

// Card dictionary from smart contract
// { [cardType, cardPower], ... }
const cardDict = [
  [0, 0], // empty card (for the case the card is played or empty selected card)
  [1, 1], [1, 1],
  [1, 2], [1, 2],
  [1, 3],
  [2, 1], [2, 1],
  [2, 2], [2, 2],
  [2, 3],
  [3, 1], [3, 1],
  [3, 2], [3, 2],
  [3, 3],
  [4, 3],
  [5, 0]
];

class Card extends Component {
  render() {
    // Extract card index (cardId) and onClick event function from props
    const { cardId, onClick } = this.props;
    // If it is not an empty card and onClick is set, set Tag as <a>, <div> otherwise
    const Tag = cardId !== 0 && onClick ? `a` : `span`;
    // Determine the card element
    let cardType = "";
    switch (cardDict[cardId][0]) {
      case 1:
        cardType = "FIRE";
        break;
      case 2:
        cardType = "WOOD";
        break;
      case 3:
        cardType = "WATER";
        break;
      case 4:
      case 5:
        cardType = "SPECIAL";
        break;
      default:
        cardType = "EMPTY";
    }
    return (
      <Tag
        className={ `Card ${ "type" + cardDict[cardId][0] } ${ "card" + cardId }` }
        onClick={ onClick }>
        <span className="type">{ cardType }</span>
        <span className="power">{ cardId !== 0 && cardDict[cardId][1] }</span>
      </Tag>
    )
  }
}

export default Card;
