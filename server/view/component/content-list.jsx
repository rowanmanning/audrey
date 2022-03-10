'use strict';

const {h, Component} = require('preact');

/**
 * Represents a list of content.
 */
module.exports = class ContentList extends Component {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		this.props.items = this.props.items || [];
		this.props.ordered = Boolean(this.props.ordered);
		this.props.classList = ['content-list'];
		this.props.itemClassList = ['content-list__item'];
	}

	/**
	 * Render the content list.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the content list.
	 */
	render({children, classList, items, ordered}) {
		if (items.length) {
			const className = classList.join(' ');
			items = items.map(this.renderItem.bind(this));
			if (ordered) {
				return (
					<ol class={className}>{items}</ol>
				);
			}
			return (
				<ul class={className}>{items}</ul>
			);
		}
		return children;
	}

	/**
	 * Render a single content item.
	 *
	 * @access private
	 * @param {Object} item
	 *     An object representation of a content item.
	 * @param {Number} index
	 *     The item's position in the list.
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the content item.
	 */
	renderItem(item, index) {
		const className = this.props.itemClassList.join(' ');
		return (
			<li key={index} class={className}>{item}</li>
		);
	}

};
