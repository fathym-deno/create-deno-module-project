import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/mod.ts";
import { exists } from "$std/fs/mod.ts";

async function ensureDenoJson(): Promise<void> {
  if (!(await exists("./deno.json"))) {
    await Deno.writeTextFileSync("./deno.json", JSON.stringify(defaultDenoJson(), null, 2));
  }
}

function defaultDenoJson() {
  return {
    "tasks": {
      "build": "deno task build:fmt && deno task build:lint && deno task test",
      "build:fmt": "deno fmt",
      "build:lint": "deno lint",
      "deploy": "deno task build && ftm git",
      "npm:build": "deno run -A scripts/npm.build.ts",
      "npm:publish": "npm publish ./build --access public",
      "test": "deno test -A ./tests/tests.ts --coverage=cov"
    },
    "imports": {
      "$dnt": "https://deno.land/x/dnt/mod.ts",
      "$std/": "https://deno.land/std@0.193.0/"
    },
    "compilerOptions": {
      "jsx": "react-jsx",
      "jsxImportSource": "preact"
    },
    "lock": false,
    "fmt": {
      "files": {
        "include": [],
        "exclude": []
      },
      "options": {}
    },
    "lint": {
      "files": {
        "include": [],
        "exclude": []
      },
      "rules": {
        "include": [],
        "exclude": []
      }
    }
  };
}

await new Command()
  .name("create-deno-module-project")
  .version("0.0.0")
  .description("Command line framework for Deno")
  .action(async (options, ...args) => {
    // const { name } = args;

    await ensureDenoJson();
  })
  .parse(Deno.args);
