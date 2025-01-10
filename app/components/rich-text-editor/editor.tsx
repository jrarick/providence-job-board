import {
	EditorEventListener,
	EditorProvider,
	PortableTextEditable,
} from "@portabletext/editor"
import type { PortableTextBlock } from "@portabletext/editor"
import { useState } from "react"
import { Toolbar } from "./toolbar"
import {
	renderAnnotation,
	renderDecorator,
	renderStyle,
	schemaDefinition,
} from "./utils"

export function RichTextEditor() {
	const [value, setValue] = useState<Array<PortableTextBlock> | undefined>(
		undefined,
	)

	return (
		<EditorProvider
			initialConfig={{
				schemaDefinition,
				initialValue: value,
			}}
		>
			<EditorEventListener
				on={(event) => {
					if (event.type === "mutation") {
						setValue(event.value)
					}
				}}
			/>
			<Toolbar />
			<PortableTextEditable
				className="min-h-32 rounded-b-md border border-input bg-background p-2 text-base text-foreground shadow-black/5 shadow-sm transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
				renderStyle={renderStyle}
				renderDecorator={renderDecorator}
				renderAnnotation={renderAnnotation}
				renderBlock={(props) => <div>{props.children}</div>}
				renderListItem={(props) => <>{props.children}</>}
			/>
		</EditorProvider>
	)
}
