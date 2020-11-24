'use strict';

const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsDeletePage(context) {
	const {feed, deleteFeedForm} = context;

	context.pageTitle = `Deleting ${feed.displayTitle}`;

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

		<${Form} action=${deleteFeedForm.action}>
			<${Form.Errors} errors=${deleteFeedForm.errors} />

			<${Form.Field.Group}
				label="Confirm deletion"
				description="
					Deleting this feed will also delete all associated entries,
					and deletion is permanent. Are you sure?
				"
			>
				<${Form.Field.Checkbox}
					name="confirm"
					label="I confirm I want to delete this"
					value="true"
				/>
			<//>

			<${Form.Submit} label="Delete feed" />
		<//>
	`);
};
