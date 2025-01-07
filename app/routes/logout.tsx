import { redirect } from "react-router"
import { createClient } from "~/db/supabase.server"
import type { Route } from "./+types/logout"

export async function action({ request }: Route.ActionArgs) {
	const { supabase, headers } = createClient(request)

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (!session?.user) {
		return redirect("/", { headers })
	}

	await supabase.auth.signOut()

	return redirect("/", { headers })
}
