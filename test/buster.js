var config = module.exports;

config["App core tests"] = {
  environment: "browser",
  rootPath: "../",
  sources: [
    "lib/jQuery/jquery.js",
    "lib/moment/moment.js",
    "lib/simpleStorage/simpleStorage.js",
    "src/core.js"
  ],
  tests: [
    "test/core-test.js"
  ]
};
