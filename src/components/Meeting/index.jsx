import React from 'react';

import './meeting.css';
import AgoraVideoCall from '../AgoraVideoCall';
import { AGORA_APP_ID } from '../../agora.config';

class Meeting extends React.Component {
	constructor(props) {
		super(props);
		this.videoProfile = '480p_4';
		this.channel = this.props.channel;
		this.transcode = 'interop';
		this.attendeeMode = 'video';
		this.baseMode = 'avc';
		this.appId = AGORA_APP_ID;
		if (!this.appId) {
			return alert('Get App ID first!');
		}
		this.uid = undefined;
	}

	render() {
		return (
			<div className="wrapper meeting">
				<div className="ag-main">
					<div className="ag-container">
						<AgoraVideoCall
							videoProfile={this.videoProfile}
							channel={this.channel}
							transcode={this.transcode}
							attendeeMode={this.attendeeMode}
							baseMode={this.baseMode}
							appId={this.appId}
							uid={this.uid}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Meeting;
