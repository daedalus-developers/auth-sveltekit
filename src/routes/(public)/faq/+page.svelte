<script lang="ts">
	import * as Accordion from '@components/ui/accordion';
	import mermaid from 'mermaid';
	import { fly, fade } from 'svelte/transition';
	import { mode } from 'mode-watcher';

	// type FaqItem = {
	// 	value: string;
	// 	diagram: string;
	// 	element: HTMLSpanElement;
	// 	show: boolean;
	// };

	let diagram = `
sequenceDiagram
    Alice ->> Bob: Hello Bob, how are you?
    Bob-->>John: How about you John?
    Bob--x Alice: I am good thanks!
    Bob-x John: I am good thanks!
    Note right of John: Bob thinks a long<br/>long time, so long<br/>that the text does<br/>not fit on a row.

    Bob-->Alice: Checking with John...
    Alice->John: Yes... John, how are you?
`;

	let container: HTMLSpanElement;

	let render = false;

	const renderDigram = async () => {
		mermaid.initialize({
			theme: $mode === 'dark' ? 'dark' : 'forest'
		});
		const { svg } = await mermaid.render('Logic', diagram);
		container.innerHTML = svg;
	};

	$: if (render) {
		renderDigram();
	}
</script>

<div class="mx-auto flex max-w-7xl flex-col items-center justify-center">
	<h1 class="py-16 text-center text-5xl font-bold md:text-9xl">F.A.Q.</h1>
	<div class="mx-auto flex min-w-full justify-center px-4">
		<Accordion.Root class="min-w-full">
			<Accordion.Item value="item-1">
				<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
				<Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-2">
				<Accordion.Trigger on:click={() => (render = !render)}>Is it animated?</Accordion.Trigger>
				<Accordion.Content>
					Yes. It's animated by default, but you can disable it if you prefer.
					{#key render}
						<div in:fade={{ delay: 500, duration: 500 }} out:fly={{ y: 100 }}>
							<span bind:this={container}></span>
						</div>
					{/key}
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
</div>
