
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
	getAll: function() {
		return _candidates
	},
	dispatcherIndex: Dispatcher.register((action) => {
		switch (action.type) {
			case StoreConstants.CANDIDATE_CREATE:
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

module.exports = CandidateStore
