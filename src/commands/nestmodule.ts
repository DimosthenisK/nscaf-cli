import { Command, flags } from "@oclif/command";
import cli from "cli-ux";
import * as Handlebars from "handlebars";
import * as fs from "fs-extra";
import * as path from "path";
//@ts-ignore
import * as inflector from "inflector-js";

export default class NestModule extends Command {
  static description = "Generate a new NestJS Module";

  static examples = [];

  static flags = {
    help: flags.help({ char: "h" })
  };

  static args = [{ name: "modulename", required: true }];

  /**
   * Boolean prompt - if answer == yes, return true else false
   */
  async bprompt(name: string, defparam: string, required: boolean = true) {
    let q: string = await cli.prompt(name, {
      type: "normal",
      default: defparam,
      required
    });
    while (q.toLowerCase() !== "y" && q.toLowerCase() !== "n") {
      this.log("Use y/n.");
      q = await cli.prompt(name, {
        type: "normal"
      });
    }

    return q == "y";
  }

  async run() {
    const { args, flags } = this.parse(NestModule);
    args.modulename = inflector.tableize(args.modulename);

    //Get the options from the user
    let needsDBModel = await this.bprompt("Should I create a dbModel?", "y");
    /*let needsController = await this.bprompt(
      "Should I create a controller?",
      "y"
    );
    let needsToBeRegistered = await this.bprompt(
      "Should I register the module?",
      "y"
    );*/
    let isNested = await cli.prompt("Is this a submodule? Name the parent", {
      type: "normal",
      required: false
    });

    //Check for src folder
    if (await fs.pathExists(path.join(process.cwd(), "src"))) {
      this.log("Found SRC");
      if (
        !(await fs.pathExists(path.join(process.cwd(), "src", args.modulename)))
      ) {
        //Generate the module folder
        let moduleFolder: string;
        if (isNested)
          //if nested, the module goes as a subfolder
          moduleFolder = path.join(
            process.cwd(),
            "src",
            isNested,
            args.modulename
          );
        else moduleFolder = path.join(process.cwd(), "src", args.modulename);

        fs.mkdirSync(moduleFolder);

        // generate the template variables (naming mostly)
        // @see https://www.npmjs.com/package/inflector-js
        let templateVars = {
          moduleName: {
            original: args.modulename,
            capitalized: inflector.capitalize(args.modulename),
            entityName: inflector.singularize(args.modulename),
            entityNameCapitalized: inflector.capitalize(
              inflector.singularize(args.modulename)
            ),
            classified: inflector.camelize(args.modulename),
            filenamed: inflector.underscore(args.modulename)
          },
          settings: {
            needsDBModel,
            /*needsController,
            needsToBeRegistered,*/
            isNested
          }
        };
        //If a db module is not required, load the module folder instead of the dbmodule templates
        let templateDir = path.join(
          __dirname,
          needsDBModel ? "../templates/dbmodule" : "../templates/module"
        );

        let files = await fs.readdir(templateDir);
        for await (let file of files) {
          //for each template file
          let contents = (await fs.readFile(
            path.join(templateDir, file)
          )).toString(); //read contents
          let templated = Handlebars.compile(contents); //generate the template
          let withVars = templated(templateVars); //fill with the template variables
          let filename = file
            .replace("__modulename__", templateVars.moduleName.filenamed) //replace the file name and extension
            .replace(".hbs", "");
          fs.writeFile(
            //then write to src
            path.join(moduleFolder, filename),
            withVars
          );
          this.log("Wrote to " + filename);
        }
      } else
        this.error("Already found module - " + path.join(process.cwd(), "src"));
    } else this.error("SRC not found :( " + path.join(process.cwd(), "src"));
  }
}
