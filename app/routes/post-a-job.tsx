import {
	type FieldMetadata,
	getFormProps,
	getInputProps,
	unstable_useControl as useControl,
	useForm,
} from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import {
	EditorEventListener,
	EditorProvider,
	PortableTextEditable,
	useEditor,
} from "@portabletext/editor"
import { type ComponentProps, type ComponentRef, useRef } from "react"
import { Form, Link } from "react-router"
import { ClientOnly } from "~/components/client-only"
import { Toolbar } from "~/components/rich-text-editor/toolbar"
import {
	renderDecorator,
	renderStyle,
	schemaDefinition,
} from "~/components/rich-text-editor/utils"
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
import MultipleSelector from "~/components/ui/multiselect"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select"
import EMPLOYMENT_TYPE from "~/constants/employment-type"
import JOB_CATEGORY from "~/constants/job-category"
import SALARY_TYPE from "~/constants/salary-type"
import WORK_PRESENCE from "~/constants/work-presence"
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

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: jobSchema })

	if (submission.status !== "success") {
		return { lastResult: submission.reply() }
	}

	// Add the job to the database

	return { lastResult: null }
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

	let job = null

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
						this form. <span>(*) denotes a required field.</span>
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form method="post" action="/post-a-job" {...getFormProps(form)}>
						<div className="mt-10 space-y-8 border-gray-900/10 border-b pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
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
									htmlFor={fields.partOfTown.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Part Of Town
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<Input
										{...getInputProps(fields.partOfTown, {
											type: "text",
										})}
										placeholder="Downtown, Dripping Springs, Round Rock, etc."
										className="w-full sm:max-w-sm"
									/>
									<div
										className="pt-1 pl-1 text-destructive text-xs"
										id={fields.partOfTown.errorId}
									>
										{fields.partOfTown.errors}
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
								<Label
									htmlFor={fields.workPresence.id}
									className="text-sm/6 sm:pt-1.5"
								>
									Work Presence*
								</Label>
								<div className="mt-2 sm:col-span-2 sm:mt-0">
									<RadioGroupField
										meta={fields.workPresence}
										items={[...WORK_PRESENCE]}
									/>
									<div
										className="pt-3 text-destructive text-xs"
										id={fields.workPresence.errorId}
									>
										{fields.workPresence.errors}
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
					<div>
						<div className="space-x-6">
							<Button type="submit" form={form.id}>
								{job ? "Save" : "Submit"}
							</Button>
							<Link
								className={buttonVariants({
									variant: "ghost",
								})}
								to="/"
							>
								Cancel
							</Link>
						</div>
						<p className="mt-6 text-muted-foreground text-xs italic">
							*Denotes required field
						</p>
					</div>
				</CardFooter>
			</Card>
		</Container>
	)
}

function SelectField({
	meta,
	items,
	placeholder,
	triggerClassName,
	...props
}: {
	meta: FieldMetadata<string>
	items: Array<string>
	placeholder?: string
	triggerClassName?: string
} & ComponentProps<typeof Select>) {
	const selectRef = useRef<ComponentRef<typeof SelectTrigger>>(null)
	const control = useControl(meta)

	return (
		<>
			<select
				name={meta.name}
				defaultValue={meta.initialValue ?? ""}
				className="sr-only"
				ref={control.register}
				aria-hidden
				tabIndex={-1}
				onFocus={() => {
					selectRef.current?.focus()
				}}
			>
				<option value="" />
				{items.map((option) => (
					<option key={option} value={option} />
				))}
			</select>

			<Select
				{...props}
				value={control.value ?? ""}
				onValueChange={control.change}
				onOpenChange={(open) => {
					if (!open) {
						control.blur()
					}
				}}
			>
				<SelectTrigger className={triggerClassName}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{items.map((item) => {
						return (
							<SelectItem key={item} value={item}>
								{item}
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>
		</>
	)
}

function RadioGroupField({
	meta,
	items,
}: {
	meta: FieldMetadata<string>
	items: Array<string>
}) {
	const radioGroupRef = useRef<ComponentRef<typeof RadioGroup>>(null)
	const control = useControl(meta)

	return (
		<>
			<input
				ref={control.register}
				name={meta.name}
				defaultValue={meta.initialValue}
				aria-hidden
				tabIndex={-1}
				className="sr-only"
				onFocus={() => radioGroupRef.current?.focus()}
			/>
			<RadioGroup
				ref={radioGroupRef}
				className="flex flex-col gap-4"
				value={control.value ?? ""}
				onValueChange={control.change}
				onBlur={control.blur}
			>
				{items.map((item) => {
					return (
						<div className="flex items-center gap-2" key={item}>
							<RadioGroupItem value={item} id={`${meta.id}-${item}`} />
							<Label htmlFor={`${meta.id}-${item}`}>
								{item.slice(0, 1).toUpperCase() + item.slice(1)}
							</Label>
						</div>
					)
				})}
			</RadioGroup>
		</>
	)
}

function RichTextField({
	meta,
}: {
	meta: FieldMetadata<string>
}) {
	const control = useControl(meta)
	const editor = useEditor()

	return (
		<>
			<input
				ref={control.register}
				name={meta.name}
				defaultValue={meta.initialValue}
				aria-hidden
				tabIndex={-1}
				className="sr-only"
				onFocus={() => editor.send({ type: "focus" })}
			/>
			<EditorEventListener
				on={(event) => {
					if (event.type === "mutation") {
						control.change(JSON.stringify(event.value))
					}
					if (event.type === "blurred") {
						control.blur()
					}
				}}
			/>
			<Toolbar />
			<PortableTextEditable
				className="min-h-48 rounded-b-md border border-input bg-background p-2 text-base text-foreground shadow-black/5 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
				renderStyle={renderStyle}
				renderDecorator={renderDecorator}
				// renderAnnotation={renderAnnotation}
				renderBlock={(props) => <div>{props.children}</div>}
				renderListItem={(props) => <>{props.children}</>}
			/>
		</>
	)
}

function MultipleSelectorField({
	meta,
	items,
}: {
	meta: FieldMetadata<string[] | string>
	items: string[]
}) {
	const multipleSelectorRef =
		useRef<ComponentRef<typeof MultipleSelector>>(null)
	const control = useControl(meta)
	const controlValue = (control.value as Array<string>) ?? []

	return (
		<>
			<select
				ref={control.register}
				name={meta.name}
				defaultValue={(meta.initialValue as Array<string>) ?? []}
				multiple
				aria-hidden
				tabIndex={-1}
				className="sr-only"
				onFocus={() => multipleSelectorRef.current?.focus()}
			>
				<option value="" />
				{items.map((option) => (
					<option key={option} value={option} />
				))}
			</select>
			<MultipleSelector
				ref={multipleSelectorRef}
				commandProps={{
					label: "Select one or more",
					className: "w-full md:max-w-sm",
				}}
				defaultOptions={items.map((item) => ({ value: item, label: item }))}
				placeholder="Select one or more"
				emptyIndicator={<p className="text-center text-sm">No results found</p>}
				value={controlValue.map((item) => ({ value: item, label: item })) || []}
				onChange={(event) =>
					control.change(event.map((item) => item.value) || [])
				}
				hidePlaceholderWhenSelected
				className="w-full md:max-w-sm"
			/>
		</>
	)
}
