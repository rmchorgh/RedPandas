#![feature(decl_macro)]
use std::process::Command;

use rocket::{custom, serde::json::Json, Config};
use structs::{RunReq, UUID};

use crate::structs::BatchPreviewReq;
pub mod structs;

#[macro_use]
extern crate rocket;

#[launch]
fn rocket() -> _ {
    let c = Config {
        port: 3000,
        ..Config::default()
    };
    custom(&c).mount("/", routes![run_code, preview, batch_preview])
}

#[post("/run/<user>/<project>", data = "<json>")]
fn run_code(user: UUID, project: UUID, json: Json<RunReq>) -> String {
    let _execute = format!(
        r#"from polars import scan_csv
dfs = (
    scan_csv(x) 
    for x in [
        {}
    ]
)

{}"#,
        json.active_dfs().iter().fold("".to_string(), |acc, x| {
            format!("{}\"{}\",\n\t\t", acc, x)
        }),
        json.code()
    );

    let out_raw = Command::new("python3.10")
        .arg("-c")
        .arg(json.code())
        .output()
        .expect("failed to execute process")
        .stdout;

    let out: String = String::from_utf8(out_raw).unwrap();

    format!(
        "user:\t{}\nproject:\t{}\nactive_dfs:{}\nexecuted:\n{}",
        user,
        project,
        json.active_dfs()
            .iter()
            .fold("".to_string(), |acc, x| { format!("{}\n\t{}", acc, x) }),
        out
    )
}

#[get("/df/<dataframe>/<revision>")]
fn preview(dataframe: String, revision: String) -> String {
    format!(
        "get the dataframe\n\tdf:\t{}\n\trev:\t{}",
        dataframe, revision
    )
}

#[put("/df/batch", data = "<json>")]
fn batch_preview(json: Json<BatchPreviewReq>) -> String {
    format!(
        "dataframes:{}\nrevisions:{}",
        json.dataframes()
            .iter()
            .fold("".to_string(), |acc, x| { format!("{}\n\t{}", acc, x) }),
        json.revisions()
            .iter()
            .fold("".to_string(), |acc, x| { format!("{}\n\t{}", acc, x) }),
    )
}
