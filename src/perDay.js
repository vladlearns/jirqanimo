import * as d3 from "d3";
window.d3 = d3;
const perDay = d3.select("#perDay");
console.log(perDay);
const bugsPerDay = [20, 30, 40, 50, 60, 70, 80, 90, 100, 60, 70, 80, 90, 100];

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

const rectSize = 50;

const rectScale = d3.scaleLinear().domain([0, 100]).range([0, rectSize]);

const colorScale = d3
	.scaleLinear()
	.domain([0, 100])
	.range(["#b3c3cc", "#32444d"]);

perDayGroups
	.append("rect")
	.attr("x", -rectSize / 2)
	.attr("y", -rectSize / 2)
	.attr("width", rectSize)
	.attr("height", rectSize)
	.attr("stroke-width", 2)
	.attr("stroke", "#32444d")
	.attr("fill-opacity", (i) => (i === 9 ? 1 : 0))
	.attr("fill", (d, i) => (i === 9 ? colorScale(d) : "none"));

perDayGroups
	.append("rect")
	.attr("x", -rectSize / 2)
	.attr("y", -rectSize / 2)
	.attr("width", rectSize)
	.attr("height", rectSize)
	.attr("stroke-width", 2)
	.attr("stroke", "#b3c3cc")
	.attr("fill-opacity", 0);

perDayGroups
	.append("rect")
	.attr("x", -rectSize / 2)
	.attr("y", -rectSize / 2)
	.attr("width", (d) => rectScale(d))
	.attr("height", (d) => rectScale(d))
	.attr("fill", (d, i) => (i === 9 ? colorScale(d) : "none"));

perDayGroups
	.append("text")
	.attr("class", "dailyNumber")
	.attr("x", 0)
	.attr("y", 50)
	.text((d) => d);

perDayGroups
	.append("text")
	.attr("class", "day")
	.attr("x", 0)
	.attr("y", 50)
	.text((d, i) => i + 1);
