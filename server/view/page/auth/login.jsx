'use strict';

const Breadcrumbs = require('../../component/breadcrumbs');
const Form = require('../../component/form');
const {h, Component, Fragment} = require('@rowanmanning/app/preact');
const MainLayout = require('../../layout/main');
const Notification = require('../../component/notification');

module.exports = class SubscribePage extends Component {

	render(props) {
		const {breadcrumbs, loginForm, request, settings} = props;

		props.pageTitle = 'Sign in';

		// Show a password set success message
		function showPasswordSettingSuccess() {
			const flashMessage = request.flash('password-set');
			if (flashMessage && flashMessage.length) {
				return (
					<Notification type="success">
						<p>
							You've set your password, thanks! Now {settings.siteTitle} is
							more secure. You'll need to sign in to start subscribing to feeds.
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
					{showPasswordSettingSuccess()}
					<Form action={loginForm.action}>
						<Form.Errors errors={loginForm.errors} />
						<Form.Field.Password
							name="password"
							label="Password:"
							description="The password required to log into this site"
						/>
						<Form.Submit label="Sign in" />
					</Form>
				</div>
			</MainLayout>
		);
	}

};
