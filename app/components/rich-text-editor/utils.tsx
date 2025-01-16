import {
	type RenderAnnotationFunction,
	type RenderDecoratorFunction,
	type RenderStyleFunction,
	defineSchema,
} from "@portabletext/editor"

export const schemaDefinition = defineSchema({
	decorators: [{ name: "strong" }, { name: "em" }, { name: "underline" }],
	annotations: [{ name: "link" }],
	styles: [
		{ name: "normal" },
		{ name: "h1" },
		{ name: "h2" },
		{ name: "h3" },
		{ name: "blockquote" },
	],
	lists: [{ name: "bullet" }, { name: "number" }],
	inlineObjects: [],
	blockObjects: [],
})

export const renderStyle: RenderStyleFunction = (props) => {
	if (props.schemaType.value === "h1") {
		return (
			<h1 className="font-display font-medium text-2xl">{props.children}</h1>
		)
	}
	if (props.schemaType.value === "h2") {
		return (
			<h2 className="font-display font-medium text-xl">{props.children}</h2>
		)
	}
	if (props.schemaType.value === "h3") {
		return (
			<h3 className="font-display font-medium text-lg">{props.children}</h3>
		)
	}
	if (props.schemaType.value === "blockquote") {
		return (
			<blockquote
				className={`pl-3 text-muted-foreground italic before:content-['"'] after:content-['"']`}
			>
				{props.children}
			</blockquote>
		)
	}
	return <>{props.children}</>
}

export const renderDecorator: RenderDecoratorFunction = (props) => {
	if (props.value === "strong") {
		return <strong>{props.children}</strong>
	}
	if (props.value === "em") {
		return <em>{props.children}</em>
	}
	if (props.value === "underline") {
		return <u>{props.children}</u>
	}
	return <>{props.children}</>
}

export const renderAnnotation: RenderAnnotationFunction = (props) => {
	if (props.schemaType.name === "link") {
		return <span className="text-blue-500 underline">{props.children}</span>
	}

	return <>{props.children}</>
}
