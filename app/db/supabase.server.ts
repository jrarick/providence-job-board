import {
	createServerClient,
	parseCookieHeader,
	serializeCookieHeader,
} from "@supabase/ssr"
import { createClient as createJsClient } from "@supabase/supabase-js"

export function createClient(request: Request) {
	const cookies = parseCookieHeader(request.headers.get("Cookie") ?? "")
	const headers = new Headers()

	const supabase = createServerClient(
		// biome-ignore lint/style/noNonNullAssertion: environment variable
		process.env.SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: environment variable
		process.env.SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookies
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							headers.append(
								"Set-Cookie",
								serializeCookieHeader(name, value, options),
							)
						})
					} catch (error) {
						console.error("Error setting cookies:", error)
					}
				},
			},
		},
	)

	return { supabase, headers }
}

export function createAuthAdminClient() {
	const adminSupabase = createJsClient(
		// biome-ignore lint/style/noNonNullAssertion: environment variable
		process.env.SUPABASE_URL!,
		// biome-ignore lint/style/noNonNullAssertion: environment variable
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				autoRefreshToken: true,
				persistSession: false,
			},
		},
	)

	return { adminSupabase }
}
