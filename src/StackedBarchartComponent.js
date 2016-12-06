import { Component } from 'react';
import * as d3 from "d3";

class StackedBarchartComponent extends Component {

  render() {

    // flatten data to get array of objects (for D3)
    const dataEntries = this.props.data.entries();
    let chromosomeCounter = [];
    for(let entry of dataEntries) {
      chromosomeCounter.push(entry[1]);
    }
    const mutations = [...this.props.mutations];
    const chromosomes = [...this.props.chromosomes];

    const chartWidth = document.documentElement.clientWidth / 2 + 100;
    const chartHeight = document.documentElement.clientHeight * 0.8;

    const margin = { top: 20, right: 100, bottom: 30, left: 40} ;
    const width = chartWidth - margin.left - margin.right;
    const height = chartHeight - margin.top - margin.bottom;

    const xScale = d3.scaleBand();
    const yScale = d3.scaleLinear();
    const zScale = d3.scaleOrdinal(d3.schemeCategory20c);

    const stack = d3.stack().keys(mutations);

    xScale.domain(chromosomes).range([margin.left, width - margin.right]).paddingInner(0.1).paddingOuter(0.5);
    yScale.domain([1, 0]).range([0, height]); // 1 is the maximum number, because it's normalized
    zScale.domain(mutations);

    const svg = d3.select("#container").append("svg")
      .attr("class", this.props.id)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const axes = svg.append("g").classed("axes", true);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    axes.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);

    axes.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height + margin.top})`)
      .call(xAxis);

    svg.selectAll(".bar")
      .data(stack(chromosomeCounter))
      .enter().append("g")
        .attr("class", "chromosome")
        .attr("fill", function(d) { return zScale(d.key); })
      .selectAll("rect")
        .data(function(d) { return d; })
        .enter().append("rect")
        .attr("x", function(d) { return xScale(d.data.chromosome); })
        .attr("y", function(d) { return yScale(d[1]) + margin.top; })
        .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .on("click", (d, i) => {
          this.props.click((data) => {
            return data.filter((item) => {
              let chromosome = chromosomes[i];
              return chromosome === item.chromosome;
            });
          });
        });

    const legend = svg.append("g").selectAll(".legend")
      .data(mutations)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return `translate( -50, ${ margin.top + i * 20 } )`; })
      .style("font", "10px sans-serif");

    legend.append("rect")
      .attr("x", width + 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", zScale);

    legend.append("text")
      .attr("x", width + 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });


    return null;
  }
}

export default StackedBarchartComponent;