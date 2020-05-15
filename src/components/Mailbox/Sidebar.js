import React from 'react';

const Sidebar = ({ emails, setSidebarSection, handleComposeClick, selectedSection }) => {
	var unreadCount = emails.reduce(
		function(previous, msg) {
			if (msg.read === false ) {
				return previous + 1;
			}
			else {
				return previous;
			}
		}, 0);

	var deletedCount = emails.reduce(
		function(previous, msg) {
			if (msg.tag === "deleted") {
				return previous + 1;
			}
			else {
				return previous;
			}
		}, 0);

	const isSelected = (sectionName) => selectedSection === sectionName ? 'selected' : 'test'

	return (
		<div id="sidebar">
			<div className="sidebar__compose">
				<button className="btn compose" onClick={handleComposeClick}>
					Compose <i className="fas fa-pen-fancy"></i>
				</button>
			</div>
			<ul className="sidebar__inboxes">
				<li onClick={() => { setSidebarSection('inbox'); }}>
          <div className={isSelected('inbox')}>
					  <span className="fa fa-inbox"></span> Inbox
					  <span className="item-count">{unreadCount}</span>
          </div>
        </li>
				<li onClick={() => { setSidebarSection('sent'); }}>
          <div className={isSelected('sent')}>
  					<span className="fa fa-paper-plane"></span> Sent
          </div>
        </li>
				<li onClick={() => { setSidebarSection('drafts'); }}>
          <div className={isSelected('drafts')}>
  					<span className="fa fa-pencil-ruler"></span> Drafts
  					<span className="item-count">0</span>
					</div>
        </li>
				<li onClick={() => { setSidebarSection('deleted'); }}>
          <div className={isSelected('deleted')}>
					  <span className="fa fa-trash"></span> Trash
					  <span className="item-count">{deletedCount}</span>
					</div>
        </li>
			</ul>
		</div>
	);
};
export default Sidebar;
