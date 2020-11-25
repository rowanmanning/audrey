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

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>

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
	`);
};
