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

			var videoQuery = new Parse.Query('Videos');
			if (typeof issueIDs != "undefined" && issueIDs != null && issueIDs.length > 0) { // checks if issueIDs is populated
				videoQuery = videoQuery.containedIn("issuesID", issueIDs).find().then(function(results) {
					console.log("resultsLength", results.length)
					var arrVideos = [];
					var arrKeys = ["videoID", "confidence", "startTime", "endTime", "objectId"];
					for (var j = results.length - 1; j >= 0; j--) { 
						var video = {}
						for (var i = 0; i < 2; i++) {
							switch(arrKeys[i]) { 
								case "videoID": 
								video["videoID"] = results[j].get("videoID");
								break;
								case "confidence": 
								video["confidence"] = results[j].get("confidence");
								break;
								case "startTime": 
								video["startTime"] = results[j].get("startTime");
								break;
								case "endTime": 
								video["endTime"] = results[j].get("endTime");
								break;
								case "objectId": 
								video["id"] = results[j].id;
								break;
							}
						}
						arrVideos.push(video);
						console.log("arrVideosLength", arrVideos.length)
						for (var i = arrVideos.length - 1; i >= 0; i--) {
							console.log("arrVideos", arrVideos[i])
						};
					};
					resolve(arrVideos)
				}, function(error) { 
					reject(error)
				}); 	
				// console.log("videoQuery", videoQuery.get("videoID"))

				// console.log("issueIDs", issueIDs)
				// console.log("videoQuery", videoQuery.get("videoID"))
			};

		})
	}
}

module.exports = ParseFetcher