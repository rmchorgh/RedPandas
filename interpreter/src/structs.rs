use std::convert::Infallible;

use rocket::request::FromParam;

pub(crate) struct UUID<'r>(&'r str);

impl<'r> FromParam<'r> for UUID<'r> {
    type Error = &;

    fn from_param(param: &'a str) -> Result<Self, Self::Error> {
        return Ok(UUID(param.to_owned()));
    }
}
