'use strict';

const Breadcrumb = require('../../partial/breadcrumb');
const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderPasswordGenerationPage(context) {
	const {hashedPassword, passwordGenerationForm, request, settings} = context;

	context.pageTitle = 'Generate a Password';

	// Populate main content
	let content = '';

	// Password generated successfully
	if (hashedPassword) {
		content = html`
			<div class="content-body">
				<div class="notification notification--success">
					<p>
						Your password has been generated successfully!
						Please perform the next steps below in order
						to secure ${settings.siteTitle}. If you leave
						this page then you'll need to regenerate your
						password hash.
					</p>
				</div>
				<h2>Next Steps</h2>
				<ol>
					<li>
						<p>
							Copy the hashed password below somewhere secure. This cannot be used
							to find your actual password, so you need to remember that too.
						</p>
						<p><code>${hashedPassword}</code></p>
					</li>
					<li>
						<p>
							On the server where ${settings.siteTitle} is running, set the ${' '}
							<code>PASSWORD_HASH</code> environment variable to the hash you copied
							above, and make sure it's available to the app.
						</p>
					</li>
					<li>
						<p>
							Make sure the application restarted to pick up the change.
						</p>
					</li>
					<li>
						<p>
							<a href="/">Head back to the home page</a> and sign in using the
							text password that you originally entered into this form. If you
							don't see a sign in form then something is not configured correctly,
							try this process again.
						</p>
					</li>
				</ol>
			</div>
		`;

	// Password generation form
	} else {
		content = html`
			<div class="content-body">
				<${Form} action=${passwordGenerationForm.action}>
					<${Form.Errors} errors=${passwordGenerationForm.errors} />

					<${Form.Field.Password}
						name="password"
						label="Password:"
						description="
							Set a password which will be required to log into the site
							in future. Once generated, you will need to add the password
							hash to your site configuration using the PASSWORD_HASH
							environment variable. Instructions follow on the next page
						"
					/>

					<${Form.Submit} label="Generate password hash" />
				<//>
			</div>
		`;
	}

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
