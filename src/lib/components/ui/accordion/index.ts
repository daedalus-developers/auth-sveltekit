import { Accordion as AccordionPrimitive } from 'bits-ui';
import Content from './accordion-content.svelte';
import Item from './accordion-item.svelte';
import Trigger from './accordion-trigger.svelte';
import TriggerNoIcon from './accordion-trigger-no-icon.svelte';
const Root = AccordionPrimitive.Root;

export {
	Root,
	Content,
	Item,
	Trigger,
	TriggerNoIcon,
	//
	Root as Accordion,
	Content as AccordionContent,
	Item as AccordionItem,
	Trigger as AccordionTrigger,
	TriggerNoIcon as AccordionTriggerNoIcon
};
