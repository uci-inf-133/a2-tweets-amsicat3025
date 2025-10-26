function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	console.log(tweet_array.length);
	obtainNumActivities(tweet_array);

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function obtainNumActivities(tweet_array)
{
	let len = tweet_array.length; 
	let activities = new Map(); //of the format { activity: frequency, mileage}

	for(let i = 0; i < len; i++)
	{
		let tweet = tweet_array[i]; 
		if(tweet.source != "completed_event")
		{
			console.log("not a completed event");
			continue; 
		}

		console.log("is a completed event");
		console.log(activities);
		let actType = tweet.activityType;

		let isWeekday = true; 
		if(tweet.time.getDay() == "Saturday" || tweet.time.getDay() == "Sunday")
		{
			isWeekday = false;
		}

		if(!activities.has(actType))
		{
			activities.set(actType, {frequency: 1, mileage: tweet.distance, weekday: 0, weekend: 0});
		}
		else
		{
			activities.get(actType).frequency += 1; 
			activities.get(actType).mileage += tweet.distance;
		}
		if(isWeekday)
		{
			activities.get(actType).weekday += 1; 
		}
		else
		{
			activities.get(actType).weekend += 1; 
		}
	}

	let size = activities.size; 

	document.getElementById("numberActivities").innerText = size; 

	const freqArray = sortActFrequency(activities);
	const firstMost = freqArray[0][0];
	const secondMost = freqArray[1][0];
	const thirdMost = freqArray[2][0];
	document.getElementById("firstMost").innerText = firstMost;
	document.getElementById("secondMost").innerText = secondMost;
	document.getElementById("thirdMost").innerText = thirdMost;

	const mileArray = sortActMileage(activities)
	const longest = mileArray[0][0];
	const shortest = mileArray[size-1][0];
	document.getElementById("longestActivityType").innerText = longest; 
	document.getElementById("shortestActivityType").innerText = shortest; 

	console.log("Longest weekday: " + longest[1].weekday);
	console.log("Longest weekend: " + longest[1].weekend);

	if(longest[1].weekday > longest[1].weekend)
	{
		document.getElementById("weekdayOrWeekendLonger").innerText = "weekdays";
	}
	else
	{
		document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";
	}

}

function sortActFrequency(activities)
{
	let arr = Array.from(activities.entries());

	//descending order of frequency
	let sorted = arr.sort((a,b) => b[1].frequency - a[1].frequency); 

	return sorted; 
}

function sortActMileage(activities)
{
	const arr = Array.from(activities.entries());

	//descending order of mileage
	let sorted = arr.sort((a,b) => b[1].mileage - a[1].mileage);
	return sorted;
}