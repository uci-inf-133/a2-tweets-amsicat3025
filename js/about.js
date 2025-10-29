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
	obtainWritten(tweet_array);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) 
{
	loadSavedRunkeeperTweets().then(parseTweets);
});

function updateTimes(tweet_array)
{
	//Sorts array based on date 

	var tweets = tweet_array; //idk if we need this sorted later
	tweets.sort((a,b) => a.time - b.time); 

	const format = 
	{
		month: "long",
		year: "numeric", 
		month: "long", 
		day: "numeric", 
	}; 

	var earliest = tweets[0].time.toLocaleDateString(undefined, format);
	var latest = tweets[tweet_array.length - 1].time.toLocaleDateString(undefined, format);

	document.getElementById('firstDate').innerHTML = earliest;
	document.getElementById('lastDate').innerHTML = latest;

	console.log(earliest);
	console.log(latest);
}

function calculateCategoryType(tweet_array)
{
	var live_events = 0;
	var achievement = 0; 
	var completed_event = 0;
	var miscellaneous = 0; 

	var len = tweet_array.length; 

	for(let i = 0; i < len; i++)
	{
		var cur_tweet = tweet_array[i]; 
		var source = cur_tweet.source; 
		if(source == "live_event")
		{
			live_events += 1; 
		}
		else if(source == "achievement")
		{
			achievement += 1; 
		}
		else if(source == "completed_event")
		{
			completed_event += 1; 
		}
		else
		{
			miscellaneous += 1;
		}
	}

	//Important note to self: Figure out if there's a better way to deal with changing the text here
	var pctComplete = math.format(((completed_event / len)*100), { notation: "fixed", precision: 2}); 
	const completedEvents = document.getElementsByClassName('completedEvents');
	var comLen = completedEvents.length; 
	for(let i = 0; i < comLen; i++)
	{
		completedEvents[i].innerText = completed_event;
	}
	document.getElementsByClassName("completedEvents")[0].innerText = completed_event; 
	document.getElementsByClassName("completedEventsPct")[0].innerText = pctComplete + "%"; 

	var pctLive = math.format(((live_events / len) * 100), { notation: "fixed", precision: 2}); 
	document.getElementsByClassName("liveEvents")[0].innerText = live_events; 
	document.getElementsByClassName("liveEventsPct")[0].innerText = pctLive + "%";

	var pctAch = math.format(((achievement / len)*100), { notation: "fixed", precision: 2}); 
	document.getElementsByClassName("achievements")[0].innerText = achievement; 
	document.getElementsByClassName("achievementsPct")[0].innerText = pctAch + "%";

	var pctMisc = math.format(((miscellaneous / len)*100), { notation: "fixed", precision: 2}); 
	document.getElementsByClassName("miscellaneous")[0].innerText = achievement; 
	document.getElementsByClassName("miscellaneousPct")[0].innerText = pctMisc + "%";

}

function obtainWritten(tweet_array)
{
	var len = tweet_array.length;
	var numWritten = 0; 

	for(let i = 0; i < len; i++)
	{
		if(tweet_array[i].written)
		{
			numWritten += 1; 
		}
	}

	var pctWritten = math.format(((numWritten / len) * 100),  { notation: "fixed", precision: 2});
	document.getElementsByClassName("written")[0].innerText = numWritten; 
	document.getElementsByClassName("writtenPct")[0].innerText = pctWritten + "%";
}