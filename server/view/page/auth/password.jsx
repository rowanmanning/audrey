'use strict';

const Form = require('../../component/form');
const {h, Component, Fragment} = require('preact');
const MainLayout = require('../../layout/main');
const Notification = require('../../component/notification');

module.exports = class PasswordGenerationPage extends Component {

	render(props) {
		const {settings, setPasswordForm} = props;

		props.pageTitle = 'Set a Password';

		// Populate content sub-sections
		props.subSections = {

			// Content heading
			heading: (
				<Fragment>
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
					<Notification type="help">
						<p><strong>Welcome to {settings.siteTitle}!</strong></p>
						<p>
							Before you can start subscribing to feeds, you'll need to set a
							password using the form below. This prevents anyone except you
							from making changes to your subscriptions or settings.
						</p>
					</Notification>
					<Form action={setPasswordForm.action}>
						<Form.Errors errors={setPasswordForm.errors} />
						<Form.Field.Password
							name="password"
							label="Password:"
							description="
								Set a password which will be required to log into the site
								in future. This must be 8 or more characters in length.
							"
						/>
						<Form.Submit label="Set password" />
					</Form>
				</div>
			</MainLayout>
		);
	}

};
