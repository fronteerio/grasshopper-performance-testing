# Grasshopper Model Loader

Allows you to generate test data that can be loaded into Grasshopper and feeded into a set of gatling scripts.

## Getting started

1. Install all the dependencies
  1. Run `npm install`
  2. Copy gh-rest from `grasshopper/node_modules` into the model-loaders `node_modules`. Once gh-rest gets published to npm this step will no longer be necessary

2. Generate some test data

   Run `node generate --users 1000 --courses 100`. This will generate 1000 users and 100 courses. Each course will contain a full tree of subjects, parts, modules and events. The distributions have been hardcoded and are based on real production data.
   Once the data has been generated, you should end up with a set of json files under `scripts/` that end in `.generated.json`.

3. Load the testdata into grasshopper
  1. Make sure your grasshopper server is running
  2. Run `node loaddata --host <app hostname> --username <app admin username> --password <app admin password>`

   Once the data is loaded into the system you should end up with a set of json files under `scripts/` that end in `.loaded.json`. These files can be feeded into a Gatling script.
