let _videos = []

let EventEmitter = require('events').EventEmitter
let assign = require('object-assign')
let StoreConstants = require('./StoreConstants')
let Dispatcher = require('../AppDispatcher')

function create(videos, offset) {
	if (_videos.length > videos.length + offset) {
		_videos = _videos.slice(0, videos.length + offset)
	}
	for (let i = 0; i < videos.length; i++) {
		let video = videos[i]
		_videos[i + offset] = video
	}
}

let VideoStore = assign({}, EventEmitter.prototype, {
	getAll: function() {
		return _videos
	},
	dispatcherIndex: Dispatcher.register((action) => {
			console.log("ACTION", action)
		switch (action.type) {
			case StoreConstants.VIDEOS_SYNC:
				create(action.videos, action.offset)
				VideoStore.emit(StoreConstants.VIDEOS_SYNC)
				break
		}
	})
})

module.exports = VideoStore