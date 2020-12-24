'use strict';

const Breadcrumbs = require('../../component/breadcrumbs');
const Form = require('../../component/form');
const {h, Component, Fragment} = require('@rowanmanning/app/preact');
const MainLayout = require('../../layout/main');

module.exports = class SubscribePage extends Component {

	render(props) {
		const {breadcrumbs, feed, unsubscribeForm} = props;

		props.pageTitle = `Unsubscribe from ${feed.displayTitle}`;

		// Add breadcrumbs
		props.breadcrumbs.push({
			label: 'Feeds',
			url: '/feeds'
		});
		props.breadcrumbs.push({
			label: feed.displayTitle,
			url: feed.url
		});

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
					<Form action={unsubscribeForm.action}>
						<Form.Errors errors={unsubscribeForm.errors} />
						<Form.Field.Group
							label="Confirm unsubscribe:"
							description="
								Unsubscribing from this feed will delete the
								feed and all associated entries including any
								you've bookmarked. This deletion is permanent.
								Are you sure?
							"
						>
							<Form.Field.Checkbox
								name="confirm"
								label="I confirm I want to unsubscribe"
								value="true"
							/>
						</Form.Field.Group>
						<Form.Submit label="Unsubscribe" danger={true} />
					</Form>
				</div>
			</MainLayout>
		);
	}

};
