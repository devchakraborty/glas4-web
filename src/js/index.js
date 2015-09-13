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
let URL = require('url-parse')

const DEFAULT_LIMIT = 10

let PAGE = 0

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
				$("#"+issue.id).toggleClass("active");
				let checked = $('#'+issue.id).hasClass('active');
				let old = _.clone(app.state.selectedIssues)
				if (checked) {
					old[issue.id] = issue
					app.setState({selectedIssues:old})
				} else {
					delete old[issue.id]
					app.setState({selectedIssues:old})
				}
			}
			issueElems.push(<li className="checkbox" id={issue.id} onClick={changeFunc}>{issue.name}</li>)
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
				$("#"+candidate.id).toggleClass("active")
				let checked = $('#'+candidate.id).hasClass('active')
				let old = _.clone(app.state.selectedCandidates)
				if (checked) {
					old[candidate.id] = candidate
					app.setState({selectedCandidates:old})
				} else {
					delete old[candidate.id]
					app.setState({selectedCandidates:old})
				}
			}
			candidateElems.push(<li className="checkbox" id={candidate.id} onClick={changeFunc}>{candidate.name}</li>)
		})

		return <div id="app"><div id="header"><h1 id="title">glas4</h1><div className="relative"><ul className="toggles">{issueElems}</ul></div><div className="relative"><ul className="toggles">{candidateElems}</ul></div></div><Videos app={this} ref="videos" /></div>
	}
}

class Videos extends React.Component {
	constructor(props) {
		super()
		this.props = props
		this.state = {loading:false, videos:[], noMore:false}
	}
	componentDidMount() {
		VideoStore.on(StoreConstants.VIDEOS_SYNC, () => {
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
		} else {
			let prev = this.prev.bind(this)
			let next = this.next.bind(this)
			videoElems.push(<li id="nav"><a href="#" onClick={prev} id="prev">&lt;</a> <a href="#" onClick={next} id="next">&gt;</a></li>)
		}
		return <div id="videos">{videoElems}</div>
	}
	load(offset, limit) {
		this.setState({loading:true})
		ParseFetcher.getVideos(_.pluck(_.values(this.props.app.state.selectedIssues), 'id'), _.pluck(_.values(this.props.app.state.selectedCandidates), 'id'), offset, limit).then((videos) => {
			Dispatcher.dispatch({type:StoreConstants.VIDEOS_SYNC, videos:videos})
		})
	}
	next() {
		this.load((++PAGE) * DEFAULT_LIMIT, DEFAULT_LIMIT)
		console.log("PAGE", PAGE)
	}
	prev() {
		this.load((--PAGE) * DEFAULT_LIMIT, DEFAULT_LIMIT)
		console.log("PAGE", PAGE)
	}
}

class Video extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	render() {
		let url = new URL(this.props.video_url, true)
		let videoID = url.query.v
		let start = url.query.start
		let end = url.query.end

		let embedUrl = new URL('http://google.com')
		embedUrl.set('protocol', 'https:')
		embedUrl.set('hostname', 'www.youtube.com')
		embedUrl.set('pathname', '/embed/'+videoID)
		let embedQuery = {autoplay:1}
		if (start != null) {
			embedQuery.start = start
		}
		if (end != null) {
			embedQuery.end = end
		}
		embedUrl.set('query', embedQuery)

		let replaceImage = () => {
			$("#img-"+videoID).replaceWith("<iframe src='" + embedUrl + "' class='youtube'></iframe>")
		}

		return (<li className="video">
			<img id={"img-"+videoID} className="video-thumb" src={require('../img/play.png')} style={{backgroundImage: "url('//i.ytimg.com/vi/"+videoID+"/hqdefault.jpg');"}} onClick={replaceImage} />
			<CandidateTag candidateID={this.props.candidate_id} />
		</li>)
	}
}

class CandidateTag extends React.Component {
	constructor(props) {
		super()
		this.props = props
		this.state = CandidateStore.get(this.props.candidateID) || {}
	}
	componentDidMount() {
		CandidateStore.on(StoreConstants.CANDIDATE_CREATE, () => {
			this.setState(CandidateStore.get(this.props.candidateID))
		})
	}
	render() {
		return (
			<span class="candidate-tag {this.state.party}">{this.state.name}</span>
		)
	}
}

function init() {
	React.render(<App />, document.body)
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