import { PortableText } from "@portabletext/react"
import {
	BanknoteIcon,
	BriefcaseIcon,
	BuildingIcon,
	CalendarIcon,
	CircleAlertIcon,
	GlobeIcon,
	MapPinIcon,
} from "lucide-react"
import { useState } from "react"
import { data, isRouteErrorResponse, useNavigate } from "react-router"
import { ClientOnly } from "~/components/client-only"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer"
import { ScrollArea } from "~/components/ui/scroll-area"
import { createClient } from "~/db/supabase.server"
import { useMediaQuery } from "~/hooks/use-media-query"
import { formatSalaryString } from "~/lib/utils"
import type { Job } from "~/schemas/job"
import type { Route } from "./+types/jobs.id"

export async function loader({ request, params }: Route.LoaderArgs) {
	const { supabase, headers } = createClient(request)

	const job = await supabase
		.from("jobs")
		.select(`
			id,
			createdAt:created_at,
			updatedAt:updated_at,
			title,
			companyName:company_name,
			categories,
			employmentType:employment_type,
			description,
			salaryMin:salary_min,
			salaryMax:salary_max,
      salaryType:salary_type,
      location,
      workSetting:work_setting,
      companyWebsite:company_website,
			howToApply:how_to_apply,
			profiles (
				id,
				firstName:first_name,
				lastName:last_name
			)
		`)
		.eq("id", params.jobId)
		.single()

	if (job.error) {
		throw data(`Could not find a job matching job id ${params.jobId}`, {
			status: 404,
			headers,
		})
	}

	const jobTyped = job.data as unknown as Omit<Job, "profileId"> & {
		profiles: { id: string; firstName: string; lastName: string }
	}

	return data({ job: jobTyped }, { headers })
}

export default function JobsId({ loaderData }: Route.ComponentProps) {
	const [open, setOpen] = useState(true)
	const navigate = useNavigate()
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const { job } = loaderData
	const jobPoster = job.profiles

	const details = [
		{
			label: "Salary",
			icon: BanknoteIcon,
			value: formatSalaryString(job.salaryType, job.salaryMin, job.salaryMax),
		},
		{
			label: "Type",
			icon: BriefcaseIcon,
			value: job.employmentType,
		},
		{
			label: "Location",
			icon: MapPinIcon,
			value: job.location || "Not specified",
		},
		{
			label: "Setting",
			icon: BuildingIcon,
			value: job.workSetting,
		},
		{
			label: "Website",
			icon: GlobeIcon,
			value: job.companyWebsite || "Not specified",
		},
	]

	if (isDesktop) {
		return (
			<Dialog
				open={open}
				onOpenChange={(open) => {
					if (!open) {
						setOpen(false)
						setTimeout(() => {
							navigate("/jobs", {
								preventScrollReset: true,
							})
							// 200 ms delay to allow time for fade out to complete animation
						}, 200)
					}
				}}
				modal={true}
			>
				<DialogContent className="flex max-w-5xl flex-col gap-0 p-0 [&>button:last-child]:top-3.5">
					<DialogHeader className="contents space-y-0 text-left">
						<DialogTitle className="border-border border-b px-6 py-4 font-display font-medium text-2xl">
							{job.title} - {job.companyName}
						</DialogTitle>
						<DialogDescription asChild className="text-foreground">
							<div className="grid grid-cols-8 divide-x divide-x-border">
								<div className="col-span-3 px-6 py-4">
									<h2 className="my-6 font-display font-medium text-3xl text-foreground">
										Details
									</h2>
									<dl className="space-y-5">
										{details.map((detail) => (
											<div className="flex gap-4" key={detail.label}>
												<dt className="flex w-24 items-center space-x-2 text-sm leading-5">
													<detail.icon className="h-5 w-auto flex-none" />
													<span>{detail.label}</span>
												</dt>
												<dd>
													{detail.label === "Website" &&
													detail.value !== "Not specified" ? (
														<a
															href={detail.value}
															target="_blank"
															rel="noreferrer"
															className="inline-flex rounded bg-secondary px-2 py-1 text-left font-medium text-secondary-foreground text-xs ring-1 ring-secondary-foreground/10 ring-inset hover:underline"
														>
															{detail.value}
														</a>
													) : (
														<span className="inline-flex items-center rounded bg-secondary px-2 py-1 font-medium text-secondary-foreground text-xs ring-1 ring-secondary-foreground/10 ring-inset">
															{detail.value}
														</span>
													)}
												</dd>
											</div>
										))}
									</dl>
								</div>
								<div className="col-span-5 max-h-[min(580px,70dvh)] overflow-y-auto">
									<ScrollArea className="px-6 py-4">
										<h2 className="mt-6 font-display font-medium text-3xl text-foreground">
											Job Description
										</h2>
										<div className="prose prose-prov-blue mt-4 border-border border-b pb-8">
											<PortableText value={JSON.parse(job.description)} />
										</div>
										<h2 className="mt-6 font-display font-medium text-3xl text-foreground">
											How To Apply
										</h2>
										<div className="prose prose-prov-blue mt-4">
											<PortableText value={JSON.parse(job.howToApply)} />
										</div>
									</ScrollArea>
								</div>
							</div>
						</DialogDescription>
						<DialogFooter className="items-center border-border border-t px-2 py-2 sm:justify-between">
							<div className="font-bold text-muted-foreground text-xs">
								<div>Posted by</div>
								<div>
									{jobPoster.firstName} {jobPoster.lastName}
								</div>
							</div>
							<div className="flex space-x-2 leading-5">
								<CalendarIcon className="h-4 w-auto flex-none text-muted-foreground" />
								<ClientOnly>
									{() => (
										<time
											dateTime={job.createdAt.toString()}
											className="font-bold text-muted-foreground text-xs"
										>
											{new Date(job.createdAt).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</time>
									)}
								</ClientOnly>
							</div>
						</DialogFooter>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer
			open={open}
			onOpenChange={() => {
				setOpen(false)
				setTimeout(() => {
					navigate("/jobs", {
						preventScrollReset: true,
					})
					// 200 ms delay to allow time for fade out to complete animation
				}, 200)
			}}
		>
			<DrawerContent className="max-h-[85lvh]">
				<DrawerHeader className="border-border border-b text-left">
					<DrawerTitle className="text-xl">{job.title}</DrawerTitle>
					<DrawerDescription className="text-base">
						{job.companyName}
					</DrawerDescription>
				</DrawerHeader>
				<ScrollArea className="overflow-y-auto">
					<div className="p-4">
						<h2 className="my-4 font-display font-medium text-2xl text-foreground">
							Details
						</h2>
						<dl className="space-y-3 border-border border-b pb-8">
							{details.map((detail) => (
								<div className="flex gap-4" key={detail.label}>
									<dt className="flex w-24 items-center space-x-2 text-sm leading-5">
										<detail.icon className="h-5 w-auto flex-none" />
										<span>{detail.label}</span>
									</dt>
									<dd>
										{detail.label === "Website" &&
										detail.value !== "Not specified" ? (
											<a
												href={detail.value}
												target="_blank"
												rel="noreferrer"
												className="inline-flex rounded bg-secondary px-2 py-1 text-left font-medium text-secondary-foreground text-xs ring-1 ring-secondary-foreground/10 ring-inset hover:underline"
											>
												{detail.value}
											</a>
										) : (
											<span className="inline-flex items-center rounded bg-secondary px-2 py-1 font-medium text-secondary-foreground text-xs ring-1 ring-secondary-foreground/10 ring-inset">
												{detail.value}
											</span>
										)}
									</dd>
								</div>
							))}
						</dl>
						<h2 className="mt-6 font-display font-medium text-2xl text-foreground">
							Job Description
						</h2>
						<div className="prose prose-prov-blue prose-sm mt-4 border-border border-b pb-8">
							<PortableText value={JSON.parse(job.description)} />
						</div>
						<h2 className="mt-6 font-display font-medium text-2xl text-foreground">
							How To Apply
						</h2>
						<div className="prose prose-prov-blue prose-sm mt-4">
							<PortableText value={JSON.parse(job.howToApply)} />
						</div>
					</div>
					<DrawerFooter className="pt-2">
						<DrawerClose asChild>
							<Button variant="outline">Close</Button>
						</DrawerClose>
					</DrawerFooter>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	const [open, setOpen] = useState(true)
	const navigate = useNavigate()

	const status =
		isRouteErrorResponse(error) && error.status === 404
			? "404 Not found"
			: "Unknown error"
	const message = isRouteErrorResponse(error)
		? error.data
		: "Please try again later"

	if (isRouteErrorResponse(error)) {
		return (
			<AlertDialog
				open={open}
				onOpenChange={(open) => {
					if (!open) {
						setOpen(false)
						setTimeout(() => {
							navigate("/jobs", {
								preventScrollReset: true,
							})
							// 200 ms delay to allow time for fade out to complete animation
						}, 200)
					}
				}}
			>
				<AlertDialogContent>
					<div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
						<div
							className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
							aria-hidden="true"
						>
							<CircleAlertIcon
								className="opacity-80"
								size={16}
								strokeWidth={2}
							/>
						</div>
						<AlertDialogHeader>
							<AlertDialogTitle>{status}</AlertDialogTitle>
							<AlertDialogDescription>{message}</AlertDialogDescription>
						</AlertDialogHeader>
					</div>
					<AlertDialogFooter className="mt-4">
						<AlertDialogAction>Close</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		)
	}
}
