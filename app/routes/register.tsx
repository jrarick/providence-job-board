import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { LoaderCircleIcon } from "lucide-react"
import { Form, Link, redirect, useNavigation } from "react-router"
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
import { registerSchema } from "~/schemas/register"
import type { Route } from "./+types/register"

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
	const submission = parseWithZod(formData, { schema: registerSchema })

	if (submission.status !== "success") {
		return { lastResult: submission.reply() }
	}

	const { supabase, headers } = createClient(request)

	const newUser = await supabase.auth.signUp({
		email: submission.value.email,
		password: submission.value.password,
		options: {
			data: {
				first_name: submission.value.firstName,
				last_name: submission.value.lastName,
			},
		},
	})

	if (newUser.error) {
		throw new Error(`Error registering user: ${newUser.error.message}`)
	}

	return redirect("/", { headers })
}

export default function Register({ actionData }: Route.ComponentProps) {
	const [form, fields] = useForm({
		lastResult: actionData?.lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: registerSchema })
		},
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
	})

	const navigation = useNavigation()
	const isSubmitting = navigation.state === "submitting"

	return (
		<div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-sm">
				<Card className="max-w-xl">
					<CardHeader>
						<CardTitle>Register</CardTitle>
						<CardDescription>Create an account</CardDescription>
					</CardHeader>
					<CardContent>
						<Form
							className="flex flex-col gap-5"
							method="post"
							action="/register"
							{...getFormProps(form)}
						>
							<div className="space-y-1">
								<Label htmlFor={fields.firstName.id}>First Name</Label>
								<Input
									{...getInputProps(fields.firstName, {
										type: "text",
										ariaDescribedBy: fields.firstName.descriptionId,
									})}
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.firstName.errorId}
								>
									{fields.firstName.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.lastName.id}>Last Name</Label>
								<Input
									{...getInputProps(fields.lastName, {
										type: "text",
										ariaDescribedBy: fields.lastName.descriptionId,
									})}
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.lastName.errorId}
								>
									{fields.lastName.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.email.id}>Email Address</Label>
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
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<LoaderCircleIcon className="animate-spin" />
										Registering...
									</>
								) : (
									"Register"
								)}
							</Button>
						</Form>
						<div className="mt-6 text-right">
							<Link
								to="/login"
								className="font-medium text-muted-foreground text-xs underline underline-offset-4 transition-colors hover:text-primary"
							>
								Already have an account?
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
