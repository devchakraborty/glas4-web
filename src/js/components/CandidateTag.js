let React = require('react')

let CandidateStore = require('../stores/CandidateStore')
let StoreConstants = require('../stores/StoreConstants')

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

module.exports = CandidateTag