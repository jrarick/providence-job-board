import { z } from "zod"

export const certificationEntrySchema = z.object({
	title: z.string(),
	issuingOrg: z.string(),
	issueDate: z.number().min(1940).max(new Date().getFullYear()),
	expirationDate: z.number().min(1940).max(new Date().getFullYear()),
	url: z.string().url(),
})

export type CertificationEntry = z.infer<typeof certificationEntrySchema> & {
	id: number
	jobSeekerProfileId: number
	profileId: string
}
