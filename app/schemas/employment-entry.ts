import { z } from "zod"
import EMPLOYMENT_TYPE from "~/constants/employment-type"

export const employmentEntrySchema = z
	.object({
		title: z.string(),
		companyName: z.string(),
		employmentType: z.enum(EMPLOYMENT_TYPE),
		location: z.string().optional(),
		startDate: z.number().min(1940).max(new Date().getFullYear()),
		endDate: z.number().min(1940).max(new Date().getFullYear()).optional(),
		isCurrent: z.boolean(),
		description: z.string().optional(),
	})
	.refine(
		(data) => {
			return !data.isCurrent && !data.endDate
		},
		{
			message: "If employment is not current, end date is required",
			path: ["endDate"],
		},
	)

export type EmploymentEntry = z.infer<typeof employmentEntrySchema> & {
	id: number
	jobSeekerProfileId: number
	profileId: string
}
