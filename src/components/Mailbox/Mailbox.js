import React from 'react';
import Sidebar from './Sidebar';
import EmailDetails from './EmailDetails';
import EmailList from './EmailList';
import Composer from './Composer';
import LoadingScreen from './../LoadingScreen'
import './Mailbox.css';
import $ from "jquery"
import refreshInbox from './../../lib/refreshInbox'
import Arweave from 'arweave/web'

class Mailbox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			selectedEmailId: 0,
			currentSection: 'inbox',
			composeMode: true
		};
	}

	setEmails(emails) {
		// Assign unique IDs to the emails
		let id = 0;
		for(const email of emails)
			email.id = id++;

		this.setState({
			emails: emails,
			loading: false
		})
	}

	componentDidMount = async () => {
		const arweave = Arweave.init();

		// let that = this;
		// $.ajax({url: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/311743/dummy-emails.json',
    // 	type: 'GET',
    // 	success: function(result) {
		// 		// that.setEmails(result)
    //     console.log(result);
    // 	}
    // });

		let inbox = await refreshInbox(arweave, this.props.user)
		console.log(inbox);
		this.setEmails(inbox)
	}

	openEmail(id) {
		const emails = this.state.emails;
		const index = emails.findIndex(x => x.id === id);
		emails[index].read = 'true';
		this.setState({
			selectedEmailId: id,
			emails
		});
	}

	deleteMessage(id) {
		// Mark the message as 'deleted'
		const emails = this.state.emails;
		const index = emails.findIndex(x => x.id === id);
		emails[index].tag = 'deleted';

		// Select the next message in the list
		let selectedEmailId = '';
		for (const email of emails) {
			if (email.tag === this.state.currentSection) {
				selectedEmailId = email.id;
				break;
			}
		}

		this.setState({
			emails,
			selectedEmailId
		});
	}

	setSidebarSection(section) {
		let selectedEmailId = this.state.selectedEmailId;
		if (section !== this.state.currentSection) {
			selectedEmailId = '';
		}

		this.setState({
			currentSection: section,
			selectedEmailId
		});
	}

	render() {
		if(this.state.loading) return <LoadingScreen />
		else {
			const currentEmail = this.state.emails.find(x => x.id === this.state.selectedEmailId);
			return (
				<main id="mailbox">
	        <header>
	          <i className="fas fa-user-circle"></i>
	          <ul>
	            <li style={{fontFamily: 'monospace'}}>{this.props.user.address}</li>
	            <li>{this.props.user.balance} AR</li>
	          </ul>
	        </header>
					<Sidebar
						emails={this.state.emails}
						setSidebarSection={(section) => { this.setSidebarSection(section); }}
						handleComposeClick={() => this.setState({composeMode: true})}
	        />
					<EmailList
						emails={this.state.emails.filter(x => x.tag === this.state.currentSection)}
						onEmailSelected={(id) => { this.openEmail(id); }}
						selectedEmailId={this.state.selectedEmailId}
						currentSection={this.state.currentSection}
	        />
					<div className="email-content">
						{this.state.composeMode && <Composer />}
						{!this.state.composeMode && <EmailDetails
							email={currentEmail}
							onDelete={(id) => { this.deleteMessage(id); }}
		        />}
					</div>
	        <footer>
	          <a href="https://github.com/bidetaggle" target="_blank" rel="noopener noreferrer">Made by bidetaggle</a>
	        </footer>
				</main>
			)
		}
	}
}
export default Mailbox;
