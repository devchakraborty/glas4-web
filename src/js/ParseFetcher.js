let candidateStore = require('./stores/CandidateStore')
let issueStore = require('./stores/IssueStore')

let ParseFetcher = {
	getAllCandidates: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let candidates = [{id:"a", "first_name": "Donald", "last_name": "Trump"}, {"id":"b", "first_name": "Hillary", "last_name": "Clinton"}]
				resolve(candidates)
			}, 2000)
		})
	},
	getAllIssues: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let issues = [{id:"c", "name": "Climate Change"}, {"id":"d", "name": "Economy"}]
				resolve(issues)
			}, 2000)
		})
	},
	getVideos: (issueID, candidateIDs, offset, limit) => {
		// issueID: string, issue id to filter videos by
		// candidateIDs: array, candidate ids to filter videos by, don't filter if empty array
		// offset: int, skip the first offset # of elements
		// limit: int, only return limit # of elements
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let videos = [{"id": "e", "issue_id":"c", "candidate_id":"a"}]
				resolve(videos)
			}, 2000)
		})
	}
}

module.exports = ParseFetcher