require('../scss/index.scss')

import React from 'react'
import ParseFetcher from './ParseFetcher'
let Dispatcher = require('./AppDispatcher')
let IssueStore = require('./stores/IssueStore')
let CandidateStore = require('./stores/CandidateStore')
let VideoStore = require('./stores/VideoStore')
let StoreConstants = require('./stores/StoreConstants')

class App extends React.Component {
	constructor() {
		super()
		this.state = {issues:[], candidates:[]}
	}
	componentDidMount() {
		IssueStore.on(StoreConstants.ISSUE_CREATE, () => {
			this.setState({issues: IssueStore.getAll()})
		})
		CandidateStore.on(StoreConstants.CANDIDATE_CREATE, () => {
			this.setState({candidates: CandidateStore.getAll()})
			console.log("CANDIDATES UPDATE", this.state.candidates)
		})
	}
	render() {
		let issueElems = []
		let issues = []

		for (let id in this.state.issues) {
			issues.push(this.state.issues[id])
		}
		issues = issues.sort(function(a, b) {
			return a.name > b.name ? 1 : -1
		})
		for (let issue of issues) {
			issueElems.push(<Issue {...issue} key={issue.id} />)
		}

		let candidateElems = []
		let candidates = []

		for (let id in this.state.candidates) {
			candidates.push(this.state.candidates[id])
		}

		candidates = candidates.sort(function(a, b) {
			return a.last_name > b.last_name ? 1 : -1
		})

		for (let candidate of candidates) {
			candidateElems.push(<Candidate {...candidate} key={candidate.id} />)
		}

		return <div id="app"><ul>{issueElems}</ul><ul>{candidateElems}</ul><Videos /></div>
	}
}

class Checkbox extends React.Component {
	constructor(props) {
		super()
		this.state = {checked:false}
		this.props = props
	}
	render() {
		return <li class="checkbox"><input type="checkbox" id={this.props.id} onchange={this._change.bind(this)} /> {this.props.name}</li>
	}
	_change() {
		this.setState({checked:!this.state.checked})
	}
}

class Issue extends Checkbox {
	constructor(props) {
		super()
	}
}

class Candidate extends Checkbox {
	constructor(props) {
		super()
	}
}

class Videos extends React.Component {
	constructor() {
		super()
		this.state = {loading:true, videos:[]}
	}
	componentDidMount() {
		VideoStore.on(StoreConstants.VIDEOS_SYNC, () => {
			this.setState({videos: VideoStore.getAll(), loading:false})
		})
	}
	render() {
		if (this.state.loading) {
			return <div id="videos">Loading...</div>
		}
		let videoElems = []
		for (let video of this.state.videos) {
			videoElems.push(<Video {...video} />)
		}
		return <div class="video">{videoElems}</div>
	}
}

class Video extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	render() {
		return <div class="issue-video">Issue Video</div>
	}
}

function init() {
	React.render(<App />, document.body)
	Promise.all([ParseFetcher.getAllCandidates(), ParseFetcher.getAllIssues(), ParseFetcher.getVideos([], [], 0, 10)]).then(function(results) {
		let candidates = results[0], issues = results[1], videos = results[2]
		for (let issue of issues) {
			Dispatcher.dispatch({type: StoreConstants.ISSUE_CREATE, issue:issue})
		}
		for (let candidate of candidates) {
			Dispatcher.dispatch({type: StoreConstants.CANDIDATE_CREATE, candidate:candidate})
		}
		Dispatcher.dispatch({type: StoreConstants.VIDEOS_SYNC, videos:videos, offset:0})
	})
}

window.onload = init