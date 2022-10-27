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
  t.plan(3);

  remark()
    .use(remarkHttpRequests)
    .process(read("test/complex_test.md"), (err, file) => {
      t.equal(String(file), read("test/snapshots/complex_test_no_init.md").value);
    });

  remark()
    .use(remarkHttpRequests, {
      apis: [
        {
          name: "coingeckoApi",
          url: "https://api.coingecko.com/api/v3/coins/ethereum/contract/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        },
      ],
    })
    .process(read("test/complex_test.md"), (err, file) => {
      t.equal(String(file), read("test/snapshots/complex_test_result.md").value);
    });

  remark()
    .use(remarkHttpRequests, {
      apis: [
        {
          name: "coingeckoApi",
          url: "https://api.coingecko.com/api/v3/coins/ethereum/contract/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        },
      ],
    })
    .process(read("test/simple_test.md"), (err, file) => {
      t.equal(String(file), read("test/snapshots/simple_test_result.md").value);
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
