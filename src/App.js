import React, { Component } from 'react';
import BarchartComponent from "./BarchartComponent";
import StackedBarchartComponent from "./StackedBarchartComponent";

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.fetchData(100); // 100 = maximum amount of items that can be fetched
  }

  /*
   Count the unique mutations for each type
   */
  countMutationTypes() {
    let data = this.state.data;
    let mutationTypes = new Set();
    let mutationsCounter = new Map();

    for(let i = 0; i < data.length; i++) {
      const item = data[i];

      if(!mutationsCounter.has(item.type)) {
        mutationsCounter.set(item.type, 0)
      }

      if(!mutationTypes.has(item.mutation)) {
        mutationTypes.add(item.mutation);
        let value = mutationsCounter.get(item.type);
        mutationsCounter.set(item.type, value + 1);
      }
    }

    let transformedData = [];

    for(let [key, value] of mutationsCounter) {
      transformedData.push({
        "type": key,
        "count": value
      })
    }

    return transformedData;
  }

  mutationsAcrossChromosomes() {
    let data = this.state.data;
    let chromosomes = new Map();

    for(let i = 0; i < data.length; i++) {
      const item = data[i];

      if(!chromosomes.has(item.chromosome)) {
        chromosomes.set(item.chromosome, new Map());
      }




    }
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
        this.setState( { data: data.hits } );
    });
  }

  render() {
    return (
      <div>
        <BarchartComponent id="type-overview-chart" data={ this.countMutationTypes(this.state.data) } />
        <StackedBarchartComponent id="type-overview-chart" data={ this.countMutationTypes(this.state.data) } />
      </div>
    );
  }
}

export default App;
