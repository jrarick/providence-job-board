import {
	type FieldMetadata,
	unstable_useControl as useControl,
} from "@conform-to/react"
import { type ComponentRef, useRef } from "react"
import MultipleSelector from "../ui/multiselect"

export function MultipleSelectorField({
	meta,
	items,
}: {
	meta: FieldMetadata<string[] | string>
	items: string[]
}) {
	const multipleSelectorRef =
		useRef<ComponentRef<typeof MultipleSelector>>(null)
	const control = useControl(meta)
	const controlValue = (control.value as Array<string>) ?? []

	return (
		<>
			<select
				ref={control.register}
				name={meta.name}
				defaultValue={(meta.initialValue as Array<string>) ?? []}
				multiple
				aria-hidden
				tabIndex={-1}
				className="sr-only"
				onFocus={() => multipleSelectorRef.current?.focus()}
			>
				<option value="" />
				{items.map((option) => (
					<option key={option} value={option} />
				))}
			</select>
			<MultipleSelector
				ref={multipleSelectorRef}
				commandProps={{
					label: "Select one or more",
					className: "w-full md:max-w-sm",
				}}
				defaultOptions={items.map((item) => ({ value: item, label: item }))}
				placeholder="Select one or more"
				emptyIndicator={<p className="text-center text-sm">No results found</p>}
				value={controlValue.map((item) => ({ value: item, label: item })) || []}
				onChange={(event) =>
					control.change(event.map((item) => item.value) || [])
				}
				hidePlaceholderWhenSelected
				className="w-full md:max-w-sm"
			/>
		</>
	)
}
