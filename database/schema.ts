import {
	integer,
	real,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { generateUniqueString } from "./utils"

const timestamps = {
	createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" }),
}

export const guestBook = sqliteTable("guestBook", {
	id: integer().primaryKey({ autoIncrement: true }),
	name: text().notNull(),
	email: text().notNull().unique(),
})

export const users = sqliteTable(
	"users",
	{
		id: integer().primaryKey({ autoIncrement: true }),
		email: text().notNull().unique(),
		firstName: text("first_name").notNull(),
		lastName: text("last_name").notNull(),
		image: text(),
		role: text().$type<"user" | "admin">().default("user"),
		slug: text().$default(() => generateUniqueString(16)),

		...timestamps,
	},
	(table) => {
		return {
			emailIndex: uniqueIndex("email_idx").on(table.email),
		}
	},
)

export const passwords = sqliteTable("passwords", {
	hash: text().notNull(),
	userId: integer("user_id")
		.primaryKey()
		.references(() => users.id),
})

export const jobPostings = sqliteTable("job_postings", {
	id: integer().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	companyName: text("company_name").notNull(),
	companyWebsite: text("company_website"),
	location: text(),
	workPresence: text("work_presence"),
	description: text().notNull(),
	employmentType: text("employment_type")
		.$type<
			"full time" | "part time" | "contract" | "internship" | "volunteer"
		>()
		.notNull(),
	salaryMin: real("salary_min"),
	salaryMax: real("salary_max"),
	salaryType: text("salary_type")
		.$type<"hourly" | "yearly">()
		.notNull()
		.default("yearly"),
	howToApply: text("how_to_apply").notNull(),

	...timestamps,
})

export const jobCategories = sqliteTable("job_categories", {
	id: integer().primaryKey({ autoIncrement: true }),
	jobPostingId: integer("job_posting_id")
		.notNull()
		.references(() => jobPostings.id),
	name: text().notNull(),
})

export const jobSeekerProfiles = sqliteTable("job_seeker_profiles", {
	id: integer().primaryKey({ autoIncrement: true }),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	headline: text("headline"),
	summary: text("summary"),
	experience: text("experience"),
	education: text("education"),
	skills: text("skills"),
	resumeUrl: text("resume_url"),
})

export const experienceEntries = sqliteTable("experience_entries", {
	id: integer().primaryKey({ autoIncrement: true }),
	jobSeekerProfileId: integer("job_seeker_profile_id")
		.notNull()
		.references(() => jobSeekerProfiles.id),
	companyName: text("company_name").notNull(),
	title: text("title").notNull(),
	employmentType: text("employment_type")
		.$type<
			"full time" | "part time" | "contract" | "internship" | "volunteer"
		>()
		.notNull(),
	location: text(),
	startDate: text("start_date"),
	endDate: text("end_date"),
	description: text(),
})

export const educationEntries = sqliteTable("education_entries", {
	id: integer().primaryKey({ autoIncrement: true }),
	jobSeekerProfileId: integer("job_seeker_profile_id")
		.notNull()
		.references(() => jobSeekerProfiles.id),
	institution: text().notNull(),
	degree: text(),
	fieldOfStudy: text("field_of_study"),
	gpa: real(),
	startDate: text("start_date"),
	graduationDate: text("graduation_date"),
	description: text(),
})

export const certifications = sqliteTable("certifications", {
	id: integer().primaryKey({ autoIncrement: true }),
	jobSeekerProfileId: integer("job_seeker_profile_id")
		.notNull()
		.references(() => jobSeekerProfiles.id),
	title: text().notNull(),
	institution: text(),
	issueDate: integer({ mode: "timestamp" }),
	expirationDate: integer({ mode: "timestamp" }),
})

export const skills = sqliteTable("skills", {
	id: integer().primaryKey({ autoIncrement: true }),
	jobSeekerProfileId: integer("job_seeker_profile_id")
		.notNull()
		.references(() => jobSeekerProfiles.id),
	name: text().notNull(),
})
