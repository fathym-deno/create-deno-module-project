import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.2/command/mod.ts";

await new Command()
  .name("create-deno-module-project")
  .version("0.0.0")
  .description("Command line framework for Deno")
  .action(async (options, ...args) => {
    const command = new Deno.Command(Deno.execPath(), {
      args: [
        "eval",
        "console.log('hello'); console.error('world')",
      ],
    });

    const { code, stdout, stderr } = await command.output();

    console.log(options);
    console.log(args);
    console.assert(code === 0);
    console.assert("world\n" === new TextDecoder().decode(stderr));
    console.log(new TextDecoder().decode(stdout));
  })
  .parse(Deno.args);
