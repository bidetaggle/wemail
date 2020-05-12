import React from 'react';
import getPrettyDate from './../../lib/getPrettyDate';

// Remove the seconds from the time
const getPrettyTime = (date) => {
	const time = date.split(' ')[1].split(':');
	return `${time[0]}:${time[1]}`;
}

const EmailDetails = ({ email, onDelete }) => {
	if (!email) {
		return (
			<div className="email-content empty"></div>
		);
	}

	const date = `${getPrettyDate(email.time)} · ${getPrettyTime(email.time)}`;

	const getDeleteButton = () => {
		if (email.tag !== 'deleted') {
			return <span onClick={() => { onDelete(email.id); }} className="delete-btn fas fa-trash"></span>;
		}
		return undefined;
	}

	return (
		<div>
			<div className="email-content__header">
				<h3 className="email-content__subject">{email.subject}</h3>
				{getDeleteButton()}
				<div className="email-content__time">{date}</div>
				<div className="email-content__from">{email.from}</div>
			</div>
			<div className="email-content__message">{email.message}</div>
		</div>
	);
};
export default EmailDetails;
