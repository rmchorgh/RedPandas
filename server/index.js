import Clerk from "@clerk/clerk-sdk-node/esm/instance";
import functions from "@google-cloud/functions-framework";
const BUCKET_NAME = "rp-projects";

function isParamsValid({ file, token, id }, res) {
  if (!file) {
    res.status(400);
    res.send("include filename as 'file' query param");
    return false;
  }
  if (!token) {
    res.status(401);
    res.send("include token as 'token' query param");
    return false;
  }
  if (!id) {
    res.status(402);
    res.send("include id as 'id' query param");
    return false;
  }
  return true;
}

// Register an HTTP function with the Functions Framework
functions.http("kamalSexy", async (req, res) => {
  const { Storage } = require("@google-cloud/storage");
  // Creates a storage client
  const storage = new Storage();

  const clerk = new Clerk({
    secretKey: "sk_test_BkPO9GSxRMKX7yp2aTtshIkQueomHQ9iuwXNBCI5HA",
  });
  const { file, token, id } = req.query;

  if (!isParamsValid({ file, token, id }, res)) return;
  const session = await clerk.sessions.verifySession(id, token);
  if (!session) {
    res.status(403);
    res.send("invalid session hoe: wrong id or token");
    return;
  }

  const clerkUser = await clerk.users.getUser(client.id);
  if (!clerkUser) {
    res.status(404);
    res.send("invalid user mf");
    return;
  }

  // options (headers and stuff)
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: "text/csv",
  };

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket(BUCKET_NAME)
    .file(fileName)
    .getSignedUrl(options);

  res.send(url);
});
















const testSignedUrl = async (req, res) => {
  const { Storage } = require("@google-cloud/storage");
  // Creates a storage client
  const storage = new Storage();

  const clerk = new Clerk({
    secretKey: "sk_test_BkPO9GSxRMKX7yp2aTtshIkQueomHQ9iuwXNBCI5HA",
  });
  const { file, token, id } = req.query;

  if (!isParamsValid({ file, token, id }, res)) return;
  const session = await clerk.sessions.verifySession(id, token);
  if (!session) {
    res.status(403);
    res.send("invalid session hoe: wrong id or token");
    return;
  }

  const clerkUser = await clerk.users.getUser(client.id);
  if (!clerkUser) {
    res.status(404);
    res.send("invalid user mf");
    return;
  }

  // options (headers and stuff)
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: "text/csv",
  };

  // Get a v4 signed URL for uploading file
  const [url] = await storage
    .bucket(BUCKET_NAME)
    .file(fileName)
    .getSignedUrl(options);

  res.send(url);

  // console.log("Generated PUT signed URL:");
  // console.log(url);
  // console.log("You can use this URL with any user agent, for example:");
  // console.log(
  //   `${
  //     "curl -X PUT -H 'Content-Type: application/octet-stream' " +
  //     `--upload-file my-file '${url}'`
  //   }`
  // );

  // const token =
  //   "eyJhbGciOiJSUzI1NiIsImtpZCI6Imluc18yS3dXTmFxYTdxMW1HQk95SWxBY3lHajBzeDEiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL3JlZC1wYW5kYXMudmVyY2VsLmFwcCIsImV4cCI6MTY3NDkwMjY4MywiaWF0IjoxNjc0OTAyNjIzLCJpc3MiOiJodHRwczovL2Nhc3VhbC1naWJib24tNzEuY2xlcmsuYWNjb3VudHMuZGV2IiwibmJmIjoxNjc0OTAyNjEzLCJzaWQiOiJzZXNzXzJLd2REVk9Sd1B6S2phU2N3ZThoMnVXME53NiIsInN1YiI6InVzZXJfMkt3YkFDbW0yVDBPZ2w5cVRzYkw2aWtzTlpZIn0.roIBjj2YnQN-YSWLguyJ2phewDRR1q2ZQecKr2dGAofcKt6r7IGSUzMwz8u-3wqCI15s2Q7RAsi4khu_aNAXxF9D8iT3Hmcs2R7Bn7a-IkjG9A2C7tY04zxDODfohVP-bB3iDvgy8Ww7Rf3W2cGznmQ176yzphA0vX-qY3Ra0JelwzTElUy1YylOhPkur3VV4x-GMeckyB-3f0ER4tv5JHpH5Moj_4UJicaCJvAQ8cU3BZSvYX3D7_NSPObJlKU5KJQb1sjRjN6w8Scfx_hXiSobSalneOKKf9HLqsySWibcY0wIPjJkLLYAP0atyOrM3dDWai-hVvzq3w-vlONQpw";

  // const token = "sess_2KwdDVORwPzKjaScwe8h2uW0Nw6"
  // const clerkToken = await clerk.clients.getClient(token)
  // const clerkToken = await clerk.clients.getClientList();
  // console.log(clerkToken)

  // console.log(await clerk.clients.verifyClient(token));
  // // const {token} = req.query;

  // // clerk has a node api and there's a validate token function
  // // const clerk = require('@clerk/clerk-sdk-node')
  // // const clerkClient = clerk.defaultClient
  // // const clerkToken = await clerkClient.verifyClient(token)
  // const client = await clerk.clients.verifyClient(token);
  // if (!client) {
  //   console.log(401)
  //   console.log('invalid token hoe')
  //   return
  // }

  // // other functions that gets user info  to get user id from clerk
  // // for the docs its on clear.dev

  // const clerkUser = await clerk.getUser(client.id)
  // if (!clerkUser) {
  //   console.log(402)
  //   console.log('invalid user mf')
  //   return
  // }
  // console.log("clerkUser")
  // console.log(clerkUser)

  // const fileName = req.query.file
  // if (!fileName) {
  //   console.log(403)
  //   console.log('include filename as \'fileName\' query param')
  //   return
  // }

  // // Your code here
  // const { Storage } = require("@google-cloud/storage");

  // // Creates a storage client
  // const storage = new Storage();

  // // options (headers and stuff)
  // const options = {
  //   version: "v4",
  //   action: "write",
  //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  //   contentType: "text/csv",
  // };

  // // Get a v4 signed URL for uploading file
  // const [url] = await storage
  //   .bucket(BUCKET_NAME)
  //   .file(fileName)
  //   .getSignedUrl(options);

  // console.log("Generated PUT signed URL:");
  // console.log(url);
  // console.log("You can use this URL with any user agent, for example:");
  // console.log(
  //   `${
  //     "curl -X PUT -H 'Content-Type: application/octet-stream' " +
  //     `--upload-file my-file '${url}'`
  //   }`
  // );
  // // res.send(url);
};

// async function main() {
//   testSignedUrl(
//     {
//       query: {
//         id: "sess_2KwdDVORwPzKjaScwe8h2uW0Nw6",
//         token: "eyJhbGciOiJSUzI1NiIsImtpZCI6Imluc18yS3dXTmFxYTdxMW1HQk95SWxBY3lHajBzeDEiLCJ0eXAiOiJKV1QifQ.eyJhenAiOiJodHRwczovL3JlZC1wYW5kYXMudmVyY2VsLmFwcCIsImV4cCI6MTY3NDkxNDExNiwiaWF0IjoxNjc0OTE0MDU2LCJpc3MiOiJodHRwczovL2Nhc3VhbC1naWJib24tNzEuY2xlcmsuYWNjb3VudHMuZGV2IiwibmJmIjoxNjc0OTE0MDQ2LCJzaWQiOiJzZXNzXzJLd2REVk9Sd1B6S2phU2N3ZThoMnVXME53NiIsInN1YiI6InVzZXJfMkt3YkFDbW0yVDBPZ2w5cVRzYkw2aWtzTlpZIn0.QuT6shEV9zeNnLS_rPfjZhw0Oi0hrxeUtUg9aUwcawOydNjq7panIDwXFM2WNaoE8kniU_jf0RREzToZdwTYd05Av--dVFEVwJxiAuwfaNsiRFn8JPoqlhFwk1owwWbs0kuiAK6VTtdTvACGqcNUJU81h32bnkWZ6LyHm8UwALdSxrseo2rF_PyQ0a7xxc7IUoDM368S-rYUyqroorDXM_6lwasd6EIXyrzqFddwzZ0Vm55wW5jQSIewPJ2ASEoqZcjPuHQH64h6mrxB8DZO_YmsUjEP5g87zOks9hFWRJPYQOXRouf0De6Rzip8JBRVDXAc29zNQZ_V1Jefn79HOA",
//         file: "test.csv",
//       },
//     },
//     ""
//   );
// }

// main();

// function readBucketForFile(
//   bucketName = "you_bucket_name",
//   filename = "your_file_path_without_bucket_name"
// ) {
//   const { Storage } = require("@google-cloud/storage");

//   // Creates a client (Parameters not required if you are already in GCP environment)
//   const storage = new Storage({
//     projectId: "redpandas-376106",
//     keyFilename: "./redpandas-376106-0cf5dadfa633.json",
//   });

//   async function generateV4ReadSignedUrl() {
//     // These options will allow temporary read access to the file
//     const options = {
//       version: "v4",
//       action: "read",
//       expires: Date.now() + 15 * 60 * 1000 * 4, // 60 minutes
//     };

//     // Get a v4 signed URL for reading the file
//     const [url] = await storage
//       .bucket(bucketName)
//       .file(filename)
//       .getSignedUrl(options);

//     console.log("Generated GET signed URL:");
//     console.log(`${url}`.yellow);
//     console.log("You can use this URL with any user agent, for example:");
//     console.log(`'${url}'`.yellow);
//   }

//   generateV4ReadSignedUrl().catch(console.error);
//   // [END storage_generate_signed_url_v4]
// }
// // readBucketForFile(...process.argv.slice(2));

// function getSignedUrlForUpload(file) {
//   // const gcloud = require('google-cloud')
//   const { Storage } = require("@google-cloud/storage");

//   // Creates a client (Parameters not required if you are already in GCP environment)
//   const storage = new Storage({
//     projectId: "redpandas-376106",
//     keyFilename: "./redpandas-376106-0cf5dadfa633.json",
//   });

//   // const bucket = gcs.bucket(BUCKET_NAME)
//   const bucket = storage.bucket(BUCKET_NAME);

//   bucket.file(file).getSignedUrl(
//     {
//       version: "v4",
//       action: "write",
//       expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//       contentType: `text/csv`,
//     },
//     (error, signedUrl) => {
//       if (error == null) {
//         // res.send(signedUrl);
//         console.log(`${signedUrl}`.green);
//       } else {
//         // res.code(400);
//         // res.send("error");
//         console.log(`${error}`.red)
//       }
//     }
//   );
// }

// getSignedUrlForUpload(...process.argv.slice(1));

// function getSignedUrlForUpload(fileName) {
//   // console.log(fileName.blue)
//   // Imports the Google Cloud client library
//   const { Storage } = require("@google-cloud/storage");

//   // Creates a storage client
//   const storage = new Storage({
//     projectId: "redpandas-376106",
//     keyFilename: "./redpandas-376106-0cf5dadfa633.json",
//   });

//   async function generateV4UploadSignedUrl() {
//     // options (headers and stuff)
//     const options = {
//       version: "v4",
//       action: "write",
//       expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//       contentType: "text/csv",
//     };

//     // Get a v4 signed URL for uploading file
//     const [url] = await storage
//       .bucket(BUCKET_NAME)
//       .file(fileName)
//       .getSignedUrl(options);

//     console.log("Generated PUT signed URL:");
//     console.log(url.green);
//     console.log("You can use this URL with any user agent, for example:");
//     console.log(
//       `${
//         "curl -X PUT -H 'Content-Type: application/octet-stream' " +
//         `--upload-file my-file '${url}'`
//       }`.yellow
//     );
//   }
//   generateV4UploadSignedUrl().catch(console.error);
// }

// getSignedUrlForUpload(...process.argv.slice(2));

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'rp-projects';

// The full path of your file inside the GCS bucket, e.g. 'yourFile.jpg' or 'folder1/folder2/yourFile.jpg'
// const fileName = '/Users/hans/UMD/Fall2022/BUFN400/hw3/6jjwwvjo45mpllof.csv';

// Imports the Google Cloud client library
// const {Storage} = require('@google-cloud/storage');

// // Creates a client
// // const storage = new Storage();
// const storage = new Storage({
//       projectId: "redpandas-376106",
//       keyFilename: "./redpandas-376106-0cf5dadfa633.json",
//     });

// async function generateV4UploadSignedUrl() {
//   // These options will allow temporary uploading of the file with outgoing
//   // Content-Type: application/octet-stream header.
//   // const options = {
//   //   version: 'v4',
//   //   action: 'write',
//   //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//   //   contentType: 'text/csv',
//   // };

//   // Get a v4 signed URL for uploading file
//   const [url] = await storage
//     .bucket(bucketName)
//     .file(fileName)
//     .getSignedUrl(options);

//   console.log("Generated PUT signed URL:");
//   console.log(url.green);
//   console.log("You can use this URL with any user agent, for example:");
//   console.log(
//     `${
//       "curl -X PUT -H 'Content-Type: application/octet-stream' " +
//       `--upload-file my-file '${url}'`
//     }`.yellow
//   );
// }
