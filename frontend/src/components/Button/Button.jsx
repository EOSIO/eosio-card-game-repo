import React, { Component } from 'react';

class Button extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    // Component state setup
    this.state = {
      loading: false,
    };
    // Bind functions
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { onClick } = this.props;
    // Show the loading indicator in case the action to be performed takes too long
    this.setState({ loading: true });

    // If the prop onClick is a function, invoke it and stores its return value in ``promise``
    // If the prop onClick is NOT a function, the value of ``promise`` will be false
    const promise = typeof onClick === "function" && onClick();

    // If ``promise`` is a function (a Promise), invoke setState after it has been resolved.
    if (promise && typeof promise.then === "function") {
      return promise.then(() => {
        this.isComponentMounted && this.setState({ loading: false });
      });
    }
    // Otherwise, just invoke setState directly
    this.isComponentMounted && this.setState({ loading: false });
  }

  componentDidMount() {
    this.isComponentMounted = true;
  }

  componentWillUnmount() {
    this.isComponentMounted = false;
  }

  render() {
    const { className, type, style, children } = this.props;
    let { loading } = this.state;
    // Enable the loading CSS class if either the private state attribute `loading`
    // or the props `loading` is true
    loading = loading || this.props.loading;
    return (
      <button
        className={`Button${ className ? ' ' + className : '' }${ loading ? ' loading' : '' }`}
        onClick={ this.handleClick }
        { ...{ type, style } }
      >{ children }</button>
    );
  }

}

export default Button;
