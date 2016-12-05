import React, { Component } from 'react';

class BarchartComponent extends Component {

  render() {
    console.log("DATA");
    console.log(this.props.data);

    return (
      <svg id={ this.props.id }>

      </svg>
    )
  }
}

export default BarchartComponent;