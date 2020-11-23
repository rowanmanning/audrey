'use strict';

const FeedList = require('../../partial/feed-list');
const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderFeedsListPage(context) {
	const {feeds, createFeedForm} = context;

	context.pageTitle = 'Feeds';

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>

		<${Form} action=${createFeedForm.action}>
			<${Form.Errors} errors=${createFeedForm.errors} />

			<${Form.Field.Url}
				name="xmlUrl"
				label="Feed URL"
				description="
					The URL for a valid ATOM or RSS feed
				"
				value=${createFeedForm.data.xmlUrl}
			/>

			<${Form.Submit} label="Add feed" />
		<//>

		<${FeedList} feeds=${feeds} />
	`);
};
