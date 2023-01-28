import Clerk from "@clerk/clerk-sdk-node";
import functions from "@google-cloud/functions-framework";
import * as crypto from "node:crypto";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

function isParamsValid({ token }, res) {
  if (!token) {
    res.status(400);
    res.send("include token as 'token' query param");
    return false;
  }
  return true;
}

// Register an HTTP function with the Functions Framework
functions.http("kamalSexy", async (req, res) => {
  const { token } = req.query;

  if (!isParamsValid({ token }, res)) return;
  const client = await Clerk.verifyToken(token);
  const session = await Clerk.sessions.verifySession(client.sid, token);

  const datasetId = crypto.randomUUID()
  const revisionId = crypto.randomUUID()

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket("rp-projects")
    .file(`${session.userId}/${datasetId}/${revisionId}`)
    .getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: "text/csv",
  });

  res.send({url, datasetId, revisionId});
});
