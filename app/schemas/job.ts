import { z } from "zod"
import EMPLOYMENT_TYPE from "~/constants/employment-type"
import JOB_CATEGORY from "~/constants/job-category"
import SALARY_TYPE from "~/constants/salary-type"
import WORK_SETTING from "~/constants/work-setting"

export const jobSchema = z
	.object({
		title: z.string({ required_error: "Job Title is required" }),
		companyName: z.string({ required_error: "Company Name is required" }),
		categories: z
			.array(z.enum(JOB_CATEGORY))
			.min(1, "At least one category is required")
			.max(5, "No more than 5 categories are allowed"),
		employmentType: z.enum(EMPLOYMENT_TYPE, {
			required_error: "Employment Type is required",
		}),
		description: z.string({ required_error: "Job Description is required" }),
		salaryMin: z.preprocess(
			(val) => Number((val as string).replace(/[^0-9.]/g, "")),
			z
				.number()
				.nonnegative()
				.max(10_000_000, { message: "Cannot exceed $10,000,000" })
				.optional(),
		),
		salaryMax: z.preprocess(
			(val) => Number((val as string).replace(/[^0-9.]/g, "")),
			z
				.number()
				.nonnegative()
				.max(10_000_000, { message: "Cannot exceed $10,000,000" })
				.optional(),
		),
		salaryType: z.enum(SALARY_TYPE, {
			required_error: "Required",
		}),
		location: z.string().optional(),
		workSetting: z.enum(WORK_SETTING, {
			required_error: "Required",
		}),
		companyWebsite: z
			.string()
			.url({
				message:
					"Invalid url. Make sure to use full url including protocol (https://)",
			})
			.optional(),
		howToApply: z.string(),
	})
	.refine(
		(data) => {
			return (
				!data.salaryMin || !data.salaryMax || data.salaryMin <= data.salaryMax
			)
		},
		{
			message: "Salary Min cannot be greater than Salary Max",
			path: ["salaryMin"],
		},
	)

export type Job = z.infer<typeof jobSchema> & {
	id: number
	createdAt: Date
	updatedAt: Date
	profileId: number
}

export type JobPreview = Omit<
	Job,
	| "employmentType"
	| "salaryMin"
	| "salaryMax"
	| "salaryType"
	| "workSetting"
	| "companyWebsite"
	| "howToApply"
	| "profileId"
	| "updatedAt"
>
