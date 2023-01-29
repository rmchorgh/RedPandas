const express = require("express");
const { Storage } = require("@google-cloud/storage");
const Papa = require("papaparse");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const crypto = require("node:crypto");
const fetch = require("node-fetch");
const fs = require("node:fs/promises");

const app = express();
const port = 8000;
const storage = new Storage();

app.use(express.json());

app.get("/preview", async (req, res) => {
  const buf = await storage
    .bucket("rp-projects")
    .file(`${req.query.userId}/${req.query.datasetId}.${req.query.revision}`)
    .download({ start: 0, end: 30000 });
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
    const { stdout, stderr } = await exec(
      `python -c 'import pandas as pd
import matplotlib.pyplot as plt
${mounts.join("\n")}
${req.body.input.replaceAll("'", "'\"'\"'")}
for fig in plt.get_fignums():
  plt.figure(fig)
  plt.savefig(f"/Users/bobbygeorge/Desktop/datasets/plots/{fig}.png")
${outs.join("\n")}'`
    );

    const plots = await fs.readdir("/Users/bobbygeorge/Desktop/datasets/plots");
    const plotIds = [];
    for (const plot of plots) {
      const id = crypto.randomUUID();
      await storage
        .bucket("rp-plots")
        .upload(`/Users/bobbygeorge/Desktop/datasets/plots/${plot}`, {
          destination: `${req.body.userId}/${id}`,
        });
      await fs.unlink(`/Users/bobbygeorge/Desktop/datasets/plots/${plot}`);
      plotIds.push(
        `https://storage.googleapis.com/rp-plots/${req.body.userId}/${id}`
      );
    }

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

    await fetch("http://localhost:3000/api/orchestrator-hook", {
      method: "POST",
      body: JSON.stringify({
        input: req.body.input,
        output: stderr || stdout,
        projectId: req.body.projectId,
        plots: plotIds,
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

    await fetch("http://localhost:3000/api/orchestrator-hook", {
      method: "POST",
      body: JSON.stringify({
        input: req.body.input,
        output: stderr || stdout,
        projectId: req.body.projectId,
        plots: [],
      }),
      headers: { "Content-Type": "application/json" },
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
