<script lang="ts">
	import { lgScreen } from '@utils';
	import { onBoardingStepStore } from '@stores';
	import { page } from '$app/stores';

	$: if ($lgScreen) {
		onBoardingStepStore.validateStep(false);
	} else {
		onBoardingStepStore.validateStep(true);
	}
</script>

<div class="flex flex-col space-y-3 text-center md:container sm:mx-4 md:mx-0">
	<h1 class="py-10 text-4xl font-bold">Welcome</h1>

	<p>{$page.data.user.email}, Please Read the Following, to proceed</p>

	<p class="text-lg md:mx-44">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime placeat quibusdam omnis sed
		dolorem adipisci facere, repudiandae, ex, nihil autem inventore tempora? Mollitia fugit eius
		velit quo nobis eos similique.
	</p>

	<p class="text-lg md:mx-44">
		Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad
		nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
		Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla
		est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat
		reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa
		proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua
		reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat
		ullamco ut ea consectetur et est culpa et culpa duis. Lorem ipsum dolor sit amet, consectetur
		adipisicing elit. Maxime placeat quibusdam omnis sed dolorem adipisci facere, repudiandae, ex,
		nihil autem inventore tempora? Mollitia fugit eius velit quo nobis eos similique.
	</p>

	<p class="text-lg md:mx-44">
		Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur
		cupidatat.
	</p>

	<p class="py-4 text-xl font-light">Let's get started</p>
</div>
