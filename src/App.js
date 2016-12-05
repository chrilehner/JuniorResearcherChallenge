import React, { Component } from 'react';
import BarchartComponent from "./BarchartComponent";

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.fetchData(100); // 100 = maximum amount of items that can be fetched
  }

  fetchData(batchSize) {
    const options = {
      mode: "cors"
    };

    fetch(
      `https://dcc.icgc.org/api/v1/projects/GBM-US/mutations?field=id,mutation,type,chromosome,start,end&size=${batchSize}&order=desc`,
      options
    )
      .then((response) => {
        return response.json();
      }).then((data) => {
        console.log(data);
        this.setState( { data: data.hits } );
    });
  }

  render() {
    return (
      <div>
        <BarchartComponent id="type-overview-chart" data={ this.state.data } />
      </div>
    );
  }
}

export default App;
