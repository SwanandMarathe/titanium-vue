/**
 * Mapping of element tag names and their respective Titanium view and meta data
 *
 * @type {Map}
 */
let elements = new Map();

/**
 * The default meta data for a Titanium view node
 *
 * @type {Object}
 */
const defaultViewMeta = {
	skipAddToDom: false,
	isUnaryTag: false,
	tagNamespace: '',
	canBeLeftOpen: false,
	model: {
		prop: 'text',
		event: 'textChange'
	}
};

/**
 * Gets the factory function for a Titanium view
 *
 * @param {string} tagName Tag name associated with the Titanium view
 * @return {Function} The view's create factory function
 */
export function getTitaniumViewFactory(tagName) {
	if (!elements.has(tagName)) {
		throw new Error(`No component registerd for ${tagName}`);
	}

	let componentData = elements.get(tagName);
	try {
		return componentData.factoryResolver();
	} catch (e) {
		throw new TypeError(`Could not load create factory for: ${tagName}. ${e}`);
	}
}

/**
 * Gets the meta data for a view associated with the given tag name
 *
 * @param {string} tagName Tag name of the Titianium view
 * @return {Object} Meta data object
 */
export function getViewMeta(tagName) {
	let meta = defaultViewMeta;
	const elementData = elements.get(tagName);

	if (elementData && elementData.meta) {
		meta = elementData.meta;
	}

	return meta;
}

/**
 * Checks if we have a Titanium view registered for the given tag name
 *
 * @param {string} tagName Tag name to check
 * @return {Boolean} True if there is a Titanium view for the tag, false if not
 */
export function isKnownView(tagName) {
	return elements.has(tagName);
}

/**
 * Registers a Titanium UI view as a new element
 *
 * @param {string} tagName Tag name to register the elements under
 * @param {Function} createFactoryResolver Create factory function of the Titanium view
 * @param {Object} meta Optional meta data to be associated with the view
 */
export function registerElement(tagName, createFactoryResolver, meta = {}) {
	if (elements.has(tagName)) {
		throw new Error(`Element ${tagName} already registered.`);
	}

	let elementData = {
		factoryResolver: createFactoryResolver,
		meta: Object.assign({}, defaultViewMeta, meta)
	};
	elements.set(tagName, elementData);
}

// Register all Titanium view as vdom elements here
// Titanium views that need to be wrapped in a Vue component for easier usability
// should be prefixed with titanium, so the component can expose them under their
// original name
/* global Ti */
registerElement('button', () => Ti.UI.createButton);
registerElement('label', () => Ti.UI.createLabel);
registerElement('titanium-tab-group', () => Ti.UI.createTabGroup, {

});
registerElement('titanium-tab', () => Ti.UI.createTab, {

});
registerElement('window', () => Ti.UI.createWindow, {
	skipAddToDom: true
});
