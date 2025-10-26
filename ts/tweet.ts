class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string 
    {
        var tweet:string = this.text.toLowerCase(); //for case matching
        console.log(tweet);

        //For live_events:
        if(tweet.startsWith("watch") || tweet.includes("watch") || tweet.endsWith("watch"))
        {
            return "live_event"; 
        }

        if(tweet.startsWith("now") || tweet.includes("now") || tweet.endsWith("now"))
        {
            return "live_event"; 
        }
        
        if(tweet.startsWith("live") || tweet.includes("live") || tweet.endsWith("live"))
        {
            return "live_event"; 
        }

        //For achievement:
        if(tweet.startsWith("achieve") || tweet.includes("achieve") || tweet.endsWith("achieve"))
        {
            return "achievement"; 
        }

        if(tweet.startsWith("record") || tweet.includes("record") || tweet.endsWith("record"))
        {
            return "achievement"; 
        }

        if(tweet.startsWith("goal") || tweet.includes("goal") || tweet.endsWith("goal"))
        {
            return "achievement"; 
        }

        //For completed_events: 
        if(tweet.startsWith("completed") || tweet.includes("completed") || tweet.endsWith("completed"))
        {
            return "completed_event"; 
        }

        if(tweet.startsWith("posted") || tweet.includes("posted") || tweet.endsWith("posted"))
        {
            return "completed_event"; 
        }

       
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean 
    {
        //TODO: identify whether the tweet is written
        //the parsing consists basically of "Just completed blah blah" exclude everything after @ RunKeeper
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return "";
    }

    get activityType():string {
        if (this.source == 'completed_event') 
        {
            return "completed_event";
        }
        else if(this.source == 'live_event')
        {
            return "live_event";
        }
        else if(this.source == 'achievement')
        {
            return "achievement";
        }
        else
        {
            return ""; 
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}