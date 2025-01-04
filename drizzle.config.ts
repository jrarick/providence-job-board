import type { Config } from "drizzle-kit"

export default {
	out: "./drizzle",
	schema: "./database/schema.ts",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		databaseId: "your-database-id",
		// biome-ignore lint/style/noNonNullAssertion: envs require non-null assertions
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
		// biome-ignore lint/style/noNonNullAssertion: envs require non-null assertions
		token: process.env.CLOUDFLARE_TOKEN!,
	},
} satisfies Config
