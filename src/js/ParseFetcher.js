let _ = require('lodash')
let ParseFetcher = {
	getAllCandidates: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let candidates = [{id:"a", "first_name": "Donald", "last_name": "Trump"}, {"id":"b", "first_name": "Hillary", "last_name": "Clinton"}]
				resolve(candidates)
			}, 200)
		})
	},
	getAllIssues: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let issues = [{id:"c", "name": "Climate Change"}, {"id":"d", "name": "Economy"}]
				resolve(issues)
			}, 200)
		})
	},
	getVideos: (issueIDs, candidateIDs, offset, limit) => {
		// issueID: array, issue ids to filter videos by, don't filter if empty array
		// candidateIDs: array, candidate ids to filter videos by, don't filter if empty array
		// offset: int, skip the first offset # of elements
		// limit: int, only return limit # of elements
		console.log("GET VIDEOS", issueIDs, candidateIDs)
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let videos = [{"id": "e", "issue_id":"c", "candidate_id":"a"}, {"id": "f", "issue_id":"c", "candidate_id":"b"}, {"id": "g", "issue_id":"a", "candidate_id":"c"}]
				let retVideos = _.filter(videos, (video) => {
					console.log('filter')
					if (issueIDs.length > 0) {
						let foundIssue = false
						for (let issueID of issueIDs) {
							if (video.issue_id == issueID) {
								foundIssue = true
								break
							}
						}
						console.log("FOUND ISSUE", foundIssue, video.issue_id)
						if (!foundIssue)
							return false
					}
					console.log('here', issueIDs.length)
					if (candidateIDs.length > 0) {
						let foundCandidate = false
						for (let candidateID of candidateIDs) {
							if (video.candidate_id == candidateID) {
								foundCandidate = true
								break
							}
						}
						if (!foundCandidate)
							return false
					}
					return true
				})
				console.log("VIDEOS", retVideos)
				resolve(retVideos)
			}, 200)
		})
	}
}

module.exports = ParseFetcher