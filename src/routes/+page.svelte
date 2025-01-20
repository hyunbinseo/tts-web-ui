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
		if (node.parentElement !== editor) return;
		if (node.nodeType !== Node.TEXT_NODE) return;

		// NOTE Click the middle of the editor and then click away from it, blurring the focus.
		// The selection range is updated as if the invisible cursor has moved to the editor's end.
		if (range.collapsed && document.activeElement !== editor) return selection.removeAllRanges();

		if (range.collapsed) cursorInPlainText = true;
		if (!range.collapsed) selectedPlainText = true;
	};
</script>

<svelte:document onselectionchange={debounce(handleSelectionChange)} />

<!-- Speech Synthesis Markup Language (SSML) -->
<!-- https://cloud.google.com/text-to-speech/docs/ssml -->

<form class="mx-auto flex min-h-screen max-w-screen-md flex-col py-12">
	<nav class="sticky top-0 h-12 border border-b-0 bg-gray-200"></nav>
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div
		contenteditable="true"
		bind:this={editor}
		onblur={handleSelectionChange}
		class="flex-1 border p-4 pt-6 leading-[2.5rem] focus:border-blue-700 focus:outline-none"
	>
		<mark />
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<emphasis
			level="moderate"
			ondblclick={(event: MouseEvent & { currentTarget: HTMLElement }) => {
				const text = event.currentTarget.textContent;
				if (text) event.currentTarget.replaceWith(text);
			}}
		>
			This is an important announcement.
		</emphasis>
		<mark />
		This is editable text with a
		<break time="3s"></break>
		pause in the middle.
	</div>
	<nav class="sticky bottom-0 h-12 border border-t-0 bg-gray-200"></nav>
</form>

<style lang="postcss">
	div[contenteditable] {
		> break {
			@apply bg-yellow-300;
			&::before {
				content: attr(time);
			}
		}
		> emphasis {
			/* .relative.bg-yellow-100 hides the caret */
			@apply relative border-t-2 border-yellow-300;
			&::before {
				@apply absolute -top-4 whitespace-pre bg-yellow-300 text-xs;
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
