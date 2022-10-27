import fetch from "node-fetch";
import { visit } from "unist-util-visit";

/**
 * Plugin to enable dynamic data in md.
 *
 * @type {import('unified').Plugin<void[], Root>}
 * @returns {(node: Root, file: VFile) => Promise<void>}
 */
export default function remarkRequests(options) {
  const pattern = /GET\([^,]{3,},[^),]{1,}(,\s?\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))?\)/g;

  return async (tree) => {
    const availableApis = {};
    if (options && options.apis) {
      for (const api of options.apis) {
        const response = await fetch(api.url);
        if (response.ok) {
          const data = await response.json();
          availableApis[api.name] = data;
        }
      }
    }

    visit(tree, "text", (node) => {
      const matches = node.value.match(pattern);
      if (matches) {
        for (const match of matches) {
          const params = match.slice(4, match.length - 1);
          const [api, field, expiry] = params.split(",").map((param) => param.trim());

          let isExpired = false;
          if (expiry) {
            const expiryDate = new Date(expiry);
            isExpired = expiryDate < new Date();
          }

          if (!isExpired) {
            if (availableApis[api]) {
              if (availableApis[api][field]) {
                node.value = node.value.replace(match, availableApis[api][field]);
              } else {
                node.value = node.value.replace(match, "API field not available");
              }
            } else {
              node.value = node.value.replace(match, "API not available");
            }
          } else {
            node.value = node.value.replace(match, "API no longer available");
          }
        }
      }
    });
  };
}
