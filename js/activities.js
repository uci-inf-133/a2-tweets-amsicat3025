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
	activities = obtainNumActivities(tweet_array);
	updateActivitiesPage(activities)

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	actFreqArray = activityFrequencyArray(activities);
	console.log(actFreqArray);

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "width": 600,
	  "height": 400, 
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": actFreqArray
	  },
	  "mark": "bar", 
	  "encoding" : {
		"x": {"field": "Activity Type"},
		"y": {"field": "frequency", "type": "quantitative", "title": "Number of Tweets"}
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

		let day = tweet.time.getDay(); 
		let isWeekday = true; 

		if(day == 0 || day == 6)
		{
			isWeekday = false;
		}

		if(!activities.has(actType))
		{
			activities.set(actType, {frequency: 1, mileage: tweet.distance, 
									 sunday: 0, monday: 0, tuesday: 0, wednesday: 0, thursday: 0, 
									 friday: 0, saturday: 0,
									 weekday: 0, weekdayMileage: 0, weekend: 0, weekendMileage: 0});
		}
		else
		{
			activities.get(actType).frequency += 1; 
			activities.get(actType).mileage += tweet.distance; 
		}

		if(day == 0)
		{
			activities.get(actType).sunday += 1;
		}
		else if(day == 1)
		{
			activities.get(actType).monday += 1;
		}
		else if(day == 2)
		{
			activities.get(actType).tuesday +=1; 
		}
		else if(day == 3)
		{
			activities.get(actType).wednesday +=1; 
		}
		else if(day == 4)
		{
			activities.get(actType).thursday +=1; 
		}
		else if(day == 5)
		{
			activities.get(actType).friday +=1; 
		}
		else
		{
			activities.get(actType).saturday +=1; 
		}
		
		if(isWeekday)
		{
			activities.get(actType).weekdayMileage += tweet.distance;
			activities.get(actType).weekday += 1; 
		}
		else
		{
			activities.get(actType).weekendMileage += tweet.distance;
			activities.get(actType).weekend += 1; 
		}
	}

	return activities; 
}

function updateActivitiesPage(activities)
{
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

	//Longest one is done more on weekends or weekdays
	let weekdayAvg = mileArray[0][1].weekdayMileage / mileArray[0][1].weekday; 
	let weekendAvg = mileArray[0][1].weekendMileage / mileArray[0][1].weekend;

	if(weekdayAvg > weekendAvg)
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

function activityFrequencyArray(activities)
{
	let actFreq = new Array(); 

	for(const [key, value] of activities)
	{
		actFreq.push({"Activity Type": key, "frequency": value.frequency});
	}

	return actFreq;
}

function sortActMileage(activities)
{
	const arr = Array.from(activities.entries());

	//descending order of mileage
	let sorted = arr.sort((a,b) => (b[1].mileage / b[1].frequency) - (a[1].mileage / a[1].frequency));
	return sorted;
}