[![Lint and Test](https://github.com/CageDevelopment/remark-requests/actions/workflows/main.yaml/badge.svg?branch=main)](https://github.com/CageDevelopment/remark-requests/actions/workflows/main.yaml)

# remark-requests

[**remark**](https://github.com/remarkjs/remark) plugin to fetch dynamic data from APIs.

## Installation

```
npm install remark-requests
```

## Usage

### Source

```js
const remark = require("remark");
const remarkRequests = require("remark-requests");

remark()
  .use(remarkRequests, {
    apis: [
      {
        name: "coindeskApi",
        url: "https://api.coindesk.com/v1/bpi/currentprice.json",
      },
    ],
  })
  .process(
    "Chart name: GET(coindeskApi, chartName)\nPrice: GET(coindeskApi, chartName, 2022-10-27T00:00Z)",
    (err, file) => {
      if (err) throw err;
      console.log(String(file));
    }
  );
```

### Yields

```
Chart name: Bitcoin
Price: API is no longer available
```

## API

### `remark.use(remarkRequests[, options])`

- `options.apis` (**optional**) - list of api referrences `{ name: string; url: string }`.

## Contributions

If you are interested in contributing to this project, please open an issue with a description of what you would like to add.

## License

[MIT](LICENSE) © [CageDevelopment](https://github.com/CageDevelopment)
