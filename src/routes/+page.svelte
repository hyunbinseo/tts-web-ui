<script lang="ts">
	import { createHandleDelete } from '.';

	let editor = $state<HTMLElement>();
	const handleDelete = $derived(createHandleDelete(editor));
</script>

<div
	tabindex="0"
	role="textbox"
	aria-multiline="true"
	bind:this={editor}
	contenteditable
	onkeydown={handleDelete}
	ondragstart={handleDelete}
	ondrop={handleDelete}
	oncut={handleDelete}
	onpaste={handleDelete}
	class="border-2 border-black p-4"
>
	This is editable text with a
	<break time="3s">3s</break>
	pause in the middle.
</div>

<style lang="postcss">
	break {
		@apply bg-yellow-300;
	}
</style>
