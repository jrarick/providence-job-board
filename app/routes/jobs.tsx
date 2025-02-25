import { PortableText } from "@portabletext/react"
import { ClockIcon, LoaderCircleIcon, MapPinIcon } from "lucide-react"
import { Link, Outlet, data, redirect } from "react-router"
import Container from "~/components/shell/container"
import { ClientOnly } from "~/components/utility/client-only"
import { createClient } from "~/db/supabase.server"
import { timeSincePosted } from "~/lib/utils"
import type { JobPreview } from "~/schemas/job"
import type { Route } from "./+types/jobs"

export async function loader({ request }: Route.LoaderArgs) {
	const { supabase, headers } = createClient(request)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirect("/login", { headers })
	}

	const jobPreviews = await supabase
		.from("jobs")
		.select(
			`
      id,
      categories,
      title,
      companyName:company_name,
      location,
      description,
      createdAt:created_at
    `,
		)
		.order("created_at", { ascending: false })

	if (jobPreviews.error) {
		throw new Error(`Error fetching jobs: ${jobPreviews.error.message}`)
	}

	const jobPreviewsTyped: JobPreview[] = jobPreviews.data

	return data({ jobPreviews: jobPreviewsTyped }, { headers })
}

export default function Jobs({ loaderData }: Route.ComponentProps) {
	if (loaderData.jobPreviews?.length === 0) {
		return <p>No jobs found.</p>
	}

	return (
		<Container className="max-w-2xl">
			<h1 className="px-4 font-display font-medium text-4xl">Latest Jobs</h1>
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
							className="line-clamp-1 text-ellipsis font-display font-medium text-xl sm:text-2xl"
						>
							{jobPreview.title}
							<span className="absolute inset-0" />
						</Link>
						<p className="mt-2 font-semibold text-base text-muted-foreground sm:text-lg ">
							{jobPreview.companyName}
						</p>
						<div className="mt-2 line-clamp-3 h-16 text-ellipsis text-longform-foreground text-sm sm:h-[4.5rem] sm:text-base">
							<PortableText value={JSON.parse(jobPreview.description)} />
						</div>
						<div className="mt-6 flex space-x-6 font-bold text-muted-foreground leading-5">
							<div className="flex space-x-2">
								<ClockIcon className="h-4 w-auto flex-none" />
								<ClientOnly
									fallback={
										<LoaderCircleIcon className="size-4 animate-spin" />
									}
								>
									{() => (
										<span className="font-bold text-muted-foreground text-xs">
											{timeSincePosted(new Date(jobPreview.createdAt))}
										</span>
									)}
								</ClientOnly>
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
