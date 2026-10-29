// Components that need JavaScript in the browser (bits-ui + the Svelte runtime): for the app.
// Static sites (the landing) must only import from 'shelter-assets', which renders to plain HTML.
// bits-ui is an optional peer dependency: install it in the projects that import from here.

export { Label } from './components/interactive/label/index.js';
export {
	Tooltip,
	TooltipContent,
	TooltipPortal,
	TooltipProvider,
	TooltipTrigger
} from './components/interactive/tooltip/index.js';
