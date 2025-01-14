import { PortableText } from "@portabletext/react"
import { ClockIcon, MapPinIcon } from "lucide-react"
import { Link, Outlet, data as dataResponse, redirect } from "react-router"
import Container from "~/components/shell/container"
import { createClient } from "~/db/supabase.server"
import { timeSincePosted } from "~/lib/utils"
import type { Route } from "./+types/jobs"

export async function loader({ request }: Route.LoaderArgs) {
	const { supabase, headers } = createClient(request)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect("/login", { headers })
	}

	const { data, error } = await supabase
		.from("jobs")
		.select(
			`
      id,
      categories,
      title,
      company_name,
      location,
      description,
      created_at
    `,
		)
		.order("created_at", { ascending: false })

	const jobPreviews:
		| {
				id: number
				categories: string[]
				title: string
				company_name: string
				location: string
				description: string
				created_at: string
		  }[]
		| null = data

	if (error) {
		throw new Error(`Error fetching jobs: ${error.message}`)
	}

	return dataResponse({ jobPreviews }, { headers })
}

export default function Jobs({ loaderData }: Route.ComponentProps) {
	if (loaderData.jobPreviews?.length === 0) {
		return <p>No jobs found.</p>
	}

	return (
		<Container className="max-w-2xl">
			<h1 className="font-display font-medium text-4xl">Latest Jobs</h1>
			<div className="mt-12 divide-y divide-border border-border border-y">
				{loaderData.jobPreviews?.map((jobPreview) => (
					<div
						key={jobPreview.id}
						className="relative p-6 transition-colors hover:bg-background"
					>
						<div className="mb-4 flex flex-row flex-wrap gap-3">
							{jobPreview.categories.map((category) => (
								<span
									key={category}
									className="inline-flex items-center rounded bg-primary px-2 py-1 font-medium text-primary-foreground text-xs ring-1 ring-primary-foreground/10 ring-inset"
								>
									{category}
								</span>
							))}
						</div>
						<Link
							to={`/jobs/${jobPreview.id}`}
							preventScrollReset
							className="line-clamp-1 text-ellipsis font-display font-medium text-2xl"
						>
							{jobPreview.title}
							<span className="absolute inset-0" />
						</Link>
						<p className="mt-2 font-semibold text-lg text-muted-foreground ">
							{jobPreview.company_name}
						</p>
						<div className="mt-2 line-clamp-3 h-[4.5rem] text-ellipsis text-longform-foreground">
							<PortableText value={JSON.parse(jobPreview.description)} />
						</div>
						<div className="mt-6 flex space-x-6 font-bold text-muted-foreground leading-5">
							<div className="flex space-x-2">
								<ClockIcon className="h-4 w-auto flex-none" />
								<span className="font-bold text-muted-foreground text-xs">
									{timeSincePosted(new Date(jobPreview.created_at))}
								</span>
							</div>
							<div className="flex space-x-2">
								<MapPinIcon className="h-4 w-auto flex-none" />
								<span className="font-bold text-muted-foreground text-xs">
									{jobPreview.location || "Location not specified"}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
			<Outlet />
		</Container>
	)
}
