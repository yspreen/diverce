# Diverce

A tool for converting Next.js projects from Vercel to Cloudflare.

## What it does

Diverce helps you migrate your Next.js projects from Vercel to Cloudflare by:

- Converting your project to use `@opennextjs/cloudflare`
- Creating/updating `wrangler.jsonc` configuration
- Removing any references to `@cloudflare/next-on-pages` or edge runtime
- Updating `package.json` scripts for Cloudflare deployment
- Adding necessary configuration files

## Prerequisites

- Node.js 18+
- A Vercel account with Next.js projects
- A Cloudflare account

## Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/ygwyg/diverce.git
   cd diverce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Vercel API token:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Vercel API token, which you can create at https://vercel.com/account/tokens

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Visit http://localhost:3000 to use the app

## Usage

1. Visit the dashboard to see your Vercel Next.js projects
2. Select the project you want to convert
3. Configure conversion options:
   - Enable KV Cache (optional)
   - Create a new branch (recommended)
   - Commit and push changes (optional)
4. Start the conversion process
5. Follow the logs to monitor progress
6. Once completed, follow the instructions to deploy to Cloudflare

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server

## License

MIT 