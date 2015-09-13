let _videos = []

let EventEmitter = require('events').EventEmitter
let assign = require('object-assign')
let StoreConstants = require('./StoreConstants')
let Dispatcher = require('../AppDispatcher')

function create(videos) {
	if (videos.length > 0)
		_videos = videos
}

let VideoStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return _videos
	},
	dispatcherIndex: Dispatcher.register((action) => {
		switch (action.type) {
			case StoreConstants.VIDEOS_SYNC:
				create(action.videos)
				VideoStore.emit(StoreConstants.VIDEOS_SYNC)
				break
		}
	})
})

module.exports = VideoStore