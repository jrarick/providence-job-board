import {
	type FieldMetadata,
	unstable_useControl as useControl,
} from "@conform-to/react"
import {
	EditorEventListener,
	PortableTextEditable,
	useEditor,
} from "@portabletext/editor"
import { Toolbar } from "../rich-text-editor/toolbar"
import { renderDecorator, renderStyle } from "../rich-text-editor/utils"

export function RichTextField({
	meta,
}: {
	meta: FieldMetadata<string>
}) {
	const control = useControl(meta)
	const editor = useEditor()

	return (
		<>
			<input
				ref={control.register}
				name={meta.name}
				defaultValue={meta.initialValue}
				aria-hidden
				tabIndex={-1}
				className="sr-only"
				onFocus={() => editor.send({ type: "focus" })}
			/>
			<EditorEventListener
				on={(event) => {
					if (event.type === "mutation") {
						control.change(JSON.stringify(event.value))
					}
					if (event.type === "blurred") {
						control.blur()
					}
				}}
			/>
			<Toolbar />
			<PortableTextEditable
				className="min-h-48 rounded-b-md border border-input bg-background p-2 text-base text-foreground shadow-black/5 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
				renderStyle={renderStyle}
				renderDecorator={renderDecorator}
				// renderAnnotation={renderAnnotation}
				renderBlock={(props) => <div>{props.children}</div>}
				renderListItem={(props) => <>{props.children}</>}
			/>
		</>
	)
}
