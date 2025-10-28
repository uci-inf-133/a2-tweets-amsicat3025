function parseTweets(runkeeper_tweets) 
{
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	//Okay well how do I do that...
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	tweet_array = tweet_array.filter((tweet) => tweet.written); 
}

//Didn't I do this in 122b...?
function addEventHandlerForSearch() 
{
	const textFilter = document.getElementById("textFilter");
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	textFilter.addEventListener("input", (text) => {
		const query = text.target.value.toLowerCase();
		console.log("User put in: " + query);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});