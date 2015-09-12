require('../scss/index.scss')

import { Router, Route, IndexRoute, Link } from 'react-router'
import React from 'react'
import ParseFetcher from './ParseFetcher'
let Dispatcher = require('./AppDispatcher')
let IssueStore = require('./stores/IssueStore')
let CandidateStore = require('./stores/CandidateStore')
let StoreConstants = require('./stores/StoreConstants')

class Issues extends React.Component {
	constructor() {
		super()
		this.state = {issues:[]}
	}
	componentDidMount() {
		IssueStore.on(StoreConstants.ISSUE_CREATE, () => {
			this.setState({issues: IssueStore.getAll()})
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
			issueElems.push(<IssueLink {...issue} key={issue.id} />)
		}
		return <div id="app"><ul>{issueElems}</ul>{this.props.children}</div>
	}
}

class IssueVideo extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	render() {
		return <div class="issue-video">Issue Video</div>
	}
}

class IssueLink extends React.Component {
	constructor(props) {
		super()
		this.state = {}
		this.props = props
	}
	render() {
		return <li><Link to={"/issue/"+this.props.id}>{this.props.name}</Link></li>
	}
}

class Issue extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	componentDidMount() {
		this.setState(IssueStore.get(this.props.params.issueId))
		console.log("MOUNT ISSUE", this.state)
		IssueStore.on(StoreConstants.ISSUE_CREATE, () => {
			this.setState(IssueStore.get(this.props.params.issueId))
		})
	}
	render() {
		return <div class="issue">{this.state.name}</div>
	}
}

function init() {
	React.render((
		<Router>
			<Route path="/" component={Issues}>
				<Route path="issue/:issueId" component={Issue} />
			</Route>
		</Router>
	), document.body)
	Promise.all([ParseFetcher.getAllCandidates(), ParseFetcher.getAllIssues()]).then(function(results) {
		let candidates = results[0], issues = results[1]
		for (let issue of issues) {
			Dispatcher.dispatch({type: StoreConstants.ISSUE_CREATE, issue:issue})
		}
		for (let candidate of candidates) {
			Dispatcher.dispatch({type: StoreConstants.CANDIDATE_CREATE, candidate:candidate})
		}
	})
}

window.onload = init