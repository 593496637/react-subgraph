# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a full-stack Web3 project with two main components:
- **frontend/**: React + TypeScript + Vite frontend that queries subgraph data using Apollo Client
- **my-subgraph/**: The Graph Protocol subgraph that indexes WETH events on Sepolia testnet

## Architecture

The project follows a decentralized data architecture:
1. **Smart Contract**: Sepolia WETH contract at `0xdd13E55209Fd76AfE204dBda4007C227904f0a81`
2. **Subgraph**: Indexes contract events (Transfer, Deposit, Withdrawal, Approval) and exposes GraphQL API
3. **Frontend**: Queries indexed data via GraphQL and displays transaction lists

## Development Commands

### Frontend (from `/frontend` directory)
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript check + Vite build)
- `pnpm lint` - Run ESLint

### Subgraph (from `/my-subgraph` directory)
- `yarn codegen` - Generate TypeScript types from schema
- `yarn build` - Build subgraph
- `yarn test` - Run subgraph tests with Matchstick
- `yarn deploy` - Deploy to The Graph Studio
- `yarn deploy-local` - Deploy to local Graph Node

## Key Files

- **my-subgraph/schema.graphql**: GraphQL schema defining entities (Transfer, Deposit, Withdrawal, Approval)
- **my-subgraph/subgraph.yaml**: Subgraph configuration mapping contract events to handlers
- **my-subgraph/src/sepolia-weth.ts**: Event handlers that process blockchain events
- **frontend/src/queries.ts**: GraphQL queries for fetching indexed data
- **frontend/src/components/**: React components for displaying transfers and deposits

## Dependencies

The frontend uses Apollo Client for GraphQL queries and ethers.js for blockchain interactions. The subgraph uses The Graph's AssemblyScript runtime for event processing.