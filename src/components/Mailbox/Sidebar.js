import React from 'react';

const Sidebar = ({ emails, setSidebarSection, handleComposeClick }) => {
	var unreadCount = emails.reduce(
		function(previous, msg) {
			if (msg.read !== "true" ) {
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

	return (
		<div id="sidebar">
			<div className="sidebar__compose">
				<button className="btn compose" onClick={handleComposeClick}>
					Compose <i className="fas fa-pen-fancy"></i>
				</button>
			</div>
			<ul className="sidebar__inboxes">
				<li onClick={() => { setSidebarSection('inbox'); }}>
          <div>
					  <span className="fa fa-inbox"></span> Inbox
					  <span className="item-count">{unreadCount}</span>
          </div>
        </li>
				<li onClick={() => { setSidebarSection('sent'); }}>
          <div>
  					<span className="fa fa-paper-plane"></span> Sent
  					<span className="item-count">0</span>
          </div>
        </li>
				<li onClick={() => { setSidebarSection('drafts'); }}>
          <div>
  					<span className="fa fa-pencil-square-o"></span> Drafts
  					<span className="item-count">0</span>
					</div>
        </li>
				<li onClick={() => { setSidebarSection('deleted'); }}>
          <div>
					  <span className="fa fa-trash-o"></span> Trash
					  <span className="item-count">{deletedCount}</span>
					</div>
        </li>
			</ul>
		</div>
	);
};
export default Sidebar;
