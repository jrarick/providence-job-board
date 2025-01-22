import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { EditorProvider } from "@portabletext/editor"
import { LoaderCircleIcon } from "lucide-react"
import { Form, Link, useNavigation } from "react-router"
import { MultipleSelectorField } from "~/components/conform-fields/multiple-selector-field"
import { RadioGroupField } from "~/components/conform-fields/radio-group-field"
import { RichTextField } from "~/components/conform-fields/rich-text-field"
import { SelectField } from "~/components/conform-fields/select-field"
import { schemaDefinition } from "~/components/rich-text-editor/utils"
import Container from "~/components/shell/container"
import { Button, buttonVariants } from "~/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card"
import { CurrencyInput, Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { ClientOnly } from "~/components/utility/client-only"
import EMPLOYMENT_TYPE from "~/constants/employment-type"
import JOB_CATEGORY from "~/constants/job-category"
import SALARY_TYPE from "~/constants/salary-type"
import WORK_SETTING from "~/constants/work-setting"
import { createClient } from "~/db/supabase.server"
import { redirectWithToast } from "~/lib/toast.server"
import { jobSchema } from "~/schemas/job"
import editorStylesheet from "~/text-editor.css?url"
import type { Route } from "./+types/post-a-job"

export const links: Route.LinksFunction = () => {
	return [
		{
			rel: "stylesheet",
			href: editorStylesheet,
		},
	]
}

export async function loader({ request }: Route.LoaderArgs) {
	const { supabase, headers } = createClient(request)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		return redirectWithToast("/login", {
			title: "Unauthenticated",
			description: "You must be logged in to post a job.",
			type: "error",
		})
	}
}

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: jobSchema })

	if (submission.status !== "success") {
		return { lastResult: submission.reply() }
	}

	const { supabase, headers } = createClient(request)

	const { error, data } = await supabase
		.from("jobs")
		.insert([
			{
				title: submission.value.title,
				company_name: submission.value.companyName,
				company_website: submission.value.companyWebsite,
				location: submission.value.location,
				work_setting: submission.value.workSetting,
				employment_type: submission.value.employmentType,
				salary_min: submission.value.salaryMin,
				salary_max: submission.value.salaryMax,
				salary_type: submission.value.salaryType,
				description: submission.value.description,
				how_to_apply: submission.value.howToApply,
				categories: submission.value.categories,
			},
		])
		.select()

	if (error) {
		throw new Error(`Error creating job: ${error.message}`)
	}

	return redirectWithToast(
		"/jobs",
		{
			title: "Job posted successfully!",
			description: `Job posting for "${submission.value.title}" has been created.`,
			type: "success",
		},
		{
			headers,
		},
	)
}

export default function PostAJob({ actionData }: Route.ComponentProps) {
	let { lastResult } = actionData ?? {}

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: jobSchema })
		},
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
	})

	const navigation = useNavigation()
	const isSubmitting = navigation.state === "submitting"

	return (
		<Container>
			<Card className="mx-auto max-w-3xl">
				<CardHeader>
					<CardTitle className="font-display font-medium text-3xl">
						Post A Job
					</CardTitle>
					<CardDescription className="max-w-md">
						If you're a business owner posting a job, or are just an employee
						sharing a job posting on behalf of your company, please fill out
						this form.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form method="post" action="/post-a-job" {...getFormProps(form)}>
						<div className="mt-10 space-y-8 border-border/50 border-b pb-12 sm:space-y-0 sm:divide-y sm:divide-border/50 sm:border-t sm:pb-0">
							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.title.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Job Title*
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<Input
										{...getInputProps(fields.title, { type: "text" })}
										className="w-full sm:max-w-sm"
									/>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.title.errorId}
									>
										{fields.title.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.companyName.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Company Name*
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<Input
										{...getInputProps(fields.companyName, { type: "text" })}
										className="w-full sm:max-w-sm"
									/>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.companyName.errorId}
									>
										{fields.companyName.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.companyWebsite.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Company Website
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<Input
										{...getInputProps(fields.companyWebsite, {
											type: "text",
										})}
										placeholder="https://www.example.com/"
										className="w-full sm:max-w-sm"
									/>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.companyWebsite.errorId}
									>
										{fields.companyWebsite.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.categories.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Job Categories*
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<MultipleSelectorField
										meta={fields.categories}
										items={[...JOB_CATEGORY]}
									/>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.categories.errorId}
									>
										{fields.categories.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.employmentType.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Employment Type*
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<SelectField
										meta={fields.employmentType}
										items={[...EMPLOYMENT_TYPE]}
										placeholder="Select"
										triggerClassName="w-full sm:max-w-sm"
									/>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.employmentType.errorId}
									>
										{fields.employmentType.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.location.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Location
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<Input
										{...getInputProps(fields.location, {
											type: "text",
										})}
										placeholder="Downtown, Dripping Springs, Round Rock, etc."
										className="w-full sm:max-w-sm"
									/>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.location.errorId}
									>
										{fields.location.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.workSetting.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Work Setting*
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<RadioGroupField
										meta={fields.workSetting}
										items={[...WORK_SETTING]}
									/>
									<div
										className="pt-3 text-destructive text-xs"
										id={fields.workSetting.errorId}
									>
										{fields.workSetting.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.salaryMin.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Salary Range Start
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									{/* Currency field has issues with SSR so we'll only use it on the client */}
									<ClientOnly>
										{() => (
											<CurrencyInput
												prefix="$"
												className="w-full sm:max-w-sm"
												placeholder="$0.00"
												form={form.id}
												name={fields.salaryMin.name}
												id={fields.salaryMin.id}
											/>
										)}
									</ClientOnly>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.salaryMin.errorId}
									>
										{fields.salaryMin.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.salaryMax.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Salary Range End
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									{/* Currency field has issues with SSR so we'll only use it on the client */}
									<ClientOnly>
										{() => (
											<CurrencyInput
												prefix="$"
												className="w-full sm:max-w-sm"
												placeholder="$0.00"
												form={form.id}
												name={fields.salaryMax.name}
												id={fields.salaryMax.id}
											/>
										)}
									</ClientOnly>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.salaryMax.errorId}
									>
										{fields.salaryMax.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.salaryType.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Salary Type*
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<RadioGroupField
										meta={fields.salaryType}
										items={[...SALARY_TYPE]}
									/>
									<div
										className="pt-3 text-destructive text-xs"
										id={fields.salaryType.errorId}
									>
										{fields.salaryType.errors}
									</div>
								</div>
							</div>

							<div className="py-4">
								<Label>Job Description*</Label>
								<div className="mt-2">
									<EditorProvider
										initialConfig={{
											schemaDefinition,
										}}
									>
										<RichTextField meta={fields.description} />
									</EditorProvider>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.description.errorId}
									>
										{fields.description.errors}
									</div>
								</div>
							</div>

							<div className="py-4">
								<Label>How To Apply*</Label>
								<div className="mt-2">
									<EditorProvider
										initialConfig={{
											schemaDefinition,
										}}
									>
										<RichTextField meta={fields.howToApply} />
									</EditorProvider>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.howToApply.errorId}
									>
										{fields.howToApply.errors}
									</div>
								</div>
							</div>
						</div>
					</Form>
				</CardContent>
				<CardFooter>
					<div className="w-full">
						<p className="mb-6 text-muted-foreground text-xs italic">
							*Denotes required field
						</p>
						<div className="flex w-full flex-row flex-wrap justify-center gap-6 sm:justify-end">
							<Link
								className={buttonVariants({
									variant: "secondary",
								})}
								to="/"
							>
								Cancel
							</Link>
							<Button type="submit" form={form.id} disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<LoaderCircleIcon className="animate-spin" />
										Submitting...
									</>
								) : (
									"Submit"
								)}
							</Button>
						</div>
					</div>
				</CardFooter>
			</Card>
		</Container>
	)
}
