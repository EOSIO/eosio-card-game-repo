import React from 'react';

const Button = ({ ...props }) => {
  const { className, type, style, onClick, children } = props;
  return (
    <button
      className={`Button${ className ? ' ' + className : '' }`}
      { ...{ type, style, onClick } }
    >{ children }</button>
  );
}

export default Button;
