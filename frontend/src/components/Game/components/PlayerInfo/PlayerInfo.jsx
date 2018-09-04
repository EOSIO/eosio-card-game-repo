import React, { Component } from 'react';

class PlayerInfo extends Component {
  render() {
    // Extract data from props
    const { className, name, life } = this.props;

    // Display name of the Player / AI according to props,
    //         hearts, by generateHearts function
    //         life in text, show 0 if it is negative
    return (
      <div className={`PlayerInfo${ className ? ' ' + className : '' }`}>
        <div className="name">{ name }</div>
        <div className={`life life${ life }`}></div>
        <div className="lifepoints">{ life < 0 ? 0 : life }/5</div>
      </div>
    )
  }
}

export default PlayerInfo;
