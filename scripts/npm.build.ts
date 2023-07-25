import { build, emptyDir } from "$dnt";

await emptyDir("./build");

await build({
  entryPoints: [{
    kind: "bin",
    name: ".",
    path: "cli.ts",
  }],
  outDir: "./build",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "@fathym/create-deno-module-project",
    version: Deno.args[0],
    description: "Used to scaffold a new deno module project.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/fathym/create-deno-module-project.git",
    },
    bugs: {
      url: "https://github.com/fathym/create-deno-module-project/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "build/LICENSE");
    Deno.copyFileSync("README.md", "build/README.md");
  },
});
