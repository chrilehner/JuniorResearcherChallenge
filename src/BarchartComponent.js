import { Component } from 'react';
import * as d3 from "d3";

class BarchartComponent extends Component {

  render() {

    const mutationsCounter = this.props.data;

    const chartWidth = document.documentElement.clientWidth / 2 - 100;
    const chartHeight = document.documentElement.clientHeight * 0.8;

    const margin = { top: 20, right: 30, bottom: 30, left: 40} ;
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    // flatten mutationsCounter to only get the types inside an array
    let types = mutationsCounter.reduce((prev, cur) => {
      prev.push(cur.type);
      return prev;
    }, []);

    console.log("TYPES", types);

    const xScale = d3.scaleBand();
    const yScale = d3.scaleLinear();

    xScale.domain(types).range([margin.left, width]).paddingInner(0.1).paddingOuter(0.5);
    yScale.domain([d3.max(mutationsCounter, (d) => { return d.count }), 0]).range([0, height]);

    let svg = d3.select("#root").append("svg")
      .attr("class", this.props.id)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    let axes = svg.append("g").classed("axes", true);

    let yAxis = d3.axisLeft(yScale);
    let xAxis = d3.axisBottom(xScale)

    axes.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    axes.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height + margin.top})`)
      .call(xAxis);


    svg.selectAll(".bar").data(mutationsCounter).enter().append("rect")
      .attr("class", "bar")
      .attr("y", (d) => { return yScale(d.count) + margin.top })
      .attr("height", (d) => { return height - yScale(d.count); })
      .attr("width", xScale.bandwidth())
      .attr("transform", (d, i) => {
        return `translate(
          ${ xScale(d.type) }, 0
         )`;
      })
      .attr("fill", "tomato")
    .on("click", (d, i) => {
      this.props.click(d.type);
    });

    return null;
  }
}

export default BarchartComponent;