'use strict';

const Form = require('../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../layout/main');

module.exports = function renderSubscribePage(context) {
	const {subscribeForm} = context;

	context.pageTitle = 'Subscribe to a feed';

	// Populate main content
	const content = html`
		<${Form} action=${subscribeForm.action}>
			<${Form.Errors} errors=${subscribeForm.errors} />

			<${Form.Field.Url}
				name="xmlUrl"
				label="Feed URL"
				description="
					The URL for a valid ATOM or RSS feed
				"
				value=${subscribeForm.data.xmlUrl}
			/>

			<${Form.Submit} label="Subscribe" />
		<//>
	`;

	// Populate content sub-sections
	context.subSections = {

		// Content heading
		heading: html`
			<div class="content-head">
				<h1 class="content-head__title">${context.pageTitle}</h1>
			</div>
		`
	};

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
