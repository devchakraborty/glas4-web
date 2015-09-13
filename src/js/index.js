require('../scss/index.scss')
require('file?name=favicon.ico!../favicon.ico')

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

class App extends React.Component {
	constructor() {
		super()
		this.state = {issues:{}, candidates:{}, selectedIssues:{}, selectedCandidates:{}}
	}
	componentDidMount() {
		console.log('mount')
		let issueUpdate = () => {
			this.setState({issues: IssueStore.getAll()})
		}
		IssueStore.on(StoreConstants.ISSUE_CREATE, _.debounce(issueUpdate, 50))
		let candidateUpdate = () => {
			this.setState({candidates: CandidateStore.getAll()})
		}
		CandidateStore.on(StoreConstants.CANDIDATE_CREATE, _.debounce(candidateUpdate, 50))
	}
	componentDidUpdate() {
		// this.refs.videos.setState({videos:[], num_pages:-1})
		// this.refs.videos.loadPage(0)
	}
	render() {
		console.log('APP RENDER')
		let issueElems = []
		let issues = []

		for (let id in this.state.issues) {
			issues.push(this.state.issues[id])
		}
		issues = issues.sort(function(a, b) {
			return a.issueName > b.issueName ? 1 : -1
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
			issueElems.push(<li className="checkbox issue" id={issue.id} onClick={changeFunc}>{issue.issueName}</li>)
		})

		let candidateElems = []
		let candidates = []

		for (let objectId in this.state.candidates) {
			candidates.push(this.state.candidates[objectId])
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
					old[candidate.objectId] = candidate
					app.setState({selectedCandidates:old})
				} else {
					delete old[candidate.objectId]
					app.setState({selectedCandidates:old})
				}
			}
			candidateElems.push(<li className="checkbox candidate" id={candidate.id} onClick={changeFunc}>{candidate.name}</li>)
		})

		return <div id="app"><div id="header"><h1 id="title">glas4</h1><div className="relative"><ul className="toggles">{issueElems}</ul></div><div className="relative"><ul className="toggles">{candidateElems}</ul></div></div><Videos app={this} ref="videos" /></div>
	}
}

class Videos extends React.Component {
	constructor(props) {
		super()
		this.props = props
		this.state = {loading:false, videos:[], noMore:false, page:0, num_pages:-1}
	}
	componentDidMount() {
		VideoStore.on(StoreConstants.VIDEOS_SYNC, () => {
			this.setState({videos: VideoStore.getAll(), loading:false})
		})
		this.load(0, DEFAULT_LIMIT)
	}
	render() {
		console.log('VIDEOS RENDER')
		let videoElems = []
		if (this.state.loading) {
			videoElems.push(<li className="loading">Loading...</li>)
		} else {
			for (let video of this.state.videos) {
				videoElems.push(<Video {...video} key={video.id} />)
			}
			let prev = this.prev.bind(this)
			let next = this.next.bind(this)
			videoElems.push(<li id="nav"><a href="#" onClick={prev} id="prev" className={this.state.page == 0 ? "hidden" : ""}>&lt;</a> <a href="#" onClick={next} id="next" className={this.state.page == this.state.num_pages - 1 ? "hidden" : ""}>&gt;</a></li>)
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
		this.loadPage(this.state.page + 1)
		return false
	}
	prev() {
		this.loadPage(this.state.page - 1)
		return false
	}
	loadPage(page) {
		this.load((page) * DEFAULT_LIMIT, DEFAULT_LIMIT)
		this.setState({page:page})
	}
}

class Video extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	render() {
		console.log("VIDEO RENDER")
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
			<img id={"img-"+videoID} className="video-thumb" src={require('../img/play.png')} style={{backgroundImage: "url('//i.ytimg.com/vi/"+videoID+"/hqdefault.jpg')"}} onClick={replaceImage} />
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
		console.log('TAG RENDER')
		return (
			<span className="candidate-tag {this.state.party}">{this.state.name}</span>
		)
	}
}

function init() {
	React.render(<App />, document.body)
	Promise.all([ParseFetcher.getAllCandidates(), ParseFetcher.getAllIssues()]).then(function(results) {
		let candidates = results[0], issues = results[1]
		for (let issue of issues) {
			Dispatcher.dispatch({type: StoreConstants.ISSUE_CREATE, issue:issue})
		}
		for (let candidate of candidates) {
			Dispatcher.dispatch({type: StoreConstants.CANDIDATE_CREATE, candidate:candidate})
		}

		// function updateTogglesSize() {
		// 	let width = window.innerWidth
		// 	$(".toggles").each((t, toggles) => {
		// 		let sumWidth = 0
		// 		$("li", toggles).each((l, li) => {
		// 			sumWidth += parseInt($(li).outerWidth())
		// 		})
		// 		$(toggles).css({height:(Math.ceil(sumWidth / parseInt($(toggles).width())) * 30) + "px"})
		// 	})
		// }
		// $(window).resize(_.debounce(updateTogglesSize, 50))
		// updateTogglesSize()
	})
}

window.onload = init