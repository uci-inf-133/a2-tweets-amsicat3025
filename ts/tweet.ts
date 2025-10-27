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

        //On a side note: Go update this later so it doesn't take up as much space
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
        var httpsIndex = this.text.indexOf("https://"); 
        var tweet = this.text.substring(0, httpsIndex); 
        var userIndex = tweet.indexOf(" - "); 

        if(userIndex != -1)
        {
            return true;
        }
        return false;
    }

    get writtenText():string 
    {
        if(!this.written) 
        {
            return "";
        }
        else
        {
            var httpsIndex:number = this.text.indexOf("https://")
            var dash:number = this.text.indexOf(" - ");
            return this.text.substring(dash+1, httpsIndex);
        }
    }

    get activityType():string 
    {
        if (this.source != "completed_event") 
        {
            return "";
        }
        else
        {
            var tweet:string = this.text.toLowerCase(); //for case matching
            var indexOfRunkeeper = tweet.indexOf("runkeeper");
            tweet = tweet.substring(0, indexOfRunkeeper);

            if(tweet.includes("ski run"))
            {
                return "skiing";
            }

            if(tweet.includes("run"))
            {
                return "running"; 
            }

            if(tweet.includes("bike"))
            {
                return "biking"; 
            }

            if(tweet.includes("walk"))
            {
                return "walking";
            }

            if(tweet.includes("swim"))
            {
                return "swimming"; 
            }

            if(tweet.includes("hike"))
            {
                return "hiking";
            }

            return "workout";
        }
    }

    get distance():number 
    {
        if(this.source != "completed_event") 
        {
            //console.log("Not a completed event, do not calculate");
            return 0;
        }
        
        var startString = "Just completed a ";

        var indexStart = this.text.indexOf(startString);
        if(indexStart == -1)
        {
            //console.log("Text does not contain Just completed a ");
            startString = "Just posted a ";
            indexStart = this.text.indexOf(startString);
            //console.log("indexStart: " + indexStart);
            if(indexStart == -1)
            {
                //console.log("Text does not have any distance measured");
                return 0; 
            }
        }

        var distance:number = 0;

        var distNum:string = this.text.substring(indexStart + startString.length); 
        //console.log("distNum: " + distNum);
        
        var distUnit:string = ""; 

        if(distNum.includes("mi"))
        {
            distUnit = "mi";
        }
        else if(distNum.includes("km"))
        {
            distUnit = "km";
        }
        else
        {
            return 0; 
        }

        distNum = distNum.substring(0, distNum.indexOf(distUnit)).trim();

        if(isNaN(Number(distNum)))
        {
            return 0;
        }
        else
        {
            distance = Number(distNum);
            if(distUnit == "km")
            {
                distance = distance / 1.069;
            }
            console.log(distance);
            return distance; 
        }
        
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}