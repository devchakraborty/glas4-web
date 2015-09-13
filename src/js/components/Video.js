let React = require('react')
let URL = require('url-parse')
let $ = require('jquery')

let CandidateTag = require('./CandidateTag')
let IssueTag = require('./IssueTag')

class Video extends React.Component {
	constructor() {
		super()
		this.state = {}
	}
	render() {
		let id = this.props.id
		let videoID = this.props.videoID
		let start = parseInt(this.props.startTime)
		let end = parseInt(this.props.endTime)

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
			$("#img-"+id).replaceWith("<iframe src='" + embedUrl + "' class='youtube'></iframe>")
		}

		let video = this

		return (<li className="video">
			<img id={"img-"+id} className="video-thumb" src={require('../../img/play.png')} style={{backgroundImage: "url('//i.ytimg.com/vi/"+videoID+"/hqdefault.jpg')"}} onClick={replaceImage} />
			<div className="video-tags">
				<IssueTag issueID={this.props.issue_id} video={video} />
				<CandidateTag candidateID={this.props.candidate_id} video={video} />
			</div>
		</li>)
	}
}

module.exports = Video