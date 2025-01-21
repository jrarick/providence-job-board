import {
	type FieldMetadata,
	unstable_useControl as useControl,
} from "@conform-to/react"
import { type ComponentProps, type ComponentRef, useRef } from "react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"

export function SelectField({
	meta,
	items,
	placeholder,
	triggerClassName,
	...props
}: {
	meta: FieldMetadata<string>
	items: Array<string>
	placeholder?: string
	triggerClassName?: string
} & ComponentProps<typeof Select>) {
	const selectRef = useRef<ComponentRef<typeof SelectTrigger>>(null)
	const control = useControl(meta)

	return (
		<>
			<select
				name={meta.name}
				defaultValue={meta.initialValue ?? ""}
				className="sr-only"
				ref={control.register}
				aria-hidden
				tabIndex={-1}
				onFocus={() => {
					selectRef.current?.focus()
				}}
			>
				<option value="" />
				{items.map((option) => (
					<option key={option} value={option} />
				))}
			</select>

			<Select
				{...props}
				value={control.value ?? ""}
				onValueChange={control.change}
				onOpenChange={(open) => {
					if (!open) {
						control.blur()
					}
				}}
			>
				<SelectTrigger className={triggerClassName}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{items.map((item) => {
						return (
							<SelectItem key={item} value={item}>
								{item}
							</SelectItem>
						)
					})}
				</SelectContent>
			</Select>
		</>
	)
}
