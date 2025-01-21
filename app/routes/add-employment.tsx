import { getFormProps, getInputProps, useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { EditorProvider } from "@portabletext/editor"
import { LoaderCircleIcon } from "lucide-react"
import { useState } from "react"
import { Form, redirect, useNavigate, useNavigation } from "react-router"
import { CheckboxField } from "~/components/conform-fields/checkbox-field"
import { RichTextField } from "~/components/conform-fields/rich-text-field"
import { SelectField } from "~/components/conform-fields/select-field"
import { schemaDefinition } from "~/components/rich-text-editor/utils"
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
import EMPLOYMENT_TYPE from "~/constants/employment-type"
import { createClient } from "~/db/supabase.server"
import { useMediaQuery } from "~/hooks/use-media-query"
import { employmentEntrySchema } from "~/schemas/employment-entry"
import type { Route } from "./+types/add-employment"

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, { schema: employmentEntrySchema })

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

	const { error, data } = await supabase.from("employment_entries").insert([
		{
			title: submission.value.title,
			company_name: submission.value.companyName,
			employment_type: submission.value.employmentType,
			location: submission.value.location,
			is_current: submission.value.isCurrent,
			start_date: submission.value.startDate,
			end_date: submission.value.endDate,
			description: submission.value.description,
			job_seeker_profile_id: jobSeekerProfile.data.id,
		},
	])

	if (error) {
		throw new Error(`Error creating employment entry: ${error.message}`)
	}

	return redirect("/job-seeker-profile", {
		headers,
	})
}

export default function AddEmployment({ actionData }: Route.ComponentProps) {
	const [open, setOpen] = useState(true)
	const navigate = useNavigate()
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const navigation = useNavigation()

	const isSubmitting = navigation.state === "submitting"
	const { lastResult } = actionData ?? {}

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: employmentEntrySchema })
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
						<DialogTitle className="sm:text-center">Add Employment</DialogTitle>
						<DialogDescription className="sm:text-center">
							Please fill out the required fields.
						</DialogDescription>
					</DialogHeader>
					<Form
						method="post"
						action="/job-seeker-profile/add-employment"
						className="space-y-5"
						{...getFormProps(form)}
					>
						<div className="space-y-1">
							<Label htmlFor={fields.title.id}>Title*</Label>
							<Input
								{...getInputProps(fields.title, { type: "text" })}
								placeholder="Store Manager"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.title.errorId}
							>
								{fields.title.errors}
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.companyName.id}>Company Name*</Label>
							<Input
								{...getInputProps(fields.companyName, { type: "text" })}
								placeholder="Macy's"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.companyName.errorId}
							>
								{fields.companyName.errors}
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.employmentType.id}>Employment Type*</Label>
							<SelectField
								meta={fields.employmentType}
								items={[...EMPLOYMENT_TYPE]}
								placeholder="Select"
								triggerClassName="w-full"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.employmentType.errorId}
							>
								{fields.employmentType.errors}
							</div>
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.location.id}>Location</Label>
							<Input
								{...getInputProps(fields.location, { type: "text" })}
								placeholder="Atlanta, GA"
							/>
							<div
								className="pl-1 text-destructive text-xs"
								id={fields.location.errorId}
							>
								{fields.location.errors}
							</div>
						</div>
						<div className="flex items-center gap-2 pt-6 pb-2">
							<CheckboxField meta={fields.isCurrent} />
							<Label htmlFor={fields.isCurrent.id}>Current Employer?</Label>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-1">
								<Label htmlFor={fields.startDate.id}>Start Date*</Label>
								<Input
									{...getInputProps(fields.startDate, {
										type: "number",
									})}
									placeholder="2015"
									className="max-w-64"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.startDate.errorId}
								>
									{fields.startDate.errors}
								</div>
							</div>
							{!fields.isCurrent.value && (
								<div className="space-y-1">
									<Label htmlFor={fields.endDate.id}>End Date</Label>
									<Input
										{...getInputProps(fields.endDate, {
											type: "number",
										})}
										placeholder="2018"
										className="max-w-64"
									/>
									<div
										className="pl-1 text-destructive text-xs"
										id={fields.endDate.errorId}
									>
										{fields.endDate.errors}
									</div>
								</div>
							)}
						</div>
						<div className="space-y-1">
							<Label htmlFor={fields.description.id}>Description</Label>
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
					<DrawerTitle className="text-xl">Add Employment</DrawerTitle>
					<DrawerDescription className="text-base">
						Please fill out the required fields.
					</DrawerDescription>
				</DrawerHeader>
				<ScrollArea className="overflow-y-auto">
					<div className="p-4">
						<Form
							method="post"
							action="/job-seeker-profile/add-employment"
							className="space-y-5"
							{...getFormProps(form)}
						>
							<div className="space-y-1">
								<Label htmlFor={fields.title.id}>Title*</Label>
								<Input
									{...getInputProps(fields.title, { type: "text" })}
									placeholder="Store Manager"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.title.errorId}
								>
									{fields.title.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.companyName.id}>Company Name*</Label>
								<Input
									{...getInputProps(fields.companyName, { type: "text" })}
									placeholder="Macy's"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.companyName.errorId}
								>
									{fields.companyName.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.employmentType.id}>
									Employment Type*
								</Label>
								<SelectField
									meta={fields.employmentType}
									items={[...EMPLOYMENT_TYPE]}
									placeholder="Select"
									triggerClassName="w-full sm:max-w-sm"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.employmentType.errorId}
								>
									{fields.employmentType.errors}
								</div>
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.location.id}>Location</Label>
								<Input
									{...getInputProps(fields.location, { type: "text" })}
									placeholder="Atlanta, GA"
								/>
								<div
									className="pl-1 text-destructive text-xs"
									id={fields.location.errorId}
								>
									{fields.location.errors}
								</div>
							</div>
							<div className="flex items-center gap-2 pt-6 pb-2">
								<CheckboxField meta={fields.isCurrent} />
								<Label htmlFor={fields.isCurrent.id}>Current Employer?</Label>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-1">
									<Label htmlFor={fields.startDate.id}>Start Date*</Label>
									<Input
										{...getInputProps(fields.startDate, {
											type: "number",
										})}
										placeholder="2015"
										className="max-w-64"
									/>
									<div
										className="pl-1 text-destructive text-xs"
										id={fields.startDate.errorId}
									>
										{fields.startDate.errors}
									</div>
								</div>
								{!fields.isCurrent.value && (
									<div className="space-y-1">
										<Label htmlFor={fields.endDate.id}>End Date</Label>
										<Input
											{...getInputProps(fields.endDate, {
												type: "number",
											})}
											placeholder="2018"
											className="max-w-64"
										/>
										<div
											className="pl-1 text-destructive text-xs"
											id={fields.endDate.errorId}
										>
											{fields.endDate.errors}
										</div>
									</div>
								)}
							</div>
							<div className="space-y-1">
								<Label htmlFor={fields.description.id}>Description</Label>
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
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	)
}
