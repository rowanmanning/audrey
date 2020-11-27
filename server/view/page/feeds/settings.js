'use strict';

const Breadcrumb = require('../../partial/breadcrumb');
const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedSettingsPage(context) {
	const {feed, feedSettingsForm} = context;

	context.pageTitle = `Settings for ${feed.displayTitle}`;

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
		<${Form} action=${feedSettingsForm.action}>
			<${Form.Errors} errors=${feedSettingsForm.errors} />

			<${Form.Field.Text}
				name="customTitle"
				label="Feed Title"
				description="
					Specify a custom title for this feed.
					If you leave this field blank, the original
					title of the feed will be used
				"
				value=${feedSettingsForm.data.customTitle}
			/>

			<${Form.Submit} label="Save changes" />
		<//>

		<h2>The Danger Zone</h2>

		<ul>
			<li><a href=${feed.unsubscribeUrl}>Unsubscribe from this feed</a></li>
		</ul>
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
