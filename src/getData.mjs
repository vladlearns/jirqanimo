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

async function getFilteredIssues(
	status,
	label,
	issueType,
	sortField = "created",
	sortOrder = "DESC",
	sprint = null
) {
	const query =
		`status ${status}` +
		(label ? ` AND labels ${label}` : "") +
		(issueType ? ` AND issuetype ${issueType}` : "") +
		(sprint ? ` AND sprint ${sprint}` : "");
	const sortQuery = `order by ${sortField} ${sortOrder}`;
	const fullQuery = `${query} ${sortQuery}`;
	const issues = await getIssues(fullQuery);
	return issues;
}

const openedStories = await getFilteredIssues(
	"NOT IN (Done)",
	null,
	"= Story",
	"created",
	"ASC",
	"=353"
);
const closedStories = await getFilteredIssues(
	"='Done'",
	null,
	"= Story",
	"created",
	"ASC",
	"=353"
);
const seoBugs = await getFilteredIssues(
	"='Open'",
	"= SEO_bug",
	"in (Subtask, Bug)",
	"created",
	"ASC",
	"=353"
);
const uiBugs = await getFilteredIssues(
	"='Open'",
	"= UI_bug",
	"in (Subtask, Bug)",
	"created",
	"ASC",
	"=353"
);
const functionalBugs = await getFilteredIssues(
	"='Open'",
	"= Functional_Bug",
	"in (Subtask, Bug)",
	"created",
	"ASC",
	"=353"
);
const translationBugs = await getFilteredIssues(
	"='Open'",
	"= Translation_bug",
	"in (Subtask, Bug)",
	"created",
	"ASC",
	"=353"
);
const notFixedBugs = await getFilteredIssues(
	"NOT IN (Done)",
	null,
	"in (Subtask, Bug)",
	"created",
	"ASC",
	"=353"
);
const leakedBugs = await getFilteredIssues(
	"NOT IN (Done)",
	null,
	"in (Subtask, Bug)",
	"created",
	"ASC",
	"=353"
);

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
		issuesArray.push(`${process.env.HOST}/browse/=${issues.issues[i].key}`);
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
		issues: collectIssues(seoBugs),
	},
	{
		name: "UI Bugs",
		count: uiBugs.total,
		date: currentDate,
		issues: collectIssues(uiBugs),
	},
	{
		name: "Functional Bugs",
		count: functionalBugs.total,
		date: currentDate,
		issues: collectIssues(functionalBugs),
	},
	{
		name: "Translation Bugs",
		count: translationBugs.total,
		date: currentDate,
		issues: collectIssues(translationBugs),
	},
	{
		name: "Not Fixed Bugs",
		count: notFixedBugs.total,
		date: currentDate,
		issues: collectIssues(notFixedBugs),
	},
	{
		name: "Leaked Bugs",
		count: leakedBugs.total,
		date: currentDate,
		issues: collectIssues(leakedBugs),
	},
];
const options = {
	fields: ["name", "count", "date", "issues"],
};

const parser = new Parser(options);
const csv = parser.parse(data);

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
