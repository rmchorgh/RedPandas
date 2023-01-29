use derive_getters::Getters;
use rocket::{http::RawStr, request::FromParam, serde::Deserialize};
use std::fmt::Display;

pub(crate) struct UUID<'r>(&'r str);

impl<'r> FromParam<'r> for UUID<'r> {
    type Error = &'r RawStr;

    fn from_param(param: &'r str) -> Result<Self, Self::Error> {
        Ok(UUID(param))
    }
}

impl Display for UUID<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

#[derive(Deserialize, Getters)]
pub(crate) struct RunReq {
    active_dfs: Vec<String>,
    code: String,
}
