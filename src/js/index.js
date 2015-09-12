require('../scss/index.scss')

import React from 'react'
import ParseFetcher from './ParseFetcher'
let _ = require('lodash')
let $ = require('jquery')
let Dispatcher = require('./AppDispatcher')
let IssueStore = require('./stores/IssueStore')
let CandidateStore = require('./stores/CandidateStore')
let VideoStore = require('./stores/VideoStore')
let StoreConstants = require('./stores/StoreConstants')

const DEFAULT_LIMIT = 10

class App extends React.Component {
	constructor() {
		super()
		this.state = {issues:{}, candidates:{}, selectedIssues:{}, selectedCandidates:{}}
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
	componentDidUpdate() {
		this.refs.videos.setState({videos:[]})
		this.refs.videos.load(0, DEFAULT_LIMIT)
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
		
		issues.forEach((issue) => {
			let app = this
			let changeFunc = () => {
				let checked = $('#'+issue.id).is(':checked')
				console.log(checked)
				let old = _.clone(app.state.selectedIssues)
				if (checked) {
					old[issue.id] = issue
					app.setState({selectedIssues:old})
				} else {
					delete old[issue.id]
					app.setState({selectedIssues:old})
				}
			}
			issueElems.push(<li className="checkbox"><input type="checkbox" onChange={changeFunc} id={issue.id} /> {issue.name}</li>)
		})

		let candidateElems = []
		let candidates = []

		for (let id in this.state.candidates) {
			candidates.push(this.state.candidates[id])
		}

		candidates = candidates.sort(function(a, b) {
			return a.last_name > b.last_name ? 1 : -1
		})

		candidates.forEach((candidate) => {
			let app = this
			let changeFunc = () => {
				let checked = $('#'+candidate.id).is(':checked')
				let old = _.clone(app.state.selectedCandidates)
				if (checked) {
					old[candidate.id] = candidate
					app.setState({selectedCandidates:old})
				} else {
					delete old[candidate.id]
					app.setState({selectedCandidates:old})
				}
			}
			candidateElems.push(<li className="checkbox"><input type="checkbox" onChange={changeFunc} id={candidate.id} /> <label for={candidate.id}>{candidate.name}</label></li>)
		})

		return <div id="app-wrapper"><div id="header"><h1 id="title">glas4</h1><ul>{issueElems}</ul><ul>{candidateElems}</ul></div><Videos app={this} ref="videos" /></div>
	}
}

class Videos extends React.Component {
	constructor(props) {
		super()
		this.props = props
		this.state = {loading:false, videos:[]}
	}
	componentDidMount() {
		VideoStore.on(StoreConstants.VIDEOS_SYNC, () => {
			console.log("VIDEOS JUST SYNCED", VideoStore.getAll())
			this.setState({videos: VideoStore.getAll(), loading:false})
		})
		this.load(0, DEFAULT_LIMIT)
	}
	render() {
		let videoElems = []
		for (let video of this.state.videos) {
			videoElems.push(<Video {...video} key={video.id} />)
		}
		if (this.state.loading) {
			videoElems.push(<li class="loading">Loading...</li>)
		}
		return <div id="videos">{videoElems}</div>
	}
	load(offset, limit) {
		this.setState({loading:true})
		console.log("ISSUES", this.props.app.state.issues)
		ParseFetcher.getVideos(_.pluck(_.values(this.props.app.state.selectedIssues), 'id'), _.pluck(_.values(this.props.app.state.selectedCandidates), 'id'), offset, limit).then((videos) => {
			Dispatcher.dispatch({type:StoreConstants.VIDEOS_SYNC, videos:videos, offset:offset})
		})
	}
}

class Video extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	render() {
		return <li class="issue-video">Issue Video</li>
	}
}

function init() {
	React.render(<App />, $("#app").get(0))
	Promise.all([ParseFetcher.getAllCandidates(), ParseFetcher.getAllIssues()]).then(function(results) {
		let candidates = results[0], issues = results[1], videos = results[2]
		for (let issue of issues) {
			Dispatcher.dispatch({type: StoreConstants.ISSUE_CREATE, issue:issue})
		}
		for (let candidate of candidates) {
			Dispatcher.dispatch({type: StoreConstants.CANDIDATE_CREATE, candidate:candidate})
		}
	})
}

window.onload = init