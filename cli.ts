import { Command } from "$cliffy";

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
