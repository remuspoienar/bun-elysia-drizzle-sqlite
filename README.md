# ![RealWorld Example App](logo.png)

![ElysiaJS](https://private-user-images.githubusercontent.com/35027979/318406657-2aa06df7-9acf-46fb-9cbc-3d218dee43ac.jpg?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTY4NDQ5NDcsIm5iZiI6MTcxNjg0NDY0NywicGF0aCI6Ii8zNTAyNzk3OS8zMTg0MDY2NTctMmFhMDZkZjctOWFjZi00NmZiLTljYmMtM2QyMThkZWU0M2FjLmpwZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDA1MjclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwNTI3VDIxMTcyN1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTQ5NmUyYmZkYzE3MDk3YTNkNzYyOTBjOWVjYzUyMDQ5MDQwMmUyMTRiY2E1YTk5NGVhMjE2OTUzYjEyNGFkNTYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.duEOUbauAP2jiQ1Tyh62tExe00NgkqdNnWLwyuCLhv8) ![DrizzleORM](https://github.com/drizzle-team/drizzle-orm/raw/main/misc/readme/logo-github-sq-light.svg#gh-light-mode-only) ![Bun](https://user-images.githubusercontent.com/709451/182802334-d9c42afe-f35d-4a7b-86ea-9985f73f20c3.png)

> ### [Elysia.JS](https://elysiajs.com/) + [Bun](https://bun.sh/) + [DrizzleORM](https://orm.drizzle.team/) (with [bun:sqlite](https://bun.sh/docs/api/sqlite) for sync/async database) codebase containing real world examples (CRUD, auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld) spec and API.

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
