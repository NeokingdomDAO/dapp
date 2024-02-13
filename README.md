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

- Create a new file inside the `./lib/graphql/queries/subgraph/` folder
- Copy the way other queries are structured to be able to generate TS types
- When the query is ready or after each update remember to run `pnpm codegen:subgraph`
