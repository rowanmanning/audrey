'use strict';

const {h, Component} = require('@rowanmanning/app/preact');

/**
 * Represents a form submit button.
 */
module.exports = class FormSubmit extends Component {

	/**
	 * Render the submit button.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the submit button.
	 */
	render({danger, label}) {
		const classList = [
			'form__submit',
			(danger ? 'form__submit--danger' : '')
		];
		return (
			<input
				type="submit"
				value={label || 'Submit'}
				class={classList.join(' ').trim()}
			/>
		);
	}

};
