import tape from "tape";
import { remark } from "remark";
import { toVFile } from "to-vfile";
import remarkHttpRequests from "../index.js";

class T {
  constructor() {
    this.tests = [];
  }
  add(...args) {
    this.tests.push(args);
  }
  run() {
    this.tests.map((args) => tape(...args));
  }
}

const tests = new T();

tests.add("remark-requests", (t) => {
  t.plan(2);

  remark()
    .use(remarkHttpRequests)
    .process(read("test/example.md"), (err, file) => {
      const expected =
        "# Http requests\n\n## API not available stats\n\nFuture price: API not available\nDisclaimer: API not available\n";
      t.equal(String(file), expected);
    });

  remark()
    .use(remarkHttpRequests, {
      apis: [{ name: "coindeskApi", url: "https://api.coindesk.com/v1/bpi/currentprice.json" }],
    })
    .process(read("test/example.md"), (err, file) => {
      const expected =
        "# Http requests\n\n## Bitcoin stats\n\nFuture price: API field not available\nDisclaimer: This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org\n";
      t.equal(String(file), expected);
    });
});

tests.run();

/**
 * @param {string} fp
 */
function read(fp) {
  const file = toVFile.readSync(fp);
  file.value = String(file).replace(/\r\n/g, "\n");
  return file;
}
