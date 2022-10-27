# Simple Markdown test

| Value name | Value                                      |
| ---------- | ------------------------------------------ |
| Price      | GET(wrongApi, test)                        |
| Missing    | GET(coingeckoApi, missing)                 |
| Symbol     | GET(coingeckoApi, symbol)                  |
| Name       | GET(coingeckoApi, name, 2075-01-01T00:00Z) |
| Expired    | GET(coingeckoApi, name, 2000-01-01T00:00Z) |
