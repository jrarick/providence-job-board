import { Outlet } from "react-router"
import Container from "~/components/shell/container"

export default function PrivacyPolicy() {
	return (
		<Container>
			<div className="prose prose-prov-blue mx-auto px-4">
				<Outlet />
			</div>
		</Container>
	)
}
