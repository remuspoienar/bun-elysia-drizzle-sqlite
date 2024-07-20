# ![RealWorld Example App](logo.png)
######


![Bun](assets/bun.png) ![ElysiaJS](assets/elysia.jpg) ![DrizzleORM](assets/drz.png)

###
> ### [Bun](https://bun.sh/) + [Elysia.JS](https://elysiajs.com/) + [DrizzleORM](https://orm.drizzle.team/) (with [bun:sqlite](https://bun.sh/docs/api/sqlite) for sync/async database) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

### [Demo](https://demo.realworld.io/)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

This codebase was created to demonstrate a fully fledged fullstack application built with **Elysia** including CRUD operations, authentication, routing, pagination, and more.

We've gone to great lengths to adhere to the **Elysia** community styleguides & best practices.

For more information on how to this works with other frontends/backends, head over to the [RealWorld](https://github.com/gothinkster/realworld) repo.

# How it works

> **ElysiaJS** is a web framework written in Bun so i'm using that as the runtime for this project as well
> SQLite was the db choice because of the new blazing fast **bun:sqlite** which even has **sync APIs**, and adding **drizzle-orm** on top for easier data fetching and for db migrations management(with **drizzle-kit**)

The point of using these is also have great DX by offered by the typescript support they provide.
For instance types can be inferred from schemas(from Elysia's typedbox integration module "**t**") and tables(from drizzle schema definitions), so we rarely have to defined types that have to be in sync with some other objects.
On top of that whenver you add something inside a middleware(or plugin) it will be available in autocomplete down the line

## Structure

Structure wise this is closer to something like NestJS, since Elysia is not really opinionated on naming/structure it a higher level. This is an MVC pattern based structure, where each resource(article,user,etc) will have its own folder.

### src/api folder

- `*.controller.ts` denotes a controller file, which is an Elysia plugin (separated for each resource as recommended by [the docs](https://elysiajs.com/essential/plugin.html#plugin))
- `*.service.ts` will hold any logic, to keep controllers lean
- `*.schema.ts` file will hold related schema objects and types either inferred or generated from them, will be used in both controller and service files
- `*.utils.ts` optionally for even more granular logic related to a resource

### src/db folder

Will contain logic to create a database connection, a migration script and the schema definitions
Note that /sqlite folder will contain the DB files and the generated migrations

:warning: **Pro tip** In order to generate sql migration scripts one needs only to change the `schema.ts` file and run `bun migration:create`, drizzle-kit will figure out how to generate sql from those changes

### src/test folder

A few integration tests, using an in-memory sqlite database

### Config files

- `*.env` files that will automatically be loaded by Bun when running either the server or the tests
- `drizzle.config.ts` used to cofigure drizzle/sqlite integration
- `bunfig.toml` used for the tests setup
- Good old `package.json` and `tsconfig.json`

Last but not least this repo is not just a fork of the realworld starter kit but it has the realworld repo as a git submodule, to access all the extra goodies you might need

# Getting started

Install dependencies

> bun install

Setup

> bun migration:run

Start local server

> bun dev

Run local tests

> bun test

Run the integration tests(from the realworld submodule)
Requires the local server to be started

> APIURL=http://localhost:3001/api ./realworld/api/run-api-tests.sh


<!-- <style type="text/css" style="display: none">
  *:has(>img[src*="#logo"]) {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  img[src*="#bunlogo"] {
    width:100px;
    height:90px;
  }
  img[src*="#elysialogo"] {
    width:250px;
}
</style> -->