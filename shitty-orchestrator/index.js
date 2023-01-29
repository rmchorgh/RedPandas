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
    .file(`${req.query.userId}/${req.query.datasetId}.${req.query.revision}`)
    .download({ start: 0, end: 100000 });
  const data = Papa.parse(buf.toString());
  res.json(data.data);
});

app.post("/run-command", async (req, res) => {
  res.json({});
  for (const dataset of req.body.datasets) {
    await storage
      .bucket("rp-projects")
      .file(`${req.body.userId}/${dataset.id}.${dataset.revision}`)
      .download({
        destination: `/Users/bobbygeorge/Desktop/datasets/${dataset.id}_${dataset.revision}.csv`,
      });
  }
  try {
    const mounts = req.body.datasets.map(
      (dataset) =>
        `${dataset.name} = pd.read_csv("/Users/bobbygeorge/Desktop/datasets/${dataset.id}_${dataset.revision}.csv")`
    );
    const outs = req.body.datasets.map(
      (dataset) =>
        `${dataset.name}.to_csv("/Users/bobbygeorge/Desktop/datasets/${
          dataset.id
        }_${dataset.revision + 1}.csv")`
    );
    const { stdout, stderr } = await exec(`
    python -c 'import pandas as pd\n${mounts.join("\n")}\n${
      req.body.input
    }\n${outs.join("\n")}'`);

    for (const dataset of req.body.datasets) {
      await storage
        .bucket("rp-projects")
        .upload(
          `/Users/bobbygeorge/Desktop/datasets/${dataset.id}_${
            dataset.revision + 1
          }.csv`,
          {
            destination: `${req.body.userId}/${dataset.id}.${
              dataset.revision + 1
            }`,
          }
        );
    }

    await fetch("http://localhost:3001/api/orchestrator-hook", {
      method: "POST",
      body: JSON.stringify({
        input: req.body.input,
        output: stderr || stdout,
        projectId: req.body.projectId,
      }),
      headers: { "Content-Type": "application/json" },
    });
  } catch ({ stdout, stderr }) {
    for (const dataset of req.body.datasets) {
      await storage
        .bucket("rp-projects")
        .upload(
          `/Users/bobbygeorge/Desktop/datasets/${dataset.id}_${dataset.revision}.csv`,
          {
            destination: `${req.body.userId}/${dataset.id}.${
              dataset.revision + 1
            }`,
          }
        );
    }

    await fetch("http://localhost:3001/api/orchestrator-hook", {
      method: "POST",
      body: JSON.stringify({
        input: req.body.input,
        output: stderr || stdout,
        projectId: req.body.projectId,
      }),
      headers: { "Content-Type": "application/json" },
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
