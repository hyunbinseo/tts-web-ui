const unwrapToTextNode = (element: ChildNode | Element) => {
	const textContent = element.textContent;
	if (textContent) {
		const textNode = document.createTextNode(textContent);
		element.parentNode?.replaceChild(textNode, element);
	} else {
		element.remove();
	}
};

export const createHandleDelete = (editor?: HTMLElement) =>
	!editor
		? null
		: (e: Event) => {
				// Ignore if modifier keys are pressed
				if (e instanceof KeyboardEvent && (e.metaKey || e.ctrlKey || e.altKey)) return;

				const selection = window.getSelection();
				if (!selection) return;
				if (!editor.contains(selection.anchorNode)) return;

				const range = selection.getRangeAt(0);

				// Case 1: Selection includes any element
				const elements = editor.getElementsByTagName('*');
				for (const element of elements) {
					if (range.intersectsNode(element)) unwrapToTextNode(element);
				}

				// Case 2: Cursor adjacent to any element
				if (selection.isCollapsed && e instanceof KeyboardEvent) {
					const startNode = range.startContainer;
					if (startNode.nodeType !== Node.TEXT_NODE) return;

					if (e.key === 'Backspace') {
						if (range.startOffset !== 0) return;
						const prevSibling = startNode.previousSibling;
						if (!prevSibling || prevSibling.nodeType !== Node.ELEMENT_NODE) return;
						e.preventDefault();
						unwrapToTextNode(prevSibling);
					}

					if (e.key === 'Delete') {
						if (range.startOffset !== startNode.textContent?.length) return;
						const nextSibling = startNode.nextSibling;
						if (!nextSibling || nextSibling.nodeType !== Node.ELEMENT_NODE) return;
						e.preventDefault();
						unwrapToTextNode(nextSibling);
					}
				}
			};
