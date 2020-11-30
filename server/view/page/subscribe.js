'use strict';

const Breadcrumb = require('../partial/breadcrumb');
const Form = require('../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../layout/main');

module.exports = function renderSubscribePage(context) {
	const {settings, subscribeForm} = context;

	context.pageTitle = 'Subscribe to a feed';

	// Populate main content
	const content = html`
		<div class="content-body">
			<${Form} action=${subscribeForm.action}>
				<${Form.Errors} errors=${subscribeForm.errors} />

				<${Form.Field.Url}
					name="xmlUrl"
					label="Feed URL:"
					description="
						The URL for a valid ATOM or RSS feed. Subscribing will fetch the
						feed and all entries, loading them into ${settings.siteTitle} for
						you to read
					"
					value=${subscribeForm.data.xmlUrl}
				/>

				<${Form.Submit} label="Subscribe" />
			<//>
		</div>
	`;

	// Populate content sub-sections
	context.subSections = {

		// Content heading
		heading: html`
			<${Breadcrumb} items=${context.breadcrumbs} />
			<div class="content-head">
				<h1 class="content-head__title">${context.pageTitle}</h1>
			</div>
		`
	};

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
