import {
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from "react-router"
import providenceIcon from "./assets/providence-icon.svg"

import type { Route } from "./+types/root"
import stylesheet from "./app.css?url"

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

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				<Header />
				{children}
				<Footer />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
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
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}

function Header() {
	return (
		<header className="border-b border-border bg-card px-6 py-6 text-card-foreground sm:px-12">
			<div className="flex justify-center">
				<Link
					to="/"
					className="max-w-1/2 font-display text-2xl font-medium uppercase tracking-widest sm:text-3xl"
				>
					<div>Providence</div>
					<div>Job Board</div>
				</Link>
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
			className="bg-footer text-footer-foreground selection:!bg-footer-foreground selection:!text-footer"
			aria-labelledby="footer-heading"
		>
			<h2 id="footer-heading" className="sr-only">
				Footer
			</h2>
			<div className="mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-8">
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
						<p className="max-w-96 text-sm leading-6 text-footer-foreground">
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
										className="font-display text-lg font-bold uppercase leading-6 tracking-widest text-footer-foreground transition-colors hover:text-footer-foreground/60"
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
									className="font-display text-lg font-bold uppercase leading-6 tracking-widest text-footer-foreground transition-colors hover:text-footer-foreground/60"
								>
									Providence Website
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="mt-16 flex flex-col justify-between space-y-6 border-t border-white/10 pt-8 md:flex-row md:space-y-0">
					<p className="text-xs leading-5">
						&copy; 2024 Providence Church. All rights reserved.
					</p>
					<p className="max-w-96 text-xs leading-5 text-muted-foreground">
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
