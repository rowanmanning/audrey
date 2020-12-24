'use strict';

const {h, Component} = require('preact');
const Footer = require('../component/section/footer');
const Header = require('../component/section/header');
const Layout = require('./default');
const Main = require('../component/section/main');

module.exports = class MainLayout extends Component {

	render(props) {
		const {children, currentPath, settings, subSections} = props;
		return (
			<Layout {...props}>
				<Header title={settings.siteTitle} currentPath={currentPath} />
				<Main subSections={subSections}>{children}</Main>
				<Footer />
			</Layout>
		);
	}

};
