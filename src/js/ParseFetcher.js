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
			var query = new Parse.Query('Issues');
			query.limit = 10; 

			query.find().then(function(results) {
				var arrIssues = [];
				var arrKeys = ["issueName", "objectId"]; 
				for (var j = results.length - 1; j >= 0; j--) {
					var issue = {}
					for (var i = 0; i < 2; i++) {
						switch(arrKeys[i]) { 
							case "issueName": 
								issue["issueName"] = results[j].get("issueName");
								break;
							case "objectId": 
								issue["id"] = results[j].id;
								break;
						}
					}
					arrIssues.push(issue);
				};
				resolve(arrIssues)
			}, function(error) { 
				reject(error)
			}); 	

		})
	},
	getVideos: (issueIDs, candidateIDs, offset, limit) => {
		// issueID: array, issue ids to filter videos by, don't filter if empty array
		// candidateIDs: array, candidate ids to filter videos by, don't filter if empty array
		// offset: int, skip the first offset # of elements
		// limit: int, only return limit # of elements
		return new Promise((resolve, reject) => {
			

			var promises = [];

			var countQuery = new Parse.Query('Videos');
			if (typeof issueIDs != "undefined" && issueIDs != null && issueIDs.length > 0) { // checks if issueIDs is populated
				
				countQuery = countQuery.containedIn("issuesID", issueIDs)
			}
			if (typeof candidateIDs != "undefined" && candidateIDs != null && candidateIDs.length > 0) { // checks if candidateIDs is populated
				
				countQuery = countQuery.containedIn("candidatesID", candidateIDs)
			}
			promises.push(countQuery.count().then(function(a) {
				
				return a
			}))

			let recordQuery = new Parse.Query('Videos')
			if (typeof issueIDs != "undefined" && issueIDs != null && issueIDs.length > 0) { // checks if issueIDs is populated
				
				recordQuery = recordQuery.containedIn("issuesID", issueIDs)
			}
			if (typeof candidateIDs != "undefined" && candidateIDs != null && candidateIDs.length > 0) { // checks if candidateIDs is populated
				
				recordQuery = recordQuery.containedIn("candidatesID", candidateIDs)
			}
			recordQuery.skip(offset)
			recordQuery.limit(limit)

			promises.push(recordQuery.find().then(function(a) {
				
				return a
			}))

			return Promise.all(promises).then((results) => {
				
				let count = results[0], records = results[1].map((record) => {
					let recordObj = {}
					let attributeMap = {
						"videoID": "videoID",
						"confidence": "score",
						"startTime": "startTime",
						"endTime": "endTime",
						"candidatesID": "candidate_id",
						"issuesID": "issue_id",
						"id": "id"
					}
					for (let key in attributeMap) {
						if (key == 'id')
							recordObj.id = record.id
						else
							recordObj[attributeMap[key]] = record.get(key)
					}
					
					return recordObj
				})
				resolve({
					count: count,
					videos: records
				})
			})

		})
	}
}

module.exports = ParseFetcher