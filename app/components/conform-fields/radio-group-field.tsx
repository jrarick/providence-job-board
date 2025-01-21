import {
	type FieldMetadata,
	unstable_useControl as useControl,
} from "@conform-to/react"
import { type ComponentRef, useRef } from "react"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export function RadioGroupField({
	meta,
	items,
}: {
	meta: FieldMetadata<string>
	items: Array<string>
}) {
	const radioGroupRef = useRef<ComponentRef<typeof RadioGroup>>(null)
	const control = useControl(meta)

	return (
		<>
			<input
				ref={control.register}
				name={meta.name}
				defaultValue={meta.initialValue}
				aria-hidden
				tabIndex={-1}
				className="sr-only"
				onFocus={() => radioGroupRef.current?.focus()}
			/>
			<RadioGroup
				ref={radioGroupRef}
				className="flex flex-col gap-4"
				value={control.value ?? ""}
				onValueChange={control.change}
				onBlur={control.blur}
			>
				{items.map((item) => {
					return (
						<div className="flex items-center gap-2" key={item}>
							<RadioGroupItem value={item} id={`${meta.id}-${item}`} />
							<Label htmlFor={`${meta.id}-${item}`}>
								{item.slice(0, 1).toUpperCase() + item.slice(1)}
							</Label>
						</div>
					)
				})}
			</RadioGroup>
		</>
	)
}
