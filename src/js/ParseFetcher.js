Parse.initialize("iXDvlSh7XJjt7J5a0vB6kgWSljEjtIICxAWTQnrF", "twvM3T7jNdbEB2jlJUSk7iXKjb24xv0IOjpJYUtA");
alert("hello");

var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({foo: "bar"}).then(function(object) {
  alert("yay! it worked");
});

let ParseFetcher = {
	getAllCandidates: () => {
		// Get candidates from Parse
		return new Promise((resolve, reject) => {
			var query = new Parse.Query('Candidates');
			query.limit = 10; 

			query.find().then(function(results) { 
				let candidates = query; 
				// resolve(candidates)
				alert("got candidates");
				resolve(results)
			}, function(error) { 
				alert("didn't get candidates");
			}); 
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
	getVideos: (issueIDs, candidateIDs, offset, limit) => {
		// issueID: array, issue ids to filter videos by, don't filter if empty array
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