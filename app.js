const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackConfig = require("./webpack.config.js");
const { exec } = require("child_process");

const app = express();
app.use(express.static("public"));
const compiler = webpack(webpackConfig);

app.use(
	webpackDevMiddleware(compiler, {
		publicPath: webpackConfig.output.publicPath,
	})
);

app.get("/", (res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/run", (req, res) => {
	const runCommands = {
		getData: "getData",
		createReport: "createReport",
	};
	const command = req.query.command;
	if (!command) {
		return res.status(400).send("Command is required");
	} else if (!runCommands[command]) {
		return res.status(400).send("Invalid command");
	}
	if (command === "getData") {
		exec("node ./src/getData.mjs", (err, stdout, stderr) => {
			if (err) {
				console.error(err);
				return res.status(500).send(err.message);
			}

			res.send(stdout);
		});
	}
	if (command === "createReport") {
		exec("node ./src/createReport.js", (err, stdout, stderr) => {
			if (err) {
				console.error(err);
				return res.status(500).send(err.message);
			}

			res.send(stdout);
		});
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}...`);
});
