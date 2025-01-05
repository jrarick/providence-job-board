import {
	type SubmissionResult,
	getInputProps,
	useForm,
} from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { Form } from "react-router"
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
import { registerSchema } from "~/schemas/register"
import type { Route } from "./+types/register"

export async function action({ request, context }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: registerSchema })

	if (submission.status !== "success") {
		return { lastResult: submission.reply() }
	}
}

export default function Register({ actionData }: Route.ComponentProps) {
	const [form, fields] = useForm({
		lastResult: actionData as SubmissionResult<string[]> | null | undefined,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: registerSchema })
		},
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
	})

	return (
		<div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-sm">
				<Card className="max-w-xl">
					<CardHeader>
						<CardTitle>Register</CardTitle>
						<CardDescription>Create an account.</CardDescription>
					</CardHeader>
					<CardContent>
						<Form
							className="flex flex-col gap-6"
							method="post"
							id={form.id}
							onSubmit={form.onSubmit}
							noValidate
						>
							<div className="space-y-1">
								<Label htmlFor="firstName">First Name</Label>
								<Input {...getInputProps(fields.firstName, { type: "text" })} />
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.firstName.errorId}
								>
									{fields.firstName.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor="lastName">Last Name</Label>
								<Input {...getInputProps(fields.lastName, { type: "text" })} />
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.lastName.errorId}
								>
									{fields.lastName.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor="email">Email Address</Label>
								<Input {...getInputProps(fields.email, { type: "email" })} />
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.email.errorId}
								>
									{fields.email.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor="password">Password</Label>
								<Input
									{...getInputProps(fields.password, { type: "password" })}
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.password.errorId}
								>
									{fields.password.errors}
								</div>
							</div>
							<Button type="submit">Submit</Button>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
