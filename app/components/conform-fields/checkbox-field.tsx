import {
	type FieldMetadata,
	unstable_useControl as useControl,
} from "@conform-to/react"
import { type ComponentRef, useRef } from "react"
import { Checkbox } from "../ui/checkbox"

export function CheckboxField({
	meta,
}: {
	meta: FieldMetadata<string | boolean | undefined>
}) {
	const checkboxRef = useRef<ComponentRef<typeof Checkbox>>(null)
	const control = useControl(meta)

	return (
		<>
			<input
				className="sr-only"
				aria-hidden
				ref={control.register}
				name={meta.name}
				tabIndex={-1}
				defaultValue={meta.initialValue}
				onFocus={() => checkboxRef.current?.focus()}
			/>
			<Checkbox
				ref={checkboxRef}
				id={meta.id}
				checked={control.value === "on"}
				onCheckedChange={(checked) => {
					control.change(checked ? "on" : "")
				}}
				onBlur={control.blur}
			/>
		</>
	)
}
