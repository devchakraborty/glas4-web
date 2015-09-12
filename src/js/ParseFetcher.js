Parse.initialize("iXDvlSh7XJjt7J5a0vB6kgWSljEjtIICxAWTQnrF", "twvM3T7jNdbEB2jlJUSk7iXKjb24xv0IOjpJYUtA");
let _ = require('lodash')
let ParseFetcher = {
	getAllCandidates: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			var query = new Parse.Query('Candidates');
			query.limit = 10; 

			query.find().then(function(results) { 
				resolve(results.map((result) => {
					return {
						id: result.get('id'),
						first_name: result.get('first_name'),
						last_name: result.get('last_name')
					}
				}))
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
				let videos = [{"id": "e", "issue_id":"c", "candidate_id":"a", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "f", "issue_id":"c", "candidate_id":"b", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "g", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "h", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "i", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "j", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "k", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "l", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "m", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "n", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "o", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "p", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}]
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
				resolve(retVideos.slice(offset, limit))
			}, 200)
		})
	}
}

module.exports = ParseFetcher