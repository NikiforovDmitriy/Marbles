"use strict";
(() => {
  // src/client/index.ts
  console.log("I's so cool!");
  new EventSource("/esbuild").addEventListener("change", () => location.reload());
})();
//# sourceMappingURL=bundle.js.map
