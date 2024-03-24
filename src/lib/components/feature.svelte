<script lang="ts">
	import { Lock } from 'lucide-svelte';
	import * as Card from './ui/card';

	export let title: string = 'Features';
</script>

<Card.Root
	class="h-full w-full border-transparent bg-opacity-75 group-hover:scale-y-105 group-hover:bg-opacity-100 group-hover:shadow-2xl"
>
	<Card.Header>
		<Card.Title>
			<p class="flex">
				<slot name="icon">
					<Lock />
				</slot>
				<span class="ml-5 group-hover:text-teal-400">{title}</span>
			</p>
		</Card.Title>
	</Card.Header>
	<Card.Content>
		<p class="md:line-clamp-2 md:group-hover:line-clamp-none">
			<slot>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, modi iste ratione dolorem,
				nulla quod, culpa in expedita accusamus nisi soluta nam. Totam laudantium libero saepe quia
				ipsam quas debitis!
			</slot>
		</p>
	</Card.Content>
</Card.Root>
