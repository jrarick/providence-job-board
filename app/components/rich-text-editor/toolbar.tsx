import { useEditor, useEditorSelector } from "@portabletext/editor"
import * as selectors from "@portabletext/editor/selectors"
import {
	BoldIcon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	ItalicIcon,
	Link2Icon,
	ListIcon,
	ListOrderedIcon,
	PilcrowIcon,
	QuoteIcon,
	UnderlineIcon,
} from "lucide-react"
import { useState } from "react"
import { cn } from "~/lib/utils"
import { Button } from "../ui/button"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"
import { schemaDefinition } from "./utils"

const buttonsData = {
	normal: {
		label: "Normal",
		icon: PilcrowIcon,
	},
	strong: {
		label: "Bold",
		icon: BoldIcon,
	},
	em: {
		label: "Italic",
		icon: ItalicIcon,
	},
	underline: {
		label: "Underline",
		icon: UnderlineIcon,
	},
	link: {
		label: "Link",
		icon: Link2Icon,
	},
	blockquote: {
		label: "Blockquote",
		icon: QuoteIcon,
	},
	h1: {
		label: "H1",
		icon: Heading1Icon,
	},
	h2: {
		label: "H2",
		icon: Heading2Icon,
	},
	h3: {
		label: "H3",
		icon: Heading3Icon,
	},
	bullet: {
		label: "Bullet List",
		icon: ListIcon,
	},
	number: {
		label: "Numbered List",
		icon: ListOrderedIcon,
	},
}

export function Toolbar() {
	const editor = useEditor()
	const [style, setStyle] = useState("normal")

	return (
		<div className="flex flex-row flex-wrap gap-1 rounded-t-md border-border border-t border-r border-l bg-body p-1">
			{schemaDefinition.decorators.map((decorator) => (
				<DecoratorButton key={decorator.name} decorator={decorator} />
			))}
			<Select
				value={style}
				onValueChange={(value) => {
					setStyle(value)
					editor.send({
						type: "style.toggle",
						style: value,
					})
					editor.send({
						type: "focus",
					})
				}}
			>
				<SelectTrigger className="h-8 w-36 sm:w-48 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80">
					<SelectValue />
				</SelectTrigger>
				<SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
					<SelectGroup>
						<SelectItem value="normal">
							<PilcrowIcon className="size-4" aria-hidden="true" />
							<span>Normal</span>
						</SelectItem>
						<SelectItem value="h1">
							<Heading1Icon className="size-4" aria-hidden="true" />
							<span className="font-display font-medium text-2xl">
								Heading 1
							</span>
						</SelectItem>
						<SelectItem value="h2">
							<Heading2Icon className="size-4" aria-hidden="true" />
							<span className="font-display font-medium text-xl">
								Heading 2
							</span>
						</SelectItem>
						<SelectItem value="h3">
							<Heading3Icon className="size-4" aria-hidden="true" />
							<span className="font-display font-medium text-lg">
								Heading 3
							</span>
						</SelectItem>
						<SelectItem value="blockquote">
							<QuoteIcon className="size-4" aria-hidden="true" />
							<span className="text-muted-foreground italic before:content-['''] after:content-[''']">
								Blockquote
							</span>
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			{/* <AnnotationButton annotation={{ name: "link" }} /> */}
			{schemaDefinition.lists.map((list) => (
				<ListButton key={list.name} list={list} />
			))}
		</div>
	)
}

function DecoratorButton({
	decorator,
}: {
	decorator: {
		readonly name: "strong" | "em" | "underline"
	}
}) {
	const editor = useEditor()
	const active = useEditorSelector(
		editor,
		selectors.isActiveDecorator(decorator.name),
	)

	const Icon = buttonsData[decorator.name].icon
	const { label } = buttonsData[decorator.name]

	return (
		<TooltipProvider delayDuration={0} key={decorator.name}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className={cn(
							"size-8",
							active && "border border-border bg-primary-foreground",
						)}
						size="icon"
						variant="ghost"
						onClick={() => {
							editor.send({
								type: "decorator.toggle",
								decorator: decorator.name,
							})
							editor.send({
								type: "focus",
							})
						}}
					>
						<Icon />
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

function AnnotationButton({ annotation }: { annotation: { name: string } }) {
	const editor = useEditor()
	const active = useEditorSelector(
		editor,
		selectors.isActiveAnnotation(annotation.name),
	)

	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className={cn(
							"size-8",
							active && "border border-border bg-primary-foreground",
						)}
						size="icon"
						variant="ghost"
						onClick={() => {
							if (active) {
								editor.send({
									type: "annotation.remove",
									annotation: {
										name: annotation.name,
									},
								})
								editor.send({
									type: "focus",
								})
							} else {
								editor.send({
									type: "annotation.add",
									annotation: {
										name: annotation.name,
										value:
											annotation.name === "link"
												? { href: "https://example.com" }
												: {},
									},
								})
								editor.send({
									type: "focus",
								})
							}
						}}
					>
						<Link2Icon />
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">Link</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

function ListButton({
	list,
}: {
	list: {
		readonly name: "bullet" | "number"
	}
}) {
	const editor = useEditor()
	const active = useEditorSelector(
		editor,
		selectors.isActiveListItem(list.name),
	)

	const Icon = buttonsData[list.name].icon
	const { label } = buttonsData[list.name]

	return (
		<TooltipProvider delayDuration={0} key={list.name}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className={cn(
							"size-8",
							active && "border border-border bg-primary-foreground",
						)}
						size="icon"
						variant="ghost"
						onClick={() => {
							editor.send({
								type: "list item.toggle",
								listItem: list.name,
							})
							editor.send({
								type: "focus",
							})
						}}
					>
						<Icon />
					</Button>
				</TooltipTrigger>
				<TooltipContent className="px-2 py-1 text-xs">{label}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
