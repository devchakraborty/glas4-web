
let _issues = {}
let EventEmitter = require('events').EventEmitter
let assign = require('object-assign')
let StoreConstants = require('./StoreConstants')
let Dispatcher = require('../AppDispatcher')

function create(issue) {
	// add issue to local cache
	_issues[issue.id] = issue
}

function destroy(id) {
	delete _issues[id]
}

let IssueStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return _issues
	},
	get: function(id) {
		return _issues[id]
	},
	dispatcherIndex: Dispatcher.register((action) => {
		switch (action.type) {
			case StoreConstants.ISSUE_CREATE:
				create(action.issue)
				IssueStore.emit(StoreConstants.ISSUE_CREATE)
				break
			case StoreConstants.ISSUE_DESTROY:
				destroy(action.id)
				IssueStore.emit(StoreConstants.ISSUE_DESTROY)
				break
		}
	})
})

module.exports = IssueStore
