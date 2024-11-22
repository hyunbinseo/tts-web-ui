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

<!-- svelte-ignore element_invalid_self_closing_tag -->
<div contenteditable="true" bind:this={editor} onblur={handleSelectionChange} class="p-4">
	<mark />
	<emphasis level="moderate">This is an important announcement.</emphasis>
	<mark />
	This is editable text with a
	<break time="3s"></break>
	pause in the middle.
</div>

<style lang="postcss">
	div[contenteditable] {
		@apply overflow-x-hidden leading-[3rem];
		> break {
			@apply bg-yellow-300;
			&::before {
				content: attr(time);
			}
		}
		> emphasis {
			@apply relative border-t-2 border-yellow-300;
			&::before {
				@apply absolute -top-4 whitespace-pre bg-yellow-300 text-xs text-black;
				content: attr(level) ' emphasis\A';
			}
		}
		> mark {
			@apply !bg-transparent;
			&::before {
				content: '|';
				@apply font-extrabold;
			}
		}
	}
</style>
