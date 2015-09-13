Parse.initialize("iXDvlSh7XJjt7J5a0vB6kgWSljEjtIICxAWTQnrF", "twvM3T7jNdbEB2jlJUSk7iXKjb24xv0IOjpJYUtA");
let _ = require('lodash')
let ParseFetcher = {
	getAllCandidates: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			var query = new Parse.Query('Candidates');
			query.limit = 10; 

			query.find().then(function(results) {
				var arrCandidates = [];
				var arrKeys = ["first_name", "last_name", "party", "objectId"]; 
				for (var j = results.length - 1; j >= 0; j--) {
					var candidate = {}
					for (var i = 0; i < 4; i++) {
						switch(arrKeys[i]) { 
							case "first_name": 
								candidate["first_name"] = results[j].get("first_name");
								break;
							case "last_name": 
								candidate["last_name"] = results[j].get("last_name");
								break;
							case "party": 
								candidate["party"] = results[j].get("party");
								break;
							case "objectId": 
								candidate["id"] = results[j].id;
								break;
						}
					}
					arrCandidates.push(candidate);
				};	
				resolve(arrCandidates)
			}, function(error) { 
				reject(error)
			});
		})
	},
	getAllIssues: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			var query = new Parse.Query('')

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
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				let videos = [{"id": "e", "issue_id":"c", "candidate_id":"a", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "f", "issue_id":"c", "candidate_id":"b", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "g", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "h", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "i", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "j", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "k", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "l", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "m", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "n", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "o", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}, {"id": "p", "issue_id":"a", "candidate_id":"c", "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}]
				let retVideos = _.filter(videos, (video) => {
					if (issueIDs.length > 0) {
						let foundIssue = false
						for (let issueID of issueIDs) {
							if (video.issue_id == issueID) {
								foundIssue = true
								break
							}
						}
						if (!foundIssue)
							return false
					}
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
				let result = retVideos.slice(offset, offset + limit)
				resolve(result)
			}, 200)
		})
	}
}

module.exports = ParseFetcher