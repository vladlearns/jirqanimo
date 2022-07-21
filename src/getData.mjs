import fs from "fs";
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
const seoBugs = await getIssues('status = "To Do"');
const uiBugs = await getIssues('status = "To Do"');
const functionalBugs = await getIssues('status = "To Do"');
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

fs.writeFile("./stats.json", JSON.stringify(stats, null, 4), "utf8", (err) => {
  if (err) throw err;
  console.log("complete");
});
