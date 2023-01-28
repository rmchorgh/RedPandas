from polars import scan_csv

dfs = (
    scan_csv(x)
    for x in [
        "e",
        "e",
    ]
)
