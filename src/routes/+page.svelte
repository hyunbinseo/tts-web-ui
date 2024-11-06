<script lang="ts">
	import debounce from 'debounce';

	let editor: HTMLElement;

	let cursorInPlainText = $state(false);
	let selectedPlainText = $state(false);

	const handleSelectionChange = () => {
		cursorInPlainText = false;
		selectedPlainText = false;

		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) return;

		const range = selection.getRangeAt(0);
		const node = range.commonAncestorContainer;

		if (!editor.contains(node)) return;
		if (node.nodeType !== Node.TEXT_NODE) return;

		// NOTE Click the middle of the editor and then click away from it, blurring the focus.
		// The selection range is updated as if the invisible cursor has moved to the editor's end.
		if (range.collapsed && document.activeElement !== editor) return selection.removeAllRanges();

		if (range.collapsed) cursorInPlainText = true;
		if (!range.collapsed) selectedPlainText = true;
	};
</script>

<svelte:document onselectionchange={debounce(handleSelectionChange)} />

<div
	contenteditable
	bind:this={editor}
	onblur={handleSelectionChange}
	class="border-2 border-black p-4"
>
	This is editable text with a
	<break time="3s" data-time="3s"></break>
	pause in the middle.
</div>

<style lang="postcss">
	break {
		@apply bg-yellow-300;
	}
	break::after {
		content: attr(data-time);
	}
</style>
