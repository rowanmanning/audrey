'use strict';

const {h, Component} = require('preact');
const MainLayout = require('./layout/main');

module.exports = class ErrorPage extends Component {

	render(props) {
		const {error, settings} = props;

		props.pageTitle = `Error: ${error.statusCode}`;

		// Populate content sub-sections
		props.subSections = {

			// Content heading
			heading: (
				<div class="content-head">
					<h1 class="content-head__title">{settings.siteTitle}</h1>
				</div>
			)
		};

		// Populate main content
		return (
			<MainLayout {...props}>
				<div class="content-body">
					<p>{error.message}</p>
					{(
						error.stack ?
							<pre>{error.stack}</pre> :
							''
					)}
				</div>
			</MainLayout>
		);
	}

};
