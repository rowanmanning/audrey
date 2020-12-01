'use strict';

const Breadcrumb = require('../../partial/breadcrumb');
const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderLoginPage(context) {
	const {loginForm} = context;

	context.pageTitle = 'Sign in';

	// Populate main content
	const content = html`
		<div class="content-body">
			<${Form} action=${loginForm.action}>
				<${Form.Errors} errors=${loginForm.errors} />

				<${Form.Field.Password}
					name="password"
					label="Password:"
					description="
						The password required to log into this site
					"
				/>

				<${Form.Submit} label="Sign in" />
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
