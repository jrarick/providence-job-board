import { Form } from "react-router"
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

export default function Register() {
	return (
		<div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-sm">
				<Card className="max-w-xl">
					<CardHeader>
						<CardTitle>Register</CardTitle>
						<CardDescription>Create an account.</CardDescription>
					</CardHeader>
					<CardContent>
						<Form className="flex flex-col gap-4">
							<div>
								<Label htmlFor="email">Email Address</Label>
								<Input id="email" />
							</div>
							<div>
								<Label htmlFor="password">Password</Label>
								<Input type="password" id="password" />
							</div>
							<Button type="submit">Submit</Button>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
