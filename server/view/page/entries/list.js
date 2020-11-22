'use strict';

const EntryList = require('../../partial/entry-list');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderEntriesListPage(context) {
	const {entries} = context;

	context.pageTitle = 'Entries';

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>
		<${EntryList} entries=${entries} />
	`);
};
