'use strict';

const Breadcrumbs = require('../../component/breadcrumbs');
const Form = require('../../component/form');
const {h, Component, Fragment} = require('preact');
const MainLayout = require('../../layout/main');
const Notification = require('../../component/notification');

module.exports = class SubscribePage extends Component {

	render(props) {
		const {breadcrumbs, feed, feedSettingsForm, request} = props;

		props.pageTitle = `Settings for ${feed.displayTitle}`;

		// Add breadcrumbs
		props.breadcrumbs.push({
			label: 'Feeds',
			url: '/feeds'
		});
		props.breadcrumbs.push({
			label: feed.displayTitle,
			url: feed.url
		});

		// Show settings save success message
		function showSaveSuccess() {
			const flashMessage = request.flash('saved');
			if (flashMessage && flashMessage.length) {
				return (
					<Notification type="success" testId="settings-saved">
						<p>
							Your feed settings have been saved. {' '}
							<a href={feed.url}>Head back to the feed to view changes</a>.
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

		// Populate main content
		return (
			<MainLayout {...props}>
				<div class="content-body">
					<Form action={feedSettingsForm.action}>
						<Form.Errors errors={feedSettingsForm.errors} />
						{showSaveSuccess()}
						<Form.Field.Text
							name="customTitle"
							label="Feed title:"
							description="
								Specify a custom title for this feed.
								If you leave this field blank, the original
								title of the feed will be used
							"
							value={feedSettingsForm.data.customTitle}
						/>
						<Form.Submit label="Save changes" />
					</Form>

					<h2>The Danger Zone</h2>
					<Form method="get" action={feed.unsubscribeUrl}>
						<Form.Submit label="Unsubscribe from this feed" danger={true} />
					</Form>
				</div>
			</MainLayout>
		);
	}

};
