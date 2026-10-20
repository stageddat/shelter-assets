export const accordionContextKey = Symbol('accordion');

export type AccordionContext = {
	/** `name` shared by the items of a `single` accordion; undefined in a `multiple` one */
	readonly name: string | undefined;
};
