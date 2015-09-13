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
		
		let issueUpdate = () => {
			this.setState({issues: IssueStore.getAll()})
		}
		IssueStore.on(StoreConstants.ISSUE_CREATE, _.debounce(issueUpdate.bind(this), 50))
		let candidateUpdate = () => {
			this.setState({candidates: CandidateStore.getAll()})
		}
		CandidateStore.on(StoreConstants.CANDIDATE_CREATE, _.debounce(candidateUpdate.bind(this), 50))
	}
	componentDidUpdate(prevProps, prevState) {
		console.log(prevState, ">", this.state)
		let shouldReload = 
		Object.keys(this.state.selectedIssues).length != Object.keys(prevState.selectedIssues).length
		|| 
		(
			Object.keys(this.state.selectedIssues).length * Object.keys(prevState.selectedIssues).length > 0
			&&
			Object.keys(this.state.selectedIssues)[0] != Object.keys(prevState.selectedIssues)[0]
		)
		||
		Object.keys(this.state.selectedCandidates).length != Object.keys(prevState.selectedCandidates).length
		;
		if (shouldReload)
			this.refs.videos.loadPage(0)
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
				console.log("CLICK!!!")
				let checked = !$('#'+issue.id).hasClass('active')
				$(".checkbox.issue").removeClass("active")
				if (checked) {
					$('#'+issue.id).addClass('active')
					let newIssue = {}
					newIssue[issue.id] = issue
					app.setState({selectedIssues:newIssue})
				} else {
					app.setState({selectedIssues:{}})
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
				console.log(CandidateStore.get(candidate.id).last_name)
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
			candidateElems.push(<li className="checkbox candidate" id={candidate.id} onClick={changeFunc} key={candidate.id}>{candidate.name}</li>)
		})

		return <div id="app"><div id="header"><h1 id="title">glas4</h1><div className="relative"><ul className="toggles">{issueElems}</ul></div><div className="relative"><ul className="toggles">{candidateElems}</ul></div></div><Videos app={this} ref="videos" /></div>
	}
}

module.exports = App