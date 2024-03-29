<script lang="ts">
	import { TierForm, PaymentMethodForm } from '@components';
	import { Separator } from '@components/ui/separator';
</script>

<div class="flex flex-col gap-y-4 pb-12">
	<TierForm />
	<Separator />
	<PaymentMethodForm />
</div>
