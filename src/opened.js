import * as d3 from "d3";
const opened = d3.select("#opened");

const numOfBugs = [10, 20, 30, 60, 70, 80, 90, 100, 500, 70, 80, 90, 100, 500];

const openedGroups = opened
	.selectAll("g")
	.data(numOfBugs)
	.enter()
	.append("g")
	.attr("transform", (d, i) => `translate(${i * 30}, 0)`);

const barScale = d3.scaleLinear().domain([0, 500]).range([1, 112]);

openedGroups
	.append("rect")
	.attr("width", 20)
	.attr("y", 140)
	.attr("x", 0)
	.attr("height", 0)
	.transition()
	.duration(1000)
	.delay((d, i) => i * 20)
	.attr("y", (d, i) => 140 - barScale(d))
	.attr("height", (d) => barScale(d));

openedGroups
	.append("text")
	.attr("x", 10)
	.attr("y", (d) => 160)
	.text((d, i) => i + 1)
	.attr("class", "days");

openedGroups
	.append("text")
	.attr("x", 10)
	.attr("y", (d) => 140 - barScale(d) - 5)
	.text((d, i) => d)
	.attr("class", "number");

const navbar = document.querySelector("nav");
const buttons = document.querySelector(".nav");
const closeNav = document.querySelector(".button-nav");
const body = document.querySelector("body");
const main = document.querySelector("main");
const expander = document.querySelector(".expander");
const fullscreen = document.querySelector(".fullscreen");
const stats = document.querySelector(".stats");

closeNav.addEventListener("click", () => {
	navbar.classList.add("closed");
	expander.classList.remove("button-transparent");
});

expander.addEventListener("click", () => {
	navbar.classList.remove("closed");
	expander.classList.add("button-transparent");
});

fullscreen.addEventListener("click", () => {
	main.style.display = "none";
	fullscreen.style.display = "none";
	closeNav.style.display = "none";
	body.style.gridTemplateColumns = "1fr 0fr";
	stats.style.flexWrap = "wrap";
	stats.style.justifyContent = "center";
	stats.style.gap = "300px";
	buttons.classList.remove("buttons");
});
