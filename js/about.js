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
	calculateCategoryType(tweet_array);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) 
{
	loadSavedRunkeeperTweets().then(parseTweets);
});

function updateTimes(tweet_array)
{
	//Sorts array based on date 

	let tweets = tweet_array; //idk if we need this sorted later
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

function calculateCategoryType(tweet_array)
{
	let live_events = 0;
	let achievement = 0; 
	let completed_event = 0;
	let miscellaneous = 0; 

	let len = tweet_array.length; 

	for(let i = 0; i < len; i++)
	{
		let cur_tweet = tweet_array[i]; 
		let category = cur_tweet.source; 
		if(category == "live_event")
		{
			live_events += 1; 
		}
		else if(category == "achievement")
		{
			achievement += 1; 
		}
		else if(category == "completed_event")
		{
			completed_event += 1; 
		}
		else
		{
			miscellaneous += 1;
		}
	}

	let pctComplete = math.format((completed_event / len), { notation: "fixed", precision: 2}); 
	document.getElementsByClassName("completedEvents")[0].innerText = completed_event; 
	document.getElementsByClassName("completedEventsPct")[0].innerText = pctComplete + "%"; 

	let pctLive = math.format((live_events / len), { notation: "fixed", precision: 2}); 
	document.getElementsByClassName("liveEvents")[0].innerText = live_events; 
	document.getElementsByClassName("liveEventsPct")[0].innerText = pctLive + "%";

	let pctAch = math.format((achievement / len), { notation: "fixed", precision: 2}); 
	document.getElementsByClassName("achievements")[0].innerText = achievement; 
	document.getElementsByClassName("achievementsPct")[0].innerText = pctAch + "%";

	let pctMisc = math.format((miscellaneous / len), { notation: "fixed", precision: 2}); 
	document.getElementsByClassName("miscellaneous")[0].innerText = achievement; 
	document.getElementsByClassName("miscellaneousPct")[0].innerText = pctMisc + "%";

}