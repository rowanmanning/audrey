'use strict';

const {h, Component} = require('preact');
const manifest = require('../../../package.json');

module.exports = class DefaultLayout extends Component {

	render({children, pageDescription, pageTitle, settings}) {

		// Set the title to include the site title
		const title = pageTitle ? `${pageTitle} | ${settings.siteTitle}` : settings.siteTitle;

		// Set up client-side asset cache-busting
		const assetCacheBustValue = manifest.version;

		return (
			<html lang="en">
				<head>
					<meta charset="utf-8" />
					<title>{title}</title>
					{this.renderPageDescription(pageDescription)}
					<meta name="robots" content="noindex" />
					<meta name="viewport" content="width=device-width" />
					<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Slab&amp;display=swap" />
					<link rel="stylesheet" href={`/main.css?${assetCacheBustValue}`} />
				</head>
				<body class="page">
					{children}
				</body>
			</html>
		);
	}

	renderPageDescription(description) {
		if (description) {
			return <meta name="description" content={description} />;
		}
		return '';
	}

};
