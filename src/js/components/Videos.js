let React = require('react')
let _ = require('lodash')

let VideoStore = require('../stores/VideoStore')
let StoreConstants = require('../stores/StoreConstants')

let Video = require('./Video')

let ParseFetcher = require('../ParseFetcher')
let Dispatcher = require('../AppDispatcher')

const DEFAULT_LIMIT = 10

class Videos extends React.Component {
	constructor(props) {
		super()
		this.props = props
		this.state = {loading:false, videos:[], noMore:false, page:0, num_pages:0}
	}
	componentDidMount() {
		VideoStore.on(StoreConstants.VIDEOS_SYNC, () => {
			this.setState({videos: VideoStore.getAll(), loading:false})
		})
		this.loadPage(0)
	}
	render() {
		let videoElems = []
		if (this.state.loading) {
			videoElems.push(<li className="loading" key="loading">Loading...</li>)
		} else {
			for (let video of this.state.videos) {
				videoElems.push(<Video {...video} key={video.id} />)
			}
			let prev = this.prev.bind(this)
			let next = this.next.bind(this)
			videoElems.push(<li id="nav" key="nav"><a href="#" onClick={prev} id="prev" className={this.state.page == 0 ? "hidden" : ""}>&lt;</a> <a href="#" onClick={next} id="next" className={this.state.page < this.state.num_pages - 1 ? "" : "hidden"}>&gt;</a></li>)
		}
		return <div id="videos">{videoElems}</div>
	}
	load(offset, limit) {
		this.setState({loading:true})
		ParseFetcher.getVideos(_.pluck(_.values(this.props.app.state.selectedIssues), 'id'), _.pluck(_.values(this.props.app.state.selectedCandidates), 'id'), offset, limit).then((result) => {
			this.setState({num_pages: Math.ceil(result.count / DEFAULT_LIMIT)})
			Dispatcher.dispatch({type:StoreConstants.VIDEOS_SYNC, videos:result.videos})
		})
	}
	next() {
		this.loadPage(this.state.page + 1)
		return false
	}
	prev() {
		this.loadPage(this.state.page - 1)
		return false
	}
	loadPage(page) {
		this.load((page) * DEFAULT_LIMIT, DEFAULT_LIMIT)
		this.setState({page:page})
	}
}

module.exports = Videos
