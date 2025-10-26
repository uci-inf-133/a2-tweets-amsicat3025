function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	updateTimes(tweet_array);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) 
{
	loadSavedRunkeeperTweets().then(parseTweets);
});

function updateTimes(tweet_array)
{
	//Sorts array based on date 

	let tweets = tweet_array; 
	tweets.sort((a,b) => a.time - b.time); 

	const format = 
	{
		month: "long",
		year: "numeric", 
		month: "long", 
		day: "numeric", 
	}; 

	let earliest = tweets[0].time.toLocaleDateString(undefined, format);
	let latest = tweets[tweet_array.length - 1].time.toLocaleDateString(undefined, format);

	document.getElementById('firstDate').innerHTML = earliest;
	document.getElementById('lastDate').innerHTML = latest;

	console.log(earliest);
	console.log(latest);
}