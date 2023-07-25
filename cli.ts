import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/mod.ts";

await new Command()
  .name("create-deno-module-project")
  .version("0.0.0")
  .description("Command line framework for Deno")
  .action((options, ...args) => {
    console.log(options);
    console.log(args);

    console.log("Hello world");
  })
  .parse(Deno.args);
