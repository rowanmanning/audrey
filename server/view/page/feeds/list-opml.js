'use strict';

const {html} = require('@rowanmanning/app');

module.exports = function renderFeedsListOpmlPage(context) {
	const {feeds, settings} = context;
	return html`
		<opml version="1.0">
			<head>
				<title>${settings.siteTitle} Feed Export</title>
			</head>
			<body>
				${feeds.map(feed => html`
					<outline
						type="rss"
						text=${feed.displayTitle}
						title=${feed.displayTitle}
						xmlUrl=${feed.xmlUrl}
						htmlUrl=${feed.htmlUrl}
					/>
				`)}
			</body>
		</opml>
	`;
};
