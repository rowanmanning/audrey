'use strict';

const Breadcrumbs = require('../component/breadcrumbs');
const Form = require('../component/form');
const {h, Component, Fragment} = require('@rowanmanning/app/preact');
const MainLayout = require('../layout/main');

module.exports = class SubscribePage extends Component {

	render(props) {
		const {breadcrumbs, settings, subscribeForm} = props;

		props.pageTitle = 'Subscribe to a feed';

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
					<Form action={subscribeForm.action}>
						<Form.Errors errors={subscribeForm.errors} />
						<Form.Field.Url
							name="xmlUrl"
							label="Feed URL:"
							description={`
								The URL for a valid ATOM or RSS feed. Subscribing will fetch the
								feed and all entries, loading them into ${settings.siteTitle} for
								you to read
							`}
							value={subscribeForm.data.xmlUrl}
						/>
						<Form.Submit label="Subscribe" />
					</Form>
				</div>
			</MainLayout>
		);
	}

};
