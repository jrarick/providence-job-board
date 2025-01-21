import {
	type RouteConfig,
	index,
	layout,
	route,
} from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
	route("register", "routes/register.tsx"),
	route("login", "routes/login.tsx"),
	route("logout", "routes/logout.tsx"),
	route("jobs", "routes/jobs.tsx", [route(":jobId", "routes/jobs.id.tsx")]),
	route("forgot-password", "routes/forgot-password.tsx"),
	route("post-a-job", "routes/post-a-job.tsx"),
	layout("layouts/privacy-policy.tsx", [
		route("privacy-policy", "routes/privacy-policy.mdx"),
	]),
	route("job-seeker-profile", "routes/job-seeker-profile.tsx", [
		route("add-education", "routes/add-education.tsx"),
	]),
] satisfies RouteConfig
