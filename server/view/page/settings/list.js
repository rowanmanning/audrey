'use strict';

const Form = require('../../partial/form');
const {html} = require('@rowanmanning/app');
const layout = require('../../layout/main');

module.exports = function renderSettingsListPage(context) {
	const {settings, settingsForm} = context;

	context.pageTitle = 'Settings';

	return layout(context, html`
		<header class="content-head">
			<h1 class="content-head__title">${context.pageTitle}</h1>
		</header>

		<${Form} action=${settingsForm.action}>
			<${Form.Errors} errors=${settingsForm.errors} />

			<${Form.Field.Group}
				label="Remove old posts"
				description="
					Whether posts with a publish date older than
					${settings.daysToRetainOldPosts} days should be
					removed automatically. Turning this setting off
					may cause your database to run out of space
				"
			>
				<${Form.Field.Radio}
					name="removeOldPosts"
					label="Yes, remove old posts"
					value="true"
					checked=${settingsForm.data.removeOldPosts}
				/>
				<${Form.Field.Radio}
					name="removeOldPosts"
					label="No, do not remove anything automatically"
					value=""
					checked=${!settingsForm.data.removeOldPosts}
				/>
			<//>

			<${Form.Field.Number}
				name="daysToRetainOldPosts"
				label="Days to retain posts"
				description="
					The number of days to retain old posts if you
					have configured them to be automatically removed.
					Posts older than this will not be ingested
				"
				value=${settingsForm.data.daysToRetainOldPosts}
				min="1"
			/>

			<${Form.Submit} label="Save changes" />
		<//>

	`);
};
