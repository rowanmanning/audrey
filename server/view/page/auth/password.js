'use strict';

const Breadcrumb = require('../../partial/breadcrumb');
const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderPasswordGenerationPage(context) {
	const {setPasswordForm, settings} = context;

	context.pageTitle = 'Set a Password';

	// Populate main content
	const content = html`
		<div class="content-body">
			<div class="notification notification--help">
				<p><strong>Welcome to ${settings.siteTitle}!</strong></p>
				<p>
					Before you can start subscribing to feeds, you'll need to set a password
					using the form below. This prevents anyone except you from making changes
					to your subscriptions or settings.
				</p>
			</div>
			<${Form} action=${setPasswordForm.action}>
				<${Form.Errors} errors=${setPasswordForm.errors} />

				<${Form.Field.Password}
					name="password"
					label="Password:"
					description="
						Set a password which will be required to log into the site
						in future. This must be 8 or more characters in length.
					"
				/>

				<${Form.Submit} label="Set password" />
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
