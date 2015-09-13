let React = require('react')
let $ = require('jquery')

let StoreConstants = require('../stores/StoreConstants')
let IssueStore = require('../stores/IssueStore')
let CandidateStore = require('../stores/CandidateStore')

let Videos = require('./Videos')

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
	render() {
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
			issueElems.push(<li className="checkbox issue" id={issue.id} onClick={changeFunc} key={issue.id}>{issue.issueName}</li>)
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
			candidateElems.push(<li className="checkbox candidate" id={candidate.id} onClick={changeFunc} key={candidate.id}>{candidate.name}</li>)
		})

		return <div id="app"><div id="header"><h1 id="title">glas4</h1><div className="relative"><ul className="toggles">{issueElems}</ul></div><div className="relative"><ul className="toggles">{candidateElems}</ul></div></div><Videos app={this} ref="videos" /></div>
	}
}

module.exports = App