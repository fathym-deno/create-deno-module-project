import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/mod.ts";
import { join } from "https://deno.land/std@0.195.0/path/mod.ts";
import { exists } from "https://deno.land/fathym_common@0.0.34/path/mod.ts";

await new Command()
  .name("create-deno-module-project")
  .version("0.0.0")
  .description("Command line framework for Deno")
  .arguments("<name:string>")
  .option("-d, --directory <dir:string>", "Set the directory to run in.")
  .action(async (options, ...args) => {
    const [name] = args;

    let { directory } = options;

    if (!directory) {
      directory = Deno.execPath();
    }

    await Deno.mkdir(directory, { recursive: true });
    await Deno.mkdir(join(directory, ".vscode"), { recursive: true });
    await Deno.mkdir(join(directory, "scripts"), { recursive: true });
    await Deno.mkdir(join(directory, "src"), { recursive: true });
    await Deno.mkdir(join(directory, "tests"), { recursive: true });

    await ensureDenoJson(directory);

    await ensureGitIgnore(directory);

    await ensureModRoot(directory);

    await ensureSrcUtils(directory);

    await ensureTests(directory);

    await ensureTestDeps(directory);

    await ensureUtilsTests(directory);

    await ensureNPMBuild(directory, name);

    await ensureVSCodeExt(directory);

    await ensureVSCodeSettings(directory);

    await ensureVSCodeLaunch(directory);
  })
  .parse(Deno.args);

async function ensureDenoJson(directory: string): Promise<void> {
  const filePath = join(directory, "./deno.json");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      JSON.stringify(defaultDenoJson(), null, 2),
    );
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
      "test": "deno test -A ./tests/tests.ts --coverage=cov",
    },
    "imports": {
      "$dnt": "https://deno.land/x/dnt/mod.ts",
      "$std/": "https://deno.land/std@0.195.0/",
    },
    "compilerOptions": {
      "jsx": "react-jsx",
      "jsxImportSource": "preact",
    },
    "lock": false,
    "fmt": {
      "files": {
        "include": [],
        "exclude": [],
      },
      "options": {},
    },
    "lint": {
      "files": {
        "include": [],
        "exclude": [],
      },
      "rules": {
        "include": [],
        "exclude": [],
      },
    },
  };
}

async function ensureModRoot(directory: string): Promise<void> {
  const filePath = join(directory, "./mod.ts");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      defaultModRoot(),
    );
  }
}

function defaultModRoot() {
  return `export * from "./src/utils.ts";`;
}

async function ensureSrcUtils(directory: string): Promise<void> {
  const filePath = join(directory, "./src/utils.ts");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      defaultSrcUtils(),
    );
  }
}

function defaultSrcUtils() {
  return `export function add(first: number, second: number): number {
  return first + second;
}`;
}

async function ensureTests(directory: string): Promise<void> {
  const filePath = join(directory, "./tests/tests.ts");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      defaultTests(),
    );
  }
}

function defaultTests() {
  return `import "./utils.tests.ts";
`;
}

async function ensureTestDeps(directory: string): Promise<void> {
  const filePath = join(directory, "./tests/test.deps.ts");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      defaultTestDeps(),
    );
  }
}

function defaultTestDeps() {
  return `export { assert, assertEquals } from "$std/testing/asserts.ts";
export { afterEach, beforeEach, describe, it } from "$std/testing/bdd.ts";
`;
}

async function ensureUtilsTests(directory: string): Promise<void> {
  const filePath = join(directory, "./tests/utils.tests.ts");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      defaultUtilsTests(),
    );
  }
}

function defaultUtilsTests() {
  return `import { assertEquals, describe } from "./test.deps.ts";
import { add } from "../src/utils.ts";

describe("Utils Tests", () => {
  describe("Add Test", () => {
    const added = add(1, 1);

    assertEquals(added, 2);
  });
});
`;
}

async function ensureNPMBuild(directory: string, name: string): Promise<void> {
  const filePath = join(directory, "./scripts/npm.build.ts");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      defaultNPMBuild(name),
    );
  }
}

function defaultNPMBuild(name: string) {
  return `import { build, emptyDir } from "$dnt";

await emptyDir("./build");

await build({
  entryPoints: ["mod.ts"],
  outDir: "./build",
  shims: {
    deno: true,
  },
  package: {
    name: "${name}",
    version: Deno.args[0],
    description: "ES6 based module project.",
    license: "MIT"
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "build/LICENSE");
    Deno.copyFileSync("README.md", "build/README.md");
  },
});
`;
}

async function ensureVSCodeExt(directory: string): Promise<void> {
  const filePath = join(directory, "./.vscode/extensions.json");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      JSON.stringify(defaultVSCodeExt(), null, 2),
    );
  }
}

function defaultVSCodeExt() {
  return {
    "recommendations": [
      "denoland.vscode-deno",
      "sastan.twind-intellisense",
    ],
  };
}

async function ensureVSCodeSettings(directory: string): Promise<void> {
  const filePath = join(directory, "./.vscode/settings.json");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      JSON.stringify(defaultVSCodeSettings(), null, 2),
    );
  }
}

function defaultVSCodeSettings() {
  return {
    "deno.enable": true,
    "deno.lint": true,
    "editor.defaultFormatter": "denoland.vscode-deno",
    "deno.config": "./deno.json",
    "[typescriptreact]": {
      "editor.defaultFormatter": "denoland.vscode-deno",
    },
    "[typescript]": {
      "editor.defaultFormatter": "denoland.vscode-deno",
    },
    "[javascriptreact]": {
      "editor.defaultFormatter": "denoland.vscode-deno",
    },
    "[javascript]": {
      "editor.defaultFormatter": "denoland.vscode-deno",
    },
  };
}

async function ensureVSCodeLaunch(directory: string): Promise<void> {
  const filePath = join(directory, "./.vscode/launch.json");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      JSON.stringify(defaultVSCodeLaunch(), null, 2),
    );
  }
}

function defaultVSCodeLaunch() {
  return {
    "version": "0.2.0",
    "configurations": [
      {
        "request": "launch",
        "name": "Launch Program",
        "type": "node",
        "program": "${workspaceFolder}/tests/tests.ts",
        "cwd": "${workspaceFolder}",
        "runtimeExecutable": "C:\\ProgramData\\chocolatey\\lib\\deno\\deno.EXE",
        "runtimeArgs": [
          "test",
          "--config",
          "./deno.json",
          "--inspect-wait",
          "--allow-all",
        ],
        "attachSimplePort": 9229,
      },
    ],
  };
}

async function ensureGitIgnore(directory: string): Promise<void> {
  const filePath = join(directory, "./.gitignore");

  if (!(await exists(filePath))) {
    await Deno.writeTextFileSync(
      filePath,
      defaultGitIgnore(),
    );
  }
}

function defaultGitIgnore() {
  return `.env
cov/
build/
coverage/
lcov/
target/
`;
}
