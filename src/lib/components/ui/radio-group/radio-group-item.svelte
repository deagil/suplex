<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

	type $$Props = RadioGroupPrimitive.ItemProps;
	type $$Events = RadioGroupPrimitive.ItemEvents;

	interface Props {
		class?: $$Props['class'];
		value: $$Props['value'];
		[key: string]: unknown;
	}

	let { class: className = undefined, value, ...rest }: Props = $props();
</script>

<RadioGroupPrimitive.Item
	{value}
	class={cn(
		'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
		className,
	)}
	{...rest}
	onclick
/>
