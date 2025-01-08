import {
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

import type { Route } from "./+types/root"
import stylesheet from "./app.css?url"
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

export async function loader({ request }: Route.LoaderArgs) {
	const { supabase, headers: supabaseHeaders } = createClient(request)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const { toast, headers: toastHeaders } = await getToast(request)

	return data(
		{
			userName: user
				? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
				: null,
			toast,
		},
		{
			headers: combineHeaders(supabaseHeaders, toastHeaders),
		},
	)
}

export function Layout({ children }: { children: React.ReactNode }) {
	const rootLoaderData = useRouteLoaderData("root")

	const userName = rootLoaderData?.userName as string | undefined

	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-body text-body-foreground selection:bg-primary selection:text-primary-foreground">
				<Header userName={userName} />
				{children}
				<Footer />
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
		<main className="container mx-auto p-4 pt-16">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full overflow-x-auto p-4">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}

function Header({ userName }: { userName?: string }) {
	return (
		<header className="border-border border-b bg-card px-6 py-6 text-card-foreground sm:px-12">
			<div className="flex justify-center">
				<Link
					to="/"
					className="max-w-1/2 font-display font-medium text-2xl uppercase tracking-widest sm:text-3xl"
				>
					<div>Providence</div>
					<div>Job Board</div>
				</Link>
				{userName && (
					<div className="ml-4 text-primary text-sm">Welcome, {userName}!</div>
				)}
			</div>
		</header>
	)
}

function Footer() {
	const footerItems = [
		{ name: "Browse Jobs", href: "/jobs" },
		{ name: "Advertise Job", href: "/advertise-job" },
		{ name: "My Account", href: "/profile" },
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
						&copy; 2024 Providence Church. All rights reserved.
					</p>
					<p className="max-w-96 text-muted-foreground text-xs leading-5">
						Experiencing an issue? Email{" "}
						<a
							href="mailto:josh@longhorndesign.studio"
							className="hover:underline"
						>
							josh@longhorndesign.studio
						</a>{" "}
						with a description of the problem.
					</p>
				</div>
			</div>
		</footer>
	)
}
