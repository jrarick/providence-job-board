import { PlusIcon } from "lucide-react"
import { Link, Outlet, useRouteLoaderData } from "react-router"
import Container from "~/components/shell/container"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { buttonVariants } from "~/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip"
import type { RootLoader } from "~/root"
import type { Route } from "./+types/job-seeker-profile"

export default function JobSeekerProfile({ actionData }: Route.ComponentProps) {
	const { user } = useRouteLoaderData<RootLoader>("root") ?? {}

	const skills = [
		"JavaScript",
		"React",
		"Node.js",
		"TypeScript",
		"GraphQL",
		"MongoDB",
	]

	return (
		<>
			<Container className="max-w-3xl">
				<div className="container mx-auto p-6">
					<Card className="mx-auto w-full max-w-3xl">
						<CardHeader className="flex flex-row items-center gap-4">
							<Avatar className="h-24 w-24">
								<AvatarImage src="" alt="Profile picture" />
								<AvatarFallback className="font-display font-medium text-4xl">
									JD
								</AvatarFallback>
							</Avatar>
							<div>
								<CardTitle className="font-bold text-2xl">John Doe</CardTitle>
								<CardDescription className="text-xl">
									Senior Software Engineer
								</CardDescription>
								<p className="text-muted-foreground text-sm">
									San Francisco Bay Area
								</p>
							</div>
						</CardHeader>
						<CardContent className="space-y-6">
							<section>
								<h2 className="mb-2 font-semibold text-xl">Summary</h2>
								<p className="text-muted-foreground">
									Passionate software engineer with 8+ years of experience in
									developing scalable web applications. Skilled in React,
									Node.js, and cloud technologies. Always eager to learn and
									tackle new challenges.
								</p>
							</section>

							<Separator />

							<section>
								<div className="flex items-center justify-between">
									<h2 className="mb-2 font-semibold text-xl">Experience</h2>
									<TooltipProvider delayDuration={0}>
										<Tooltip>
											<TooltipTrigger asChild>
												<Link
													to="add-employment"
													className={buttonVariants({
														variant: "ghost",
														size: "icon",
													})}
												>
													<PlusIcon className="h-6 w-6 text-primary" />
												</Link>
											</TooltipTrigger>
											<TooltipContent>Add new employment</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<div className="space-y-4">
									<div>
										<h3 className="font-medium">
											Senior Software Engineer at Tech Innovators Inc.
										</h3>
										<p className="text-muted-foreground text-sm">
											Jan 2020 - Present
										</p>
										<ul className="mt-2 list-inside list-disc text-muted-foreground text-sm">
											<li>
												Led a team of 5 developers in creating a new
												customer-facing portal
											</li>
											<li>
												Implemented CI/CD pipelines, reducing deployment time by
												40%
											</li>
											<li>
												Mentored junior developers and conducted code reviews
											</li>
										</ul>
									</div>
									<div>
										<h3 className="font-medium">
											Software Engineer at StartUp Solutions
										</h3>
										<p className="text-muted-foreground text-sm">
											Jun 2016 - Dec 2019
										</p>
										<ul className="mt-2 list-inside list-disc text-muted-foreground text-sm">
											<li>
												Developed and maintained multiple React-based web
												applications
											</li>
											<li>
												Collaborated with UX designers to implement responsive
												designs
											</li>
											<li>
												Optimized application performance, improving load times
												by 30%
											</li>
										</ul>
									</div>
								</div>
							</section>

							<Separator />

							<section>
								<div className="flex items-center justify-between">
									<h2 className="mb-2 font-semibold text-xl">Education</h2>
									<TooltipProvider delayDuration={0}>
										<Tooltip>
											<TooltipTrigger asChild>
												<Link
													to="add-education"
													className={buttonVariants({
														variant: "ghost",
														size: "icon",
													})}
												>
													<PlusIcon className="h-6 w-6 text-primary" />
												</Link>
											</TooltipTrigger>
											<TooltipContent>Add new education</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								<div>
									<h3 className="font-medium">BS in Computer Science</h3>
									<p className="text-muted-foreground text-sm">
										University of Technology, Graduated 2016
									</p>
								</div>
							</section>

							<Separator />

							<section>
								<h2 className="mb-2 font-semibold text-xl">Certifications</h2>
								<div>
									<h3 className="font-medium">Data Science Bootcamp</h3>
									<p className="text-muted-foreground text-sm">
										University of Texas Bootcamp, Completed 2021
									</p>
								</div>
							</section>

							<Separator />

							<section>
								<h2 className="mb-2 font-semibold text-xl">Skills</h2>
								<div className="flex flex-wrap gap-2">
									{skills.map((skill) => (
										<div
											key={skill}
											className="inline-flex items-center rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground text-xs ring-1 ring-primary-foreground/10 ring-inset"
										>
											{skill}
										</div>
									))}
								</div>
							</section>
						</CardContent>
					</Card>
				</div>
			</Container>
			<Outlet />
		</>
	)
}
