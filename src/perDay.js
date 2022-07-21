import * as d3 from "d3";
window.d3 = d3;
const perDay = d3.select("#perDay");
console.log(perDay);
const bugsPerDay = [20, 30, 40, 50, 60, 70, 80, 90, 100];

const perDayGroups = perDay
  .selectAll("g")
  .data(bugsPerDay)
  .enter()
  .append("g")
  .attr("transform", (d, i) => {
    const x = (i % 7) * 120 + 30;
    const y = Math.floor(i / 7) * 100 + 60;
    return `translate(${x}, ${y})`;
  });

const circleScale = d3.scaleSqrt().domain([0, 100]).range([1, 30]);

const colorScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range(["#b3c3cc", "#32444d"]);

perDayGroups
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", circleScale(100))
  .attr("class", "ring");

perDayGroups
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", circleScale(50))
  .attr("class", "ring");

perDayGroups
  .append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", (d) => 0)
  .transition()
  .duration(1000)
  .delay((d, i) => i * 20)
  .ease(d3.easeCubicIn)
  .attr("r", (d) => circleScale(d))
  .attr("fill", (d, i) => colorScale(d));

perDayGroups
  .append("text")
  .attr("class", "dailyNumber")
  .attr("x", 0)
  .attr("y", 50)
  .text((d, i) => d);

perDayGroups
  .append("text")
  .attr("class", "day")
  .attr("x", 0)
  .attr("y", 50)
  .text((d, i) => i + 1);
