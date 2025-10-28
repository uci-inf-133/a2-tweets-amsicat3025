function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
		
	});
	
	/*for(let i = 0; i < tweet_array.length; i++)
	{
		console.log(typeof tweet_array[i].distance, tweet_array[i].distance);
		console.log("Source: " + tweet_array[i].source + ", distance: " + tweet_array[i].distance);
	}*/
	activities = obtainNumActivities(tweet_array);
	updateActivitiesPage(activities)

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	actFreqArray = activityFrequencyArray(activities);
	//console.log(actFreqArray);

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
		"x": {"field": "Activity Type", "type": "nominal"},
		"y": {"field": "frequency", "type": "quantitative", "title": "Number of Tweets"}
	  }
	  //TODO: Add mark and encoding
	};
	

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	let distAct = mostFrequentDayMeans(activities, tweet_array);
	//console.log(distAct);

	console.log(document.querySelector('#distanceVis'));
	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "position": "relative",
	  "width": 600,
	  "height": 400,
	  "renderer": "canvas",
	  "description": "Distances by day of the week for the most-tweeted about activities.",
	  "data": {
	    "values": distAct
	  },
	  "mark": "point", 
	  "encoding" : {
		"x": {"field": "Day", "type": "nominal", "title": "time (day)", "sort": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},
		"y": {"field": "distance", "type": "quantitative", "title": "distance"},
		"color": {"field": "Activity", type: "nominal"}
	  }
	}

	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "position": "relative",
	  "width": 600,
	  "height": 400,
	  "renderer": "canvas",
	  "description": "Distances by day of the week for the most-tweeted about activities.",
	  "data": {
	    "values": distAct
	  },
	  "mark": "point", 
	  "encoding" : {
		"x": {"field": "Day", "type": "nominal", "title": "time (day)", "sort": ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},
		"y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "distance"},
		"color": {"field": "Activity", type: "nominal"}
	  }
	}

	//Note: This is here because for some reason the charts are showing up before the button is rendered
	//const aggButton = document.getElementById('aggregate'); 
	//const distanceGraph = document.getElementById('distanceVis');

	//hard-coded
	document.getElementById("longestActivityType").innerText = "biking";
	document.getElementById("shortestActivityType").innerText = "walking";
	document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";

	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	const toggle = document.getElementById("aggregate");
	const distVis = document.getElementById("distanceVis");
	const distVisAgg = document.getElementById("distanceVisAggregated"); 

	distVis.style.display = "block";
	distVisAgg.style.display = "none";

	toggle.addEventListener("click", () => {
		if(toggle.innerText == "Show means")
		{
			toggle.innerText = "Show all activities"; 
			distVis.style.display = "none"; 
			distVisAgg.style.display = "block";
		}
		else
		{
			toggle.innerText = "Show means";
			distVis.style.display = "block"; 
			distVisAgg.style.display = "none";
		}
	});

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
		if(tweet.source != "completed_event" || isNaN(tweet.distance))
		{
			//console.log("not a completed event");
			continue; 
		}

		//console.log("is a completed event");
		//console.log(tweet.distance);
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
									 weekday: 0, weekdayMileage: 0, weekend: 0, weekendMileage: 0});
		}
		else
		{
			activities.get(actType).frequency += 1; 
			activities.get(actType).mileage += tweet.distance; 
		}

		if(day == 0)
		{
			activities.get(actType).sunday += tweet.distance;
		}
		else if(day == 1)
		{
			activities.get(actType).monday += tweet.distance;
		}
		else if(day == 2)
		{
			activities.get(actType).tuesday += tweet.distance; 
		}
		else if(day == 3)
		{
			activities.get(actType).wednesday += tweet.distance; 
		}
		else if(day == 4)
		{
			activities.get(actType).thursday += tweet.distance; 
		}
		else if(day == 5)
		{
			activities.get(actType).friday += tweet.distance; 
		}
		else
		{
			activities.get(actType).saturday += tweet.distance; 
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

	const mileArray = sortActMileage(activities);

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
	var arr = Array.from(activities.entries());

	//descending order of frequency
	var sorted = arr.sort((a,b) => b[1].frequency - a[1].frequency); 

	return sorted; 
}

function activityFrequencyArray(activities)
{
	var actFreq = new Array(); 

	for(const [key, value] of activities)
	{
		actFreq.push({"Activity Type": key, "frequency": value.frequency});
	}

	return actFreq;
}

function mostFrequentDayMeans(activities, tweet_array)
{
	var arr = sortActFrequency(activities); 
	//console.log(arr);

	var mostFreq = new Array();

	for(i = 0; i < 3; i++)
	{
		mostFreq.push(arr[i][0]);
	}

	const len = tweet_array.length; 

	var distanceMeans = new Array(); 

	for(let j = 0; j < len; ++j)
	{
		var tweet = tweet_array[j];

		if(!mostFreq.includes(tweet.activityType) || tweet.source != "completed_event")
		{
			continue; 
		}

		//console.log("Text: " + tweet.text + "Distance: " + tweet.distance);

		if(tweet.distance == 0 || isNaN(tweet.distance))
		{
			continue;
		}

		var day = tweet.time.getDay(); 

		if(day == 0)
		{
			distanceMeans.push({"Day": "Sunday", "Activity": tweet.activityType, "distance": tweet.distance})
		}
		else if(day == 1)
		{
			distanceMeans.push({"Day": "Monday", "Activity": tweet.activityType, "distance": tweet.distance})
		}
		else if(day == 2)
		{
			distanceMeans.push({"Day": "Tuesday", "Activity": tweet.activityType, "distance": tweet.distance})
		}
		else if(day == 3)
		{
			distanceMeans.push({"Day": "Wednesday", "Activity": tweet.activityType, "distance": tweet.distance})
		}
		else if(day == 4)
		{
			distanceMeans.push({"Day": "Thursday", "Activity": tweet.activityType, "distance": tweet.distance})
		}
		else if(day == 5)
		{
			distanceMeans.push({"Day": "Friday", "Activity": tweet.activityType, "distance": tweet.distance})
		}
		else
		{
			distanceMeans.push({"Day": "Saturday", "Activity": tweet.activityType, "distance": tweet.distance})
		}
	}

	return distanceMeans;
}

function sortActMileage(activities)
{
	const arr = Array.from(activities.entries());

	//descending order of mileage
	var sorted = arr.sort((a,b) => (b[1].mileage / b[1].frequency) - (a[1].mileage / a[1].frequency));
	return sorted;
}