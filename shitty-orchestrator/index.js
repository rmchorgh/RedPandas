const express = require("express");
const { Storage } = require("@google-cloud/storage");
const Papa = require("papaparse");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const crypto = require("node:crypto");
const fetch = require("node-fetch");

const app = express();
const port = 8000;
const storage = new Storage();

app.use(express.json());

app.get("/preview", async (req, res) => {
  const buf = await storage
    .bucket("rp-projects")
    .file(`${req.query.userId}/${req.query.datasetId}/${req.query.revisionId}`)
    .download({ start: 0, end: 100000 });
  const data = Papa.parse(buf.toString());
  res.json(data.data);
});

app.post("/run-command", async (req, res) => {
  res.json({});
  await storage
    .bucket("rp-projects")
    .file(`${req.body.userId}/${req.body.datasetId}/${req.body.revisionId}`)
    .download({
      destination: "/Users/bobbygeorge/Desktop/datasets/" + req.body.revisionId,
    });
  const nextRev = crypto.randomUUID();
  try {
    const { stdout, stderr } = await exec(`
    python -c 'import pandas as pd\ndf = pd.read_csv("${
      "/Users/bobbygeorge/Desktop/datasets/" + req.body.revisionId
    }")\n${req.body.input}\ndf.to_csv("${
      "/Users/bobbygeorge/Desktop/datasets/" + nextRev
    }")'`);

    await storage
      .bucket("rp-projects")
      .upload("/Users/bobbygeorge/Desktop/datasets/" + nextRev, {
        destination: `${req.body.userId}/${req.body.datasetId}/${nextRev}`,
      });

    await fetch("http://localhost:3000/api/orchestrator-hook", {
      method: "POST",
      body: JSON.stringify({
        input: req.body.input,
        output: stderr || stdout,
        revisionId: nextRev,
        projectId: req.body.projectId,
      }),
      headers: { "Content-Type": "application/json" },
    });
  } catch ({ stdout, stderr }) {
    await fetch("http://localhost:3000/api/orchestrator-hook", {
      method: "POST",
      body: JSON.stringify({
        input: req.body.input,
        output: stderr || stdout,
        revisionId: req.body.revisionId,
        projectId: req.body.projectId,
      }),
      headers: { "Content-Type": "application/json" },
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
