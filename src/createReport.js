const fs = require("fs");
const dotenv = require("dotenv");
const { parse } = require("csv-parse");
const Confluence = require("confluence-api");

dotenv.config();

const filePath = "data.csv";
const space = process.env.CONFLUENCE_SPACE;
const parentPageTitle = "Reports";

const confluence = new Confluence({
	username: process.env.EMAIL,
	password: process.env.API_TOKEN,
	baseUrl: `${process.env.HOST}/wiki`,
});

const csvData = fs.readFileSync(filePath, { encoding: "utf-8" });

parse(csvData, { columns: true }, (err, rows) => {
	if (err) throw err;

	const tableData = rows.map((row) => {
		return [
			row.name,
			row.count,
			row.date,
			row.issues
				.replace(/\[|\]|"/g, "")
				.split(",")
				.join("\n"),
		];
	});

	const tableMarkup = `|| Name || Count || Date || Issues ||\n|${tableData
		.map((row) => ` ${row.join(" | ")} `)
		.join("|\n|")}|`;

	confluence.getContentByPageTitle(
		space,
		parentPageTitle,
		(err, parentPage) => {
			if (!parentPage.results || parentPage.results.length === 0) {
				console.error(`Parent page "${parentPageTitle}" not found.`);
				return;
			}

			const parentPageId = parentPage.results[0].id;

			confluence.postContent(
				space,
				`Report ${new Date().toLocaleDateString()}`,
				{
					storage: {
						value: tableMarkup,
						representation: "wiki",
					},
				},
				parentPageId,
				function (err, data) {
					if (err) console.error(err);
					console.log(data);
				}
			);
		}
	);
});
