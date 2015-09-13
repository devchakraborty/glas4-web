let _candidates = {}

let EventEmitter = require('events').EventEmitter
let assign = require('object-assign')
let StoreConstants = require('./StoreConstants')
let Dispatcher = require('../AppDispatcher')

function create(candidate) {
	// add candidate to local cache
	_candidates[candidate.id] = candidate
}

function destroy(id) {
	delete _candidates[id]
}

let CandidateStore = assign({}, EventEmitter.prototype, {
	get: function(id) {
		return _candidates[id]
	},
	getAll: function() {
		return _candidates
	},
	dispatcherIndex: Dispatcher.register((action) => {
		switch (action.type) {
			case StoreConstants.CANDIDATE_CREATE:
				action.candidate.name = action.candidate.last_name + ", " + action.candidate.first_name
				create(action.candidate)
				CandidateStore.emit(StoreConstants.CANDIDATE_CREATE)
				break
			case StoreConstants.CANDIDATE_DESTROY:
				destroy(action.id)
				CandidateStore.emit(StoreConstants.CANDIDATE_DESTROY)
				break
		}
	})
})

CandidateStore.setMaxListeners(1000)

module.exports = CandidateStore
