'use strict';

const {html, Partial} = require('@rowanmanning/app');
const mediaType = require('../../../lib/media-type');
const proxyImageUrl = require('../../../lib/proxy-image-url');

/**
 * Represents a media enclosure.
 */
module.exports = class Enclosure extends Partial {

	/**
	 * Class constructor.
	 *
	 * @access public
	 * @param {Object} [context={}]
	 *     Data to pass into the enclosure element.
	 * @param {Object} context.enclosure
	 *     The enclosure.
	 * @param {Object} context.entry
	 *     The entry that the enclosure is in.
	 */
	constructor(context) {
		super(context);
		this.enclosure = this.context.enclosure;
		this.entry = this.context.entry;
	}

	/**
	 * Render the enclosure element.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the enclosure element.
	 */
	render() {
		switch (this.enclosure.type) {
			case mediaType.AUDIO:
				return this.renderAudio();
			case mediaType.IMAGE:
				return this.renderImage();
			case mediaType.VIDEO:
				return this.renderVideo();
			default:
				return this.renderUnknown();
		}
	}

	/**
	 * Render the enclosure wrapper element.
	 *
	 * @access private
	 * @param {Object} content
	 *     The inner content of the wrapper.
	 * @returns {Object}
	 *     Returns an HTML element representing the enclosure wrapper element.
	 */
	renderWrapper(content) {
		return html`
			<div
				class="content-body content-body--${this.enclosure.type}"
				data-test="entry-enclosure"
			>${content}</div>
		`;
	}

	/**
	 * Render the enclosure as an audio.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the enclosure.
	 */
	renderAudio() {
		return this.renderWrapper(html`
			<audio controls src=${this.enclosure.url}>
				<p>
					Your browser does not support the audio element.
					Try <a href=${this.enclosure.url}>opening the original audio file</a>
				</p>
			</audio>
		`);
	}

	/**
	 * Render the enclosure as an image.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the enclosure.
	 */
	renderImage() {
		return this.renderWrapper(html`
			<p>
				<a href=${this.enclosure.url}>
					<img src=${proxyImageUrl(this.enclosure.url)} alt=${this.entry.title} />
				</a>
			</p>
		`);
	}

	/**
	 * Render the enclosure as an video.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the enclosure.
	 */
	renderVideo() {
		return this.renderWrapper(html`
			<video controls src=${this.enclosure.url}>
				<p>
					Your browser does not support the video element.
					Try <a href=${this.enclosure.url}>opening the original video file</a>
				</p>
			</audio>
		`);
	}

	/**
	 * Render the enclosure as an unknown media type.
	 *
	 * @access private
	 * @returns {Object}
	 *     Returns an HTML element representing the enclosure.
	 */
	renderUnknown() {
		return this.renderWrapper(html`
			<div class="unrenderable">
				This entry contains an enclosure that can't be rendered. ${' '}
				<a href=${this.enclosure.url}>You can view the content of the enclosure here</a>,
				or <a href=${this.entry.htmlUrl}>view the original article</a>.
			</div>
		`);
	}

};
