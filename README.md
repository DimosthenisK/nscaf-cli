nscaf-cli
=========

A NestJS Scaffolding CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/nscaf-cli.svg)](https://npmjs.org/package/nscaf-cli)
[![Downloads/week](https://img.shields.io/npm/dw/nscaf-cli.svg)](https://npmjs.org/package/nscaf-cli)
[![License](https://img.shields.io/npm/l/nscaf-cli.svg)](https://github.com/dimosthenisK/nscaf-cli/blob/master/package.json)

<!-- toc -->
* [About](#about)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# About
Made with oclif - the open CLI framework.

This is a cli to generate advanced modules for nestJS. These modules include the CRUD actions from @nestjsx/crud.

Note:

You must have an entityService class that the generated modules will inherit from in case of database requirements.

This is a sample EntityService:
```Typescript
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class EntityService<T> extends TypeOrmCrudService<T> {
    get repository(): Repository<T> {
        return this.repo;
    }

    constructor(repo: Repository<T>) {
        super(repo);
    }
}

```

# Usage
<!-- usage -->
```sh-session
$ npm install -g nscaf-cli
$ nscaf COMMAND
running command...
$ nscaf (-v|--version|version)
nscaf-cli/1.4.0 win32-x64 node-v10.16.0
$ nscaf --help [COMMAND]
USAGE
  $ nscaf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nscaf help [COMMAND]`](#nscaf-help-command)
* [`nscaf nestmodule MODULENAME`](#nscaf-nestmodule-modulename)

## `nscaf help [COMMAND]`

display help for nscaf

```
USAGE
  $ nscaf help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src\commands\help.ts)_

## `nscaf nestmodule MODULENAME`

Generate a new NestJS Module

```
USAGE
  $ nscaf nestmodule MODULENAME

OPTIONS
  -h, --help  show CLI help
```

_See code: [src\commands\nestmodule.ts](https://github.com/dimosthenisK/nscaf-cli/blob/v1.4.0/src\commands\nestmodule.ts)_
<!-- commandsstop -->
