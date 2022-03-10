
'use strict';

const BaseField = require('./base');
const {h} = require('preact');
const shortid = require('shortid');

/**
 * Represents a form field.
 */
module.exports = class Field extends BaseField {

	/**
	 * Class constructor.
	 *
	 * @access public
	 */
	constructor(...args) {
		super(...args);
		if (!this.props.name) {
			throw new Error('Field `name` is required');
		}
		this.props.fieldId = this.props.fieldId || shortid.generate();
	}

	/**
	 * Render the field input.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the field input.
	 */
	renderInput() {
		return (
			<input
				id={this.props.fieldId}
				type={this.props.type}
				name={this.props.name}
				value={this.props.value}
				disabled={this.props.disabled}
				checked={this.props.checked}
				min={this.props.min}
				max={this.props.max}
				step={this.props.step}
			/>
		);
	}

};
