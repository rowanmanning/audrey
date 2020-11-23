'use strict';

const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsEditPage(context) {
	const {feed, editFeedForm} = context;

	context.pageTitle = `Editing ${feed.displayTitle}`;

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>

		<${Form} action=${editFeedForm.action}>
			<${Form.Errors} errors=${editFeedForm.errors} />

			<${Form.Field.Text}
				name="customTitle"
				label="Feed Title"
				description="
					Specify a custom title for this feed.
					If you leave this field blank, the original
					title of the feed will be used
				"
				value=${editFeedForm.data.customTitle}
			/>

			<${Form.Field.Url}
				name="xmlUrl"
				label="Feed URL"
				description="
					Change the URL for the feed if it's moved.
					This must be a valid ATOM or RSS feed,
					changing a feed URL may cause duplication
					of content
				"
				value=${editFeedForm.data.xmlUrl}
			/>

			<${Form.Submit} label="Save changes" />
		<//>
	`);
};
