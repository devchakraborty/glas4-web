require('../scss/index.scss')
require('file?name=favicon.ico!../favicon.ico')

let React = require('react')
let ParseFetcher = require('./ParseFetcher')
let Dispatcher = require('./AppDispatcher')
let StoreConstants = require('./stores/StoreConstants')

let App = require('./components/App')

function init() {
	React.render(<App />, document.body)
	console.log('here')
	Promise.all([ParseFetcher.getAllCandidates(), ParseFetcher.getAllIssues()]).then(function(results) {
		console.log('there')
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
