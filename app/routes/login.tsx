import { getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { LoaderCircleIcon } from "lucide-react"
import { Form, Link, redirect, useNavigation } from "react-router"
import Container from "~/components/shell/container"
import { Button } from "~/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { createClient } from "~/db/supabase.server"
import { loginSchema } from "~/schemas/login"
import type { Route } from "./+types/login"

export async function loader({ request }: Route.LoaderArgs) {
	const { supabase, headers } = createClient(request)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (user) {
		return redirect("/")
	}

	return { headers }
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: loginSchema })

	if (submission.status !== "success") {
		return { lastResult: submission.reply() }
	}

	return redirect("/")
}

export default function Login({ actionData }: Route.ComponentProps) {
	const [form, fields] = useForm({
		lastResult: actionData?.lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: loginSchema })
		},
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
	})

	const navigation = useNavigation()
	const isNotIdle = navigation.state !== "idle"

	return (
		<Container>
			<div className="mx-auto max-w-sm">
				<Card className="max-w-xl">
					<CardHeader>
						<CardTitle>Login</CardTitle>
						<CardDescription>Sign in to your account.</CardDescription>
					</CardHeader>
					<CardContent>
						<Form
							className="flex flex-col gap-5"
							method="post"
							id={form.id}
							onSubmit={form.onSubmit}
							noValidate
						>
							<div className="space-y-1">
								<Label htmlFor={fields.email.id}>Email</Label>
								<Input
									{...getInputProps(fields.email, {
										type: "email",
										ariaDescribedBy: fields.email.descriptionId,
									})}
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.email.errorId}
								>
									{fields.email.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.password.id}>Password</Label>
								<Input
									{...getInputProps(fields.password, {
										type: "password",
										ariaDescribedBy: fields.password.descriptionId,
									})}
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.password.errorId}
								>
									{fields.password.errors}
								</div>
							</div>
							<Button type="submit" disabled={isNotIdle}>
								{isNotIdle ? (
									<>
										<LoaderCircleIcon className="animate-spin" />
										Logging In...
									</>
								) : (
									"Login"
								)}
							</Button>
						</Form>
						<div className="mt-6 text-right">
							<Link
								to="/register"
								className="font-medium text-muted-foreground text-xs underline"
							>
								Not registered?
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</Container>
	)
}
