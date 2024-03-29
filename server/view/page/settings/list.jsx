'use strict';

const Breadcrumbs = require('../../component/breadcrumbs');
const Form = require('../../component/form');
const {h, Component, Fragment} = require('preact');
const MainLayout = require('../../layout/main');
const Notification = require('../../component/notification');

module.exports = class SubscribePage extends Component {

	render(props) {
		const {app, breadcrumbs, request, settings, updateSettingsForm} = props;

		props.pageTitle = 'Settings';

		function showSaveSuccess() {
			const flashMessage = request.flash('saved');
			if (flashMessage && flashMessage.length) {
				return (
					<Notification type="success" testId="settings-saved">
						<p>
							Your settings have been saved.
						</p>
					</Notification>
				);
			}
			return '';
		}

		// Populate content sub-sections
		props.subSections = {

			// Content heading
			heading: (
				<Fragment>
					<Breadcrumbs items={breadcrumbs} />
					<div class="content-head">
						<h1 class="content-head__title">{props.pageTitle}</h1>
					</div>
				</Fragment>
			)
		};

		// Right-hand sidebar
		if (settings.showHelpText) {
			props.subSections.rhs = (
				<Notification type="help">
					<p>
						These are site-wide settings which help customise your
						use of {settings.siteTitle}.
					</p>
					<p>
						These boxes in the sidebar display help text to help you get used to
						using {settings.siteTitle}. Once you're familiar, you can turn them
						off using the "Show help text" setting on this page.
					</p>
				</Notification>
			);
		}

		// Populate main content
		return (
			<MainLayout {...props}>
				<div class="content-body">
					<Form action={updateSettingsForm.action}>
						<Form.Errors errors={updateSettingsForm.errors} />
						{showSaveSuccess()}

						<Form.Field.Text
							name="siteTitle"
							label="Site title:"
							description="
								The title of this installation of Audrey, displayed
								in the header section of all pages. Between 3 and 20
								characters in length
							"
							value={updateSettingsForm.data.siteTitle}
						/>

						<Form.Field.Group
							label="Remove old entries:"
							description={`
								Whether entries with a publish date older than
								${settings.daysToRetainOldEntries} days should be
								removed automatically. Turning this setting off
								may cause your database to run out of space
							`}
						>
							<Form.Field.Radio
								name="removeOldEntries"
								label="Yes, remove old entries"
								value="true"
								checked={updateSettingsForm.data.removeOldEntries}
							/>
							<Form.Field.Radio
								name="removeOldEntries"
								label="No, do not remove anything automatically"
								value=""
								checked={!updateSettingsForm.data.removeOldEntries}
							/>
						</Form.Field.Group>

						<Form.Field.Number
							name="daysToRetainOldEntries"
							label="Days to retain entries:"
							description="
								The number of days to retain old entries if you
								have configured them to be automatically removed.
								Entries older than this will not be ingested
							"
							value={updateSettingsForm.data.daysToRetainOldEntries}
							min="1"
						/>

						<Form.Field.Text
							name="schedule"
							label="Scheduled jobs:"
							disabled={true}
							description="
								The CRON expression used to schedule jobs like
								removing old entries and refreshing feeds. This is
								not editable via the interface, please configure
								via the UPDATE_SCHEDULE environment variable
							"
							value={app.updateSchedule}
							min="1"
						/>

						<Form.Field.Group
							label="Automatically mark entries as read:"
							description={`
								Whether to automatically mark an entry as read once
								you click on it. If this setting is off, then you will
								have to manually mark an entry as read to remove it
								from the "unread" view
							`}
						>
							<Form.Field.Radio
								name="autoMarkAsRead"
								label="Yes, mark as read automatically"
								value="true"
								checked={updateSettingsForm.data.autoMarkAsRead}
							/>
							<Form.Field.Radio
								name="autoMarkAsRead"
								label="No, I'll do this manually"
								value=""
								checked={!updateSettingsForm.data.autoMarkAsRead}
							/>
						</Form.Field.Group>

						<Form.Field.Group
							label="Show help text:"
							description="Whether to show help text across the site."
						>
							<Form.Field.Radio
								name="showHelpText"
								label="Yes, show help text"
								value="true"
								checked={updateSettingsForm.data.showHelpText}
							/>
							<Form.Field.Radio
								name="showHelpText"
								label="No, I don't need help"
								value=""
								checked={!updateSettingsForm.data.showHelpText}
							/>
						</Form.Field.Group>

						<Form.Submit label="Save changes" />
					</Form>
				</div>
			</MainLayout>
		);
	}

};
