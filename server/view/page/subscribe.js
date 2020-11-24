'use strict';

const Form = require('../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../layout/main');

module.exports = function renderSubscribePage(context) {
	const {subscribeForm} = context;

	context.pageTitle = 'Subscribe to a feed';

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>

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
	`);
};
