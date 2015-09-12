Parse.initialize("iXDvlSh7XJjt7J5a0vB6kgWSljEjtIICxAWTQnrF", "twvM3T7jNdbEB2jlJUSk7iXKjb24xv0IOjpJYUtA");
let _ = require('lodash')
let ParseFetcher = {
	getAllCandidates: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			var query = new Parse.Query('Candidates');
			query.limit = 10; 

			query.find().then(function(results) { 
				let candidates = results; 
				console.log("CANDIDATES HERE", candidates)
				// resolve(candidates)
				// alert("got candidates");
				resolve(results)
			}, function(error) { 
				reject(error)
			}); 
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