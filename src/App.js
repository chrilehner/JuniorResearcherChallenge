import React, { Component } from 'react';
import BarchartComponent from "./BarchartComponent";
import StackedBarchartComponent from "./StackedBarchartComponent";

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      mutationTypes: [],
      chromosomes: new Map()
    };

    this.fetchData(100); // 100 = maximum amount of items that can be fetched
  }

  /*
   Count the unique mutations for each type
   */
  countMutationTypes(d, filter) {
    let data = d || this.state.data;

    let mutationTypes = new Set();
    let mutationsCounter = new Map();

    if(filter) {
      data = filter(data);
    }

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

  mutationsAcrossChromosomes(d, filter) {
    let data = d || this.state.data;

    if(filter) {
      data = filter(data);
    }

    const mutationTypes = this.getMutationTypes(d);
    let chromosomes = new Map();

    for(let i = 0; i < data.length; i++) {
      const item = data[i];


      if(!chromosomes.has(item.chromosome)) {
        chromosomes.set(item.chromosome, {});
        chromosomes.get(item.chromosome)["chromosome"] = item.chromosome;
        chromosomes.get(item.chromosome)["total"] = 0;

        mutationTypes.forEach((type) => {
          chromosomes.get(item.chromosome)[type] = 0;
        });
      }

      chromosomes.get(item.chromosome)["total"] += 1;

      chromosomes.get(item.chromosome)[item.mutation] += 1;
    }

    // compute fraction of mutations in chromosomes
    chromosomes.forEach((obj) => {
      for(let key in obj) {
        if(key !== "total" && key !== "chromosome") {
          obj[key] /= obj["total"];
        }
      }
    });

    return chromosomes;
  }

  getMutationTypes(d) {
    const data = d || this.state.data;
    let mutationTypes = new Set();

    for(let i = 0; i < data.length; i++) {
      mutationTypes.add(data[i].mutation);
    }

    return mutationTypes;
  }

  getChromosomes(d) {
    const data = d || this.state.data;
    let chromosomes = new Set();

    for(let i = 0; i < data.length; i++) {
      chromosomes.add(data[i].chromosome);
    }

    return chromosomes;
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
    })
    .then((data) => {
      this.setState( {
        data: data.hits,
        mutationTypes: this.countMutationTypes(data.hits),
        chromosomes: this.mutationsAcrossChromosomes(data.hits)
      } );
    });
  }

  clickEvent(cb) {
    this.setState({
      mutationTypes: this.countMutationTypes(null, cb),
      chromosomes: this.mutationsAcrossChromosomes(null, cb)
    });
  }

  removeFilters() {
    this.setState({
      mutationTypes: this.countMutationTypes(),
      chromosomes: this.mutationsAcrossChromosomes()
    });
  }

  render() {
    let node = document.getElementById("container");

    if(node) {
      while (node.childElementCount > 1) {
        if(node.lastChild.tagName.toLowerCase() !== "button") {
          node.removeChild(node.lastChild);
        }
      }
    }

    return (
      <div id="container">
        <div><button onClick={ this.removeFilters.bind(this) }>Remove Filters</button></div>
        <BarchartComponent id="type-overview-chart" data={ this.state.mutationTypes } click={ this.clickEvent.bind(this) } />
        <StackedBarchartComponent id="chromosome-overview-chart" data={ this.state.chromosomes } mutations={ this.getMutationTypes() } chromosomes={ this.getChromosomes() } click={ this.clickEvent.bind(this) } />
      </div>
    );
  }
}

export default App;
