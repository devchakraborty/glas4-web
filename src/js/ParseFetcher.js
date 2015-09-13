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
					console.log("inside for loop")
					for (var i = 0; i < 4; i++) {
						var candidate = {}; 
						switch(arrKeys[i]) { 
							case "first_name": 
								candidate["first_name"] = results[j].get("first_name");
								console.log("inside switch: first_name", results[j].get("first_name"))
								break;
							case "last_name": 
								candidate["last_name"] = results[j].get("last_name");
								console.log("inside switch: last_name", results[j].get("last_name"))
								break;
							case "party": 
								candidate["party"] = results[j].get("party");
								console.log("inside switch: party", results[j].get("party"))
								break;
							case "objectId": 
								candidate["id"] = results[j].id;
								console.log("inside switch: id", results[j].id)
								break;
						}
					}
					console.log("CANDIDATE MAP", candidate);
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