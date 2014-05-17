var config = module.exports;

config["App core tests"] = {
  environment: "browser",  // or "node"
  rootPath: "../",
  sources: [
    "jquery-2*.js",
    "moment*.js",
    "simpleStorage.js",
    "app.js"
  ],
  tests: [
    "test/app-test.js"
  ]
};
