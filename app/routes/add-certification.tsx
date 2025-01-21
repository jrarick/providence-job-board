import {
	type SubmissionResult,
	getFormProps,
	getInputProps,
	useForm,
} from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod"
import { LoaderCircleIcon } from "lucide-react"
import { useState } from "react"
import { Form, redirect, useNavigate, useNavigation } from "react-router"
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
import { certificationEntrySchema } from "~/schemas/certification-entry"
import type { Route } from "./+types/add-certification"

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: certificationEntrySchema,
	})

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

	const { error, data } = await supabase.from("certification_entries").insert([
		{
			title: submission.value.title,
			issuing_org: submission.value.issuingOrg,
			issue_date: submission.value.issueDate,
			expiration_date: submission.value.expirationDate,
			url: submission.value.url,
		},
	])

	if (error) {
		throw new Error(`Error creating certification entry: ${error.message}`)
	}

	return redirect("/job-seeker-profile", {
		headers,
	})
}

export default function AddCertification({ actionData }: Route.ComponentProps) {
	const [open, setOpen] = useState(true)
	const navigate = useNavigate()
	const isDesktop = useMediaQuery("(min-width: 768px)")
	const { lastResult } = actionData ?? {}

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
						<DialogTitle className="sm:text-center">
							Add Certification
						</DialogTitle>
						<DialogDescription className="sm:text-center">
							Please fill out the required fields.
						</DialogDescription>
					</DialogHeader>
					<AddCertificationForm lastResult={lastResult} />
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
					<DrawerTitle className="text-xl">Add Certification</DrawerTitle>
					<DrawerDescription className="text-base">
						Please fill out the required fields.
					</DrawerDescription>
				</DrawerHeader>
				<ScrollArea className="overflow-y-auto">
					<div className="p-4">
						<AddCertificationForm lastResult={lastResult} />
					</div>
				</ScrollArea>
			</DrawerContent>
		</Drawer>
	)
}

function AddCertificationForm({
	lastResult,
}: {
	lastResult: SubmissionResult<string[]> | undefined
}) {
	const navigation = useNavigation()
	const isSubmitting = navigation.state === "submitting"

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: certificationEntrySchema })
		},
		shouldValidate: "onSubmit",
		shouldRevalidate: "onInput",
	})

	return (
		<Form
			method="post"
			action="/job-seeker-profile/add-certification"
			className="space-y-5"
			{...getFormProps(form)}
		>
			<div className="space-y-1">
				<Label htmlFor={fields.title.id}>Title*</Label>
				<Input
					{...getInputProps(fields.title, { type: "text" })}
					placeholder="CompTIA A+"
				/>
				<div
					className="pl-1 text-destructive text-xs"
					id={fields.title.errorId}
				>
					{fields.title.errors}
				</div>
			</div>
			<div className="space-y-1">
				<Label htmlFor={fields.issuingOrg.id}>Issuing Organization*</Label>
				<Input
					{...getInputProps(fields.issuingOrg, { type: "text" })}
					placeholder="CompTIA"
				/>
				<div
					className="pl-1 text-destructive text-xs"
					id={fields.issuingOrg.errorId}
				>
					{fields.issuingOrg.errors}
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<Label htmlFor={fields.issueDate.id}>Date Issued</Label>
					<Input
						{...getInputProps(fields.issueDate, {
							type: "number",
						})}
						placeholder="2015"
						className="max-w-64"
					/>
					<div
						className="pl-1 text-destructive text-xs"
						id={fields.issueDate.errorId}
					>
						{fields.issueDate.errors}
					</div>
				</div>
				<div className="space-y-1">
					<Label htmlFor={fields.expirationDate.id}>Expiration Date</Label>
					<Input
						{...getInputProps(fields.expirationDate, {
							type: "number",
						})}
						placeholder="If applicable"
						className="max-w-64"
					/>
					<div
						className="pl-1 text-destructive text-xs"
						id={fields.expirationDate.errorId}
					>
						{fields.expirationDate.errors}
					</div>
				</div>
			</div>
			<div className="space-y-1">
				<Label htmlFor={fields.url.id}>URL Link to Certification</Label>
				<Input
					{...getInputProps(fields.url, { type: "text" })}
					placeholder="https://www.certifications.com/my-certification"
				/>
				<div className="pl-1 text-destructive text-xs" id={fields.url.errorId}>
					{fields.url.errors}
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
	)
}
