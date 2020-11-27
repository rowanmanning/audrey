'use strict';

const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsDeletePage(context) {
	const {feed, unsubscribeForm} = context;

	context.pageTitle = `Unsubscribe from ${feed.displayTitle}`;

	// Add breadcrumbs
	context.breadcrumbs.push({
		label: 'Feeds',
		url: '/feeds'
	});
	context.breadcrumbs.push({
		label: feed.displayTitle,
		url: feed.url
	});

	// Populate main content
	const content = html`
		<${Form} action=${unsubscribeForm.action}>
			<${Form.Errors} errors=${unsubscribeForm.errors} />

			<${Form.Field.Group}
				label="Confirm unsubscribe"
				description="
					Unsubscribing from this feed will delete the
					feed and all associated entries including any
					you've saved. This deletion is permanent.
					Are you sure?
				"
			>
				<${Form.Field.Checkbox}
					name="confirm"
					label="I confirm I want to unsubscribe"
					value="true"
				/>
			<//>

			<${Form.Submit} label="Unsubscribe" />
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
