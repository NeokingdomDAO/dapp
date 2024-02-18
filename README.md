# Welcome to the NeoKingdom DAO dapp

This is the code for the NeoKingdom DAO dapp

## Getting started

```
pnpm i
pnpm run dev
```

## Get env variables locally

- install [vercel CLI](https://vercel.com/docs/cli)
- run `vercel link`
- set the name of the project you want the env (see [here](https://vercel.com/neokingdom-dao))
- run `vercel env pull --environment=production|staging .env.local`
- profit 💰

Note: if you want to change from i.e. teledisko to neokingdom, just re-run `vercel link` and choose `dapp-neokingdom` as project name.

## How to add a Subgraph query

- Create a new file inside the `./lib/graphql/subgraph/queries/` folder
- Copy the way other queries are structured to be able to generate TS types
- When the query is ready or after each update remember to run `pnpm codegen:subgraph`

## How to run e2e tests

You can run e2e tests with Playwright in two different ways. In both case remember to start the local server with `pnpm dev`.

The first time you should run `pnpm e2e:init` before running e2e tests. After that you can use one of the following options:

- With the CLI (faster): `pnpm e2e`
- With the UI (easier to debug): `pnpm e2e:ui`
