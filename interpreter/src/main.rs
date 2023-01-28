#![feature(decl_macro)]

use rocket::{custom, response::content::RawHtml, Config};
use structs::UUID;
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

#[post("/run/<user>/<project>")]
fn run_code(user: UUID, project: UUID) -> RawHtml<&'static str> {
    RawHtml(
        r#"
    <!DOCTYPE html>
    <html>
        <head>
            <title>Spotify Web API</title>
        </head>
        <body>
            <p>Recieved</p>
            <script>
                fetch(`http://localhost:3000/token/${window.location.hash.substr(14, window.location.hash.length - 48)}`, {
                    method: 'POST',
                    body: window.location.hash.substr(14, window.location.hash.length - 48)
                })
                .catch(console.error)
            </script>
        </body>
    </html>
    "#,
    )
}
