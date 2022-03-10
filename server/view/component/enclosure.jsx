'use strict';

const {h, Component} = require('preact');
const mediaType = require('../../lib/media-type');

/**
 * Represents a media enclosure.
 */
module.exports = class Enclosure extends Component {

	/**
	 * Render the enclosure element.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the enclosure.
	 */
	render({enclosure}) {
		switch (enclosure.type) {
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
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the enclosure wrapper element.
	 */
	renderWrapper(content) {
		const {enclosure} = this.props;
		return (
			<div
				class={`content-body content-body--${enclosure.type}`}
				data-test="entry-enclosure"
			>{content}</div>
		);
	}

	/**
	 * Render the enclosure as an audio.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the enclosure.
	 */
	renderAudio() {
		const {enclosure} = this.props;
		return this.renderWrapper(
			<audio controls src={enclosure.url}>
				<p>
					Your browser does not support the audio element.
					Try <a href={enclosure.url}>opening the original audio file</a>
				</p>
			</audio>
		);
	}

	/**
	 * Render the enclosure as an image.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the enclosure.
	 */
	renderImage() {
		const {enclosure, entry} = this.props;
		return this.renderWrapper(
			<p>
				<a href={enclosure.url}>
					<img src={enclosure.url} alt={entry.title} />
				</a>
			</p>
		);
	}

	/**
	 * Render the enclosure as a video.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the enclosure.
	 */
	renderVideo() {
		const {enclosure} = this.props;
		return this.renderWrapper(
			<video controls src={enclosure.url}>
				<p>
					Your browser does not support the video element.
					Try <a href={enclosure.url}>opening the original video file</a>
				</p>
			</video>
		);
	}

	/**
	 * Render the enclosure as an unknown media type.
	 *
	 * @access private
	 * @returns {preact.VNode}
	 *     Returns a DOM element representing the enclosure.
	 */
	renderUnknown() {
		const {enclosure, entry} = this.props;
		return this.renderWrapper(
			<div class="unrenderable">
				This entry contains an enclosure that can't be rendered. {' '}
				<a href={enclosure.url}>You can view the content of the enclosure here</a>,
				or <a href={entry.htmlUrl}>view the original article</a>.
			</div>
		);
	}

};
