import {
	Form,
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	data,
	isRouteErrorResponse,
	useRouteLoaderData,
} from "react-router"
import providenceIcon from "./assets/providence-icon.svg"

import {
	BriefcaseIcon,
	ChevronsUpDownIcon,
	HomeIcon,
	LogOutIcon,
	PenLineIcon,
	SettingsIcon,
	SquareUserIcon,
	UserPenIcon,
} from "lucide-react"
import type { Route } from "./+types/root"
import stylesheet from "./app.css?url"
import Container from "./components/shell/container"
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar"
import { buttonVariants } from "./components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { ProgressBar } from "./components/ui/progress-bar"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from "./components/ui/sidebar"
import { Toaster as Sonner } from "./components/ui/sonner"
import { createClient } from "./db/supabase.server"
import { useToast } from "./hooks/toaster"
import { getToast } from "./lib/toast.server"
import { combineHeaders } from "./lib/utils"

export const meta: Route.MetaFunction = () => {
	return [
		{ title: "Providence Job Board" },
		{
			name: "description",
			content: "A job board for Providence Church in Austin Texas",
		},
		{ name: "og:title", content: "Providence Job Board" },
		{
			name: "og:description",
			content: "A job board for Providence Church in Austin Texas",
		},
	]
}

export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: "https://use.typekit.net/jfz8jfw.css" },
	{ rel: "stylesheet", href: stylesheet },
]

interface User {
	fullName?: string
	initials?: string
	email?: string
	avatarUrl?: string
}

export async function loader({ request }: Route.LoaderArgs) {
	const { supabase, headers: supabaseHeaders } = createClient(request)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const userProfile = await supabase
		.from("profiles")
		.select(`
		firstName:first_name,
		lastName:last_name,
		avatarUrl:avatar_url
	`)
		.eq("id", user?.id)
		.single()

	const { toast, headers: toastHeaders } = await getToast(request)

	const fullName = userProfile.error
		? undefined
		: `${userProfile.data.firstName} ${userProfile.data.lastName}`
	const initials = userProfile.error
		? undefined
		: userProfile.data.firstName.charAt(0).toUpperCase() +
			userProfile.data.lastName.charAt(0).toUpperCase()
	const email = user?.email
	const avatarUrl = userProfile.error ? undefined : userProfile.data.avatarUrl

	return data(
		{
			user: user
				? {
						fullName,
						initials,
						email,
						avatarUrl,
					}
				: undefined,
			toast,
		},
		{
			headers: combineHeaders(supabaseHeaders, toastHeaders),
		},
	)
}

export function Layout({ children }: { children: React.ReactNode }) {
	const rootLoaderData = useRouteLoaderData<typeof loader>("root")

	const { user } = rootLoaderData ?? {}

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="selection:bg-primary selection:text-primary-foreground">
				<SidebarProvider>
					{user && <AppSidebar user={user} />}
					<SidebarInset className="bg-body text-body-foreground">
						<Header user={user} />
						{children}
						<Footer />
						<ProgressBar />
					</SidebarInset>
				</SidebarProvider>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App({ loaderData }: Route.ComponentProps) {
	useToast(loaderData?.toast)

	return (
		<>
			<Outlet />
			<Sonner position="top-center" closeButton={true} />
		</>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!"
	let details = "An unexpected error occurred."
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error"
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<Container>
			<main className="grid place-items-center p-12 px-6 lg:px-8">
				<div className="text-center">
					<p className="font-semibold text-base text-foreground">404</p>
					<h1 className="mt-4 text-balance font-display font-medium text-5xl text-foreground tracking-tight sm:text-7xl">
						Page not found
					</h1>
					<p className="mt-6 max-w-lg text-pretty font-medium text-base text-gray-500 sm:text-lg/8">
						Sorry, we couldn’t find the page you’re looking for. If you believe
						this is an error, please contact support.
					</p>
					<div className="mt-10 flex flex-wrap items-center justify-center gap-6">
						<Link to="/" className={buttonVariants({ variant: "default" })}>
							Go Back Home
						</Link>
						<a
							href="mailto:rarick.joshua.e@gmail.com"
							className={buttonVariants({ variant: "link" })}
						>
							Contact support <span aria-hidden="true">&rarr;</span>
						</a>
					</div>
				</div>
			</main>
		</Container>
	)
}

function AppSidebar({ user }: { user: User }) {
	const jobSeekerItems = [
		{
			title: "Browse Jobs",
			url: "/jobs",
			icon: BriefcaseIcon,
		},
		{
			title: "Manage Job Seeker Profile",
			url: "/job-seeker-profile",
			icon: UserPenIcon,
		},
	]

	const employerItems = [
		{
			title: "Post a Job",
			url: "/post-a-job",
			icon: PenLineIcon,
		},
		{
			title: "Browse Job Seekers",
			url: "/job-seekers",
			icon: SquareUserIcon,
		},
	]

	const { isMobile } = useSidebar()

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<SidebarMenuButton asChild tooltip="Home">
					<Link
						to="/"
						className="flex rounded-lg bg-sidebar-primary/80 text-sidebar-primary-foreground transition-colors hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
					>
						<HomeIcon />
						<span>Home</span>
					</Link>
				</SidebarMenuButton>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>For Job Seekers</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{jobSeekerItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild tooltip={item.title}>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup>
					<SidebarGroupLabel>For Employers/Referers</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{employerItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild tooltip={item.title}>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
								>
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage src={user.avatarUrl} alt={user.fullName} />
										<AvatarFallback className="rounded-lg">
											{user.initials}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{user.fullName}
										</span>
										<span className="truncate text-xs">{user.email}</span>
									</div>
									<ChevronsUpDownIcon className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align="end"
								sideOffset={4}
							>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage src={user.avatarUrl} alt={user.fullName} />
											<AvatarFallback className="rounded-lg">
												{user.initials}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{user.fullName}
											</span>
											<span className="truncate text-xs">{user.email}</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link to="/account-settings">
										<SettingsIcon className="size-4" />
										Account Settings
									</Link>
								</DropdownMenuItem>
								<Form action="/logout" method="post">
									<DropdownMenuItem asChild>
										<button type="submit" className="w-full">
											<LogOutIcon className="size-4" />
											Log out
										</button>
									</DropdownMenuItem>
								</Form>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}

function Header({ user }: { user?: User }) {
	return (
		<header className="border-border border-b bg-card p-3 text-card-foreground">
			<div className="flex justify-between">
				{user ? <SidebarTrigger /> : <div />}
				<Link
					to="/"
					className="max-w-1/2 p-2 font-display font-medium text-xl uppercase tracking-widest sm:text-2xl"
				>
					<div>Providence</div>
					<div>Job Board</div>
				</Link>
				{/* dummy div to center logo */}
				<div />
			</div>
		</header>
	)
}

function Footer() {
	const footerItems = [
		{ name: "Account Settings", href: "/account-settings" },
		{ name: "Privacy Policy", href: "/privacy-policy" },
	]

	return (
		<footer
			className="selection:!bg-footer-foreground selection:!text-footer bg-footer text-footer-foreground"
			aria-labelledby="footer-heading"
		>
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-6 pt-16 pb-8 lg:px-8">
				<div className="md:grid md:grid-cols-2 md:gap-8">
					<div className="space-y-8">
						<Link to="/" aria-label="Home" className="max-w-min">
							<img
								height={128}
								width={128}
								src={providenceIcon}
								alt="Providence Church Logo"
							/>
						</Link>
						<p className="max-w-96 text-footer-foreground text-sm leading-6">
							The Providence job board exists as a networking platform for job
							seekers to connect with employers within the Providence Church
							community.
						</p>
					</div>
					<div className="mt-16 gap-8 md:mt-0">
						<ul className="mt-6 space-y-4">
							{footerItems.map((item) => (
								<li key={item.name}>
									<Link
										to={item.href}
										className="font-bold font-display text-footer-foreground text-lg uppercase leading-6 tracking-widest transition-colors hover:text-footer-foreground/80 active:text-footer-foreground/60"
									>
										{item.name}
									</Link>
								</li>
							))}
							<li>
								<a
									href="https://providenceaustin.com/"
									target="_blank"
									rel="noreferrer"
									className="font-bold font-display text-footer-foreground text-lg uppercase leading-6 tracking-widest transition-colors hover:text-footer-foreground/80 active:text-footer-foreground/60"
								>
									Providence Website
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-16 flex flex-col justify-between space-y-6 border-white/10 border-t pt-8 md:flex-row md:space-y-0">
					<p className="text-xs leading-5">
						&copy; {new Date().getFullYear()} Providence Church. All rights
						reserved.
					</p>
					<p className="max-w-96 text-muted-foreground text-xs leading-5">
						Experiencing an issue? Email{" "}
						<a
							href="mailto:rarick.joshua.e@gmail.com"
							className="hover:underline"
						>
							rarick.joshua.e@gmail.com
						</a>{" "}
						with a description of the problem.
					</p>
				</div>
			</div>
		</footer>
	)
}
