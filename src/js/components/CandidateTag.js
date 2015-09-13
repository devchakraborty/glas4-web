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
		if (this.state.first_name) {
			let party = this.state.party.toLowerCase()
			return (
				<span className={"candidate-tag "+party}>{this.state.first_name+" "+this.state.last_name}</span>
			)
		}
		else
			return <span></span>
	}
}

module.exports = CandidateTag