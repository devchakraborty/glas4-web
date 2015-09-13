let React = require('react')
let $ = require('jquery')
class Tutorial extends React.Component {
	constructor() {
		super()
	}

	render() {

		let dismissTutorial = function(e) {
			localStorage.tutorialSeen = "yes"
			$("#tutorial").fadeOut(200)
			e.preventDefault()
		}

		let hidden = localStorage.tutorialSeen == "yes"

		return (
			<div id="tutorial" className={hidden ? "hidden" : ""}>
				<div id="tutorial-wrapper">
					<h1>Get the answers <b>you</b> want.</h1>
					<p>Now, you can get your favourite presidential candidates to go head-to-head on the issues <b>you</b> care about.</p>
					<p><b>Select a national issue to get started.</b> Or, select the candidates you're most interested in hearing from. Or, do both!</p>
					<p id="tutorial-dismiss"><a href="#" onClick={dismissTutorial}>Okay</a></p>
				</div>
			</div>
		)
	}
}

module.exports = Tutorial