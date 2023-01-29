#![feature(decl_macro)]
use std::process::Command;

use reqwest::Error;
use rocket::{custom, response::status, serde::json::Json, Config};
use structs::{RunReq, UUID};

pub mod structs;

#[macro_use]
extern crate rocket;

#[launch]
fn rocket() -> _ {
    let c = Config {
        port: 3000,
        ..Config::default()
    };
    custom(&c).mount("/", routes![run_code])
}

#[post("/run/<user>/<project>", format = "json", data = "<json>")]
fn run_code(
    user: UUID,
    project: UUID,
    json: Json<RunReq>,
) -> Result<String, status::BadRequest<String>> {
    let execute = format!(
        r#"
from polars import read_csv
from google.cloud import storage

user = '{}'
project = '{}'
files = [
    {}
]


client = storage.Client()
bucket = client.bucket('rp-projects')

def load_dfs():
    blobs = map(lambda x: bucket.blob(f'{{user}}/{{project}}/{{x}}'), files)
    return list(map(lambda x: read_csv(x.download_as_string()), blobs))

def save_dfs(dfs):
    for i, x in enumerate(dfs):
        fn = files[i]
        if fn[-2] != '.':
            fn += '.0'
        else:
            rev_count = int(fn[-1]) + 1
            fn = fn[:-1] + rev_count

        blob = bucket.blob(f'{{user}}/{{project}}/{{fn}}')
        blob.upload_from_string(x.write_csv())

dfs = load_dfs()

{}

save_dfs(dfs)"#,
        user,
        project,
        json.active_dfs().iter().fold("".to_string(), |acc, x| {
            format!("{}\"{}\",\n\t\t", acc, x)
        }),
        json.code()
    );

    let out: [String; 2] = match Command::new("python3.10").arg("-c").arg(execute).output() {
        Ok(x) => [
            String::from_utf8(x.stdout).unwrap(),
            String::from_utf8(x.stderr).unwrap(),
        ],
        Err(x) => [x.to_string(), "".to_string()],
    };

    if out[1].is_empty() {
        _ = callback();
        return Ok("success".to_string());
    }

    return Err(status::BadRequest(Some(out[1].to_string())));
}

async fn callback() -> Result<String, Error> {
    let url = "https://red-pandas.vercel.app/api/orchestrator-hook";
    let c = reqwest::Client::new();
    c.get(url).send().await?.text().await
}
