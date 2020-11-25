'use strict';

const {html, Partial} = require('@rowanmanning/app');

/**
 * Represents a list of content.
 */
module.exports = class ContentList extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the content list.
	 * @param {Array<Object>} [context.items]
	 *     The items to add to the content list.
	 * @param {Boolean} [context.ordered]
	 *     Whether the content list is ordered semantically.
	 */
	constructor(context) {
		super(context);
		this.items = context.items || [];
		this.children = context.children || [];
		this.ordered = Boolean(context.ordered);
		this.classList = ['content-list'];
		this.itemClassList = ['content-list__item'];
	}

	/**
	 * Render the content list.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the content list.
	 */
	render() {
		if (this.items.length) {
			if (this.ordered) {
				return html`
					<ol class=${this.classList.join(' ')}>${this.renderItems()}</ol>
				`;
			}
			return html`
				<ul class=${this.classList.join(' ')}>${this.renderItems()}</ul>
			`;
		}
		return this.renderPlaceholder();
	}

	/**
	 * Render all of the content items.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the content items.
	 */
	renderItems() {
		return this.items.map(this.renderItem.bind(this));
	}

	/**
	 * Render a single content item.
	 *
	 * @access private
	 * @param {Object} item
	 *     An object representation of a content item.
	 * @returns {Object}
	 *     Returns an HTML element representing the content item.
	 */
	renderItem(item) {
		return html`
			<li class=${this.itemClassList.join(' ')}>${item}</li>
		`;
	}

	/**
	 * Render a placeholder if there are no items in the list.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the placeholder element.
	 */
	renderPlaceholder() {
		return this.children;
	}

};
