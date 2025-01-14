import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
	route("register", "routes/register.tsx"),
	route("login", "routes/login.tsx"),
	route("logout", "routes/logout.tsx"),
	route("jobs", "routes/jobs.tsx", [route(":id", "routes/jobs.id.tsx")]),
	route("forgot-password", "routes/forgot-password.tsx"),
	route("post-a-job", "routes/post-a-job.tsx"),
] satisfies RouteConfig
