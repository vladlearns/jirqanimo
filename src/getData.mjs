import fs from "fs";
import { Parser } from "json2csv";
import dotenv from "dotenv";
import { Version2Client } from "jira.js";

dotenv.config();

const client = new Version2Client({
	host: process.env.HOST,
	authentication: {
		basic: {
			email: process.env.EMAIL,
			apiToken: process.env.API_TOKEN,
		},
	},
	newErrorHandling: true,
});

async function getIssues(jql) {
	const data = await client.issueSearch.searchForIssuesUsingJql({
		jql: `${jql}`,
	});
	return data;
}

const openedStories = await getIssues('status = "To Do"');
const closedStories = await getIssues('status = "To Do"');
const seoBugs = await getIssues(
	'status = "To Do" AND labels = SEO_BUG order by created DESC'
);
const uiBugs = await getIssues(
	'status = "To Do" AND labels = UI_BUG order by created DESC'
);
const functionalBugs = await getIssues(
	'status = "To Do" AND labels = FUNCTIONAL_BUG order by created DESC'
);
const translationBugs = await getIssues('status = "To Do"');
const notFixedBugs = await getIssues('status = "To Do"');
const leakedBugs = await getIssues('status = "To Do"');

const stats = {
	openedStories,
	closedStories,
	seoBugs,
	uiBugs,
	functionalBugs,
	translationBugs,
	notFixedBugs,
	leakedBugs,
};
const currentDate = new Date().toUTCString();

const collectIssues = (issues) => {
	const issuesArray = [];
	for (let i = 0; i < issues.total; i++) {
		// TODO: add issue link from Jira, env
		issuesArray.push(`${selectedIssue}=${issues.issues[i].key}`);
	}
	return issuesArray;
};
const data = [
	{
		name: "Opened Stories",
		count: openedStories.total,
		date: currentDate,
		issues: collectIssues(openedStories),
	},
	{
		name: "Closed Stories",
		count: closedStories.total,
		date: currentDate,
		issues: collectIssues(closedStories),
	},
	{
		name: "SEO Bugs",
		count: seoBugs.total,
		date: currentDate,
		issues: collectIssues(closedStories),
	},
	{
		name: "UI Bugs",
		count: uiBugs.total,
		date: currentDate,
		issues: collectIssues(closedStories),
	},
	{
		name: "Functional Bugs",
		count: functionalBugs.total,
		date: currentDate,
		issues: collectIssues(closedStories),
	},
	{
		name: "Translation Bugs",
		count: translationBugs.total,
		date: currentDate,
		issues: collectIssues(closedStories),
	},
	{
		name: "Not Fixed Bugs",
		count: notFixedBugs.total,
		date: currentDate,
		issues: collectIssues(closedStories),
	},
	{
		name: "Leaked Bugs",
		count: leakedBugs.total,
		date: currentDate,
		issues: collectIssues(closedStories),
	},
];
const options = {
	fields: ["name", "count", "date", "issues"],
};

// Convert the data to a CSV string
const parser = new Parser(options);
const csv = parser.parse(data);

// Write the CSV string to a file
fs.writeFile("./data.csv", csv, (err) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log("CSV file written successfully");
});

fs.writeFile("./stats.json", JSON.stringify(stats, null, 4), "utf8", (err) => {
	if (err) throw err;
	console.log("complete");
});
