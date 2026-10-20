import Root, { type AccordionProps, type AccordionType } from './accordion.svelte';
import Content, { type AccordionContentProps } from './accordion-content.svelte';
import Item, { type AccordionItemProps } from './accordion-item.svelte';
import Trigger, { type AccordionTriggerProps } from './accordion-trigger.svelte';

export {
	Root,
	Content,
	Item,
	Trigger,
	type AccordionProps as Props,
	type AccordionContentProps as ContentProps,
	type AccordionItemProps as ItemProps,
	type AccordionTriggerProps as TriggerProps,
	//
	Root as Accordion,
	Content as AccordionContent,
	Item as AccordionItem,
	Trigger as AccordionTrigger,
	type AccordionProps,
	type AccordionType,
	type AccordionContentProps,
	type AccordionItemProps,
	type AccordionTriggerProps
};
