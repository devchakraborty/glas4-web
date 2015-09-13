let React = require('react')
let URL = require('url-parse')
let $ = require('jquery')

let CandidateTag = require('./CandidateTag')

class Video extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	render() {
		let url = new URL(this.props.video_url, true)
		let videoID = url.query.v
		let start = url.query.start
		let end = url.query.end

		let embedUrl = new URL('http://google.com')
		embedUrl.set('protocol', 'https:')
		embedUrl.set('hostname', 'www.youtube.com')
		embedUrl.set('pathname', '/embed/'+videoID)
		let embedQuery = {autoplay:1}
		if (start != null) {
			embedQuery.start = start
		}
		if (end != null) {
			embedQuery.end = end
		}
		embedUrl.set('query', embedQuery)

		let replaceImage = () => {
			$("#img-"+videoID).replaceWith("<iframe src='" + embedUrl + "' class='youtube'></iframe>")
		}

		return (<li className="video">
			<img id={"img-"+videoID} className="video-thumb" src={require('../../img/play.png')} style={{backgroundImage: "url('//i.ytimg.com/vi/"+videoID+"/hqdefault.jpg')"}} onClick={replaceImage} />
			<CandidateTag candidateID={this.props.candidate_id} />
		</li>)
	}
}

module.exports = Video