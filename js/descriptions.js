let tweet_array = []; 

function parseTweets(runkeeper_tweets) 
{
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//Just when the document loads initially
	//document.getElementById("searchText").innerText = '';

	//TODO: Filter to just the written tweets
	//Okay well how do I do that...
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	updateTable('');
}

//Didn't I do this in 122b...?
function addEventHandlerForSearch() 
{
	const textFilter = document.getElementById("textFilter");
	document.getElementById("searchText").innerText = "";
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	textFilter.addEventListener("input", (text) => {
		query = text.target.value.toLowerCase();
		console.log("User put in: " + query);

		updateTable(query); 
	});
}

function updateTable(query)
{
	//Filter the tweets and then update the table appropriately
	document.getElementById("searchText").innerText = query;
	filtered_tweets = tweet_array.filter((tweet) => tweet.writtenText.toLowerCase().includes(query));
	let len = filtered_tweets.length; 
	document.getElementById("searchCount").innerText = filtered_tweets.length; 

	let table = document.getElementById("tweetTable");
	table.innerHTML = "";
	filtered_tweets = filtered_tweets.filter((tweet) => tweet.written);

	for(let i = 0; i < len; i++)
	{
		tweet = filtered_tweets[i]; 
		let tableHTML = tweet.getHTMLTableRow(i+1); 
		table.insertAdjacentHTML('beforeend', tableHTML);
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});