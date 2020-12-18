'use strict';

const Breadcrumb = require('../../partial/breadcrumb');
const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedSettingsPage(context) {
	const {feed, feedSettingsForm, request} = context;

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
		<div class="content-body">
			<${Form} action=${feedSettingsForm.action}>
				<${Form.Errors} errors=${feedSettingsForm.errors} />
				${showSaveSuccess()}

				<${Form.Field.Text}
					name="customTitle"
					label="Feed title:"
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
			<${Form} method="get" action=${feed.unsubscribeUrl}>
				<${Form.Submit} label="Unsubscribe from this feed" danger=true />
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

	function showSaveSuccess() {
		const flashMessage = request.flash('saved');
		if (flashMessage && flashMessage.length) {
			return html`
				<div class="notification notification--success" data-test="settings-saved">
					<p>
						Your feed settings have been saved. ${' '}
						<a href=${feed.url}>Head back to the feed to view changes</a>.
					</p>
				</div>
			`;
		}
		return '';
	}

	// Wrap the content in a layout and return to render
	return layout(context, content);
};
