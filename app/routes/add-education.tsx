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
import { LoaderCircleIcon } from "lucide-react"
import { useState } from "react"
import { Form, redirect, useNavigate, useNavigation } from "react-router"
import { Toolbar } from "~/components/rich-text-editor/toolbar"
import {
	renderDecorator,
	renderStyle,
	schemaDefinition,
} from "~/components/rich-text-editor/utils"
import { Button } from "~/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog"
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { ScrollArea } from "~/components/ui/scroll-area"
import { createClient } from "~/db/supabase.server"
import { useMediaQuery } from "~/hooks/use-media-query"
import { educationEntrySchema } from "~/schemas/education-entry"
import type { Route } from "./+types/add-education"

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: educationEntrySchema })

	if (submission.status !== "success") {
		return { lastResult: submission.reply() }
	}

	const { supabase, headers } = createClient(request)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		throw new Error("User not authenticated")
	}

	const jobSeekerProfile = await supabase
		.from("job_seeker_profiles")
		.select("id")
		.eq("profile_id", user.id)
		.single()

	if (jobSeekerProfile.error) {
		throw new Error("Job seeker profile not found")
	}

	const { error, data } = await supabase.from("education_entries").insert([
		{
			institution: submission.value.institution,
			degree: submission.value.degree,
			field_of_study: submission.value.fieldOfStudy,
			gpa: submission.value.gpa,
			graduation_date: submission.value.graduationDate,
			description: submission.value.description,
			job_seeker_profile_id: jobSeekerProfile.data.id,
		},
	])

	if (error) {
		throw new Error(`Error creating education entry: ${error.message}`)
	}

	return redirect("/job-seeker-profile", {
		headers,
	})
}

export default function AddEducation({ actionData }: Route.ComponentProps) {
	const [open, setOpen] = useState(true)
	const navigate = useNavigate()
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const navigation = useNavigation()

	const isSubmitting = navigation.state === "submitting"
	const { lastResult } = actionData ?? {}

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: educationEntrySchema })
		},
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
	})

	if (isDesktop) {
		return (
			<Dialog
				open={open}
				onOpenChange={(open) => {
					if (!open) {
						setOpen(false)
						setTimeout(() => {
							navigate("/job-seeker-profile", {
								preventScrollReset: true,
							})
							// 200 ms delay to allow time for fade out to complete animation
						}, 200)
					}
				}}
				modal={true}
			>
				<DialogContent className="max-h-[min(700px,85dvh)] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="sm:text-center">Add Education</DialogTitle>
						<DialogDescription className="sm:text-center">
							Please fill out the required fields.
						</DialogDescription>
					</DialogHeader>
					<Form
						method="post"
						action="/job-seeker-profile/add-education"
						className="space-y-5"
						{...getFormProps(form)}
					>
						<div className="space-y-1">
							<Label htmlFor={fields.institution.id}>Institution*</Label>
							<Input
								{...getInputProps(fields.institution, { type: "text" })}
								placeholder="University of Texas"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.institution.errorId}
							>
								{fields.institution.errors}
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.fieldOfStudy.id}>Field of Study*</Label>
							<Input
								{...getInputProps(fields.fieldOfStudy, { type: "text" })}
								placeholder="Psychology"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.fieldOfStudy.errorId}
							>
								{fields.fieldOfStudy.errors}
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.degree.id}>Degree</Label>
							<Input
								{...getInputProps(fields.degree, { type: "text" })}
								placeholder="Bachelor's of Science"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.degree.errorId}
							>
								{fields.degree.errors}
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.gpa.id}>GPA</Label>
							<Input
								{...getInputProps(fields.gpa, { type: "number" })}
								placeholder="3.5"
								className="max-w-64"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.gpa.errorId}
							>
								{fields.gpa.errors}
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.graduationDate.id}>Graduation Date</Label>
							<Input
								{...getInputProps(fields.graduationDate, {
									type: "number",
								})}
								placeholder="2020"
								className="max-w-64"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.graduationDate.errorId}
							>
								{fields.graduationDate.errors}
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.graduationDate.id}>Description</Label>
							<div>
								<EditorProvider
									initialConfig={{
										schemaDefinition,
									}}
								>
									<RichTextField meta={fields.description} />
								</EditorProvider>
							</div>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.description.errorId}
							>
								{fields.description.errors}
							</div>
						</div>
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? (
								<>
									<LoaderCircleIcon className="animate-spin" />
									Adding...
								</>
							) : (
								"Add"
							)}
						</Button>
					</Form>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Drawer
			open={open}
			onOpenChange={() => {
				setOpen(false)
				setTimeout(() => {
					navigate("/job-seeker-profile", {
						preventScrollReset: true,
					})
					// 200 ms delay to allow time for fade out to complete animation
				}, 200)
			}}
		>
			<DrawerContent className="max-h-[75lvh]">
				<DrawerHeader className="border-border border-b text-left">
					<DrawerTitle className="text-xl">Add Education</DrawerTitle>
					<DrawerDescription className="text-base">
						Please fill out the required fields.
					</DrawerDescription>
				</DrawerHeader>
				<ScrollArea className="overflow-y-auto">
					<div className="p-4">
						<Form
							method="post"
							action="/job-seeker-profile/add-education"
							className="space-y-5"
							{...getFormProps(form)}
						>
							<div className="space-y-1">
								<Label htmlFor={fields.institution.id}>Institution*</Label>
								<Input
									{...getInputProps(fields.institution, { type: "text" })}
									placeholder="University of Texas"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.institution.errorId}
								>
									{fields.institution.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.fieldOfStudy.id}>Field of Study*</Label>
								<Input
									{...getInputProps(fields.fieldOfStudy, { type: "text" })}
									placeholder="Psychology"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.fieldOfStudy.errorId}
								>
									{fields.fieldOfStudy.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.degree.id}>Degree</Label>
								<Input
									{...getInputProps(fields.degree, { type: "text" })}
									placeholder="Bachelor's of Science"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.degree.errorId}
								>
									{fields.degree.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.gpa.id}>GPA</Label>
								<Input
									{...getInputProps(fields.gpa, { type: "number" })}
									placeholder="3.5"
									className="max-w-64"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.gpa.errorId}
								>
									{fields.gpa.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.graduationDate.id}>
									Graduation Date
								</Label>
								<Input
									{...getInputProps(fields.graduationDate, {
										type: "number",
									})}
									placeholder="2020"
									className="max-w-64"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.graduationDate.errorId}
								>
									{fields.graduationDate.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.graduationDate.id}>Description</Label>
								<div>
									<EditorProvider
										initialConfig={{
											schemaDefinition,
										}}
									>
										<RichTextField meta={fields.description} />
									</EditorProvider>
								</div>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.graduationDate.errorId}
								>
									{fields.graduationDate.errors}
								</div>
							</div>
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<LoaderCircleIcon className="animate-spin" />
										Adding...
									</>
								) : (
									"Add"
								)}
							</Button>
						</Form>
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
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
