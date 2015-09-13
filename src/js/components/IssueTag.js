let React = require('react')

let IssueStore = require('../stores/IssueStore')
let StoreConstants = require('../stores/StoreConstants')

class IssueTag extends React.Component {
	constructor(props) {
		super()
		this.props = props
		this.state = IssueStore.get(this.props.issueID) || {}
	}
	componentDidMount() {
		IssueStore.on(StoreConstants.ISSUE_CREATE, () => {
			this.setState(IssueStore.get(this.props.issueID))
		})
	}
	render() {
		if (this.state.issueName) {
			
			let level = "orange"
			if (this.props.video.props.score >= 0.6) {
				level = "yellow"
			}
			if (this.props.video.props.score >= 0.8) {
				level = "green"
			}
			return (
				<span className={"issue-tag "+level}>{this.state.issueName}</span>
			)
		}
		else
			return <span></span>
	}
}

module.exports = IssueTag