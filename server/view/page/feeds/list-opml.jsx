'use strict';

const {h, Component} = require('preact');

module.exports = class FeedExportOpmlPage extends Component {

	render(props) {
		const {feeds, settings} = props;
		return (
			<opml version="1.0">
				<head>
					<title>{settings.siteTitle} Feed Export</title>
				</head>
				<body>
					{feeds.map(feed => (
						<outline
							type="rss"
							text={feed.displayTitle}
							title={feed.displayTitle}
							xmlUrl={feed.xmlUrl}
							htmlUrl={feed.htmlUrl}
						/>
					))}
				</body>
			</opml>
		);
	}

};
