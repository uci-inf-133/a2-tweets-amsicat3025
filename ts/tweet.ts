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

        //For completed_events
        if(tweet.startsWith("just completed") || tweet.startsWith("just posted"))
        {
            return "completed_event"; 
        }

        //For live_events
        if(tweet.startsWith("watch live") || tweet.includes("now"))
        {
            return "live_event"; 
        }

        //For achievements
        if(tweet.startsWith("achieved") || tweet.includes("record"))
        {
            return "achievement"; 
        }

        //On a side note: Go update this later so it doesn't take up as much space
        //For live_events:
        /*if(tweet.startsWith("watch") || tweet.includes("watch") || tweet.endsWith("watch"))
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
        }*/

       
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean 
    {
        //TODO: identify whether the tweet is written
        //the parsing consists basically of "Just completed blah blah" exclude everything after @ RunKeeper
        /*let activity = this.activityType; 
       
        /*var httpsIndex = this.text.indexOf("https://"); 
        var tweet = this.text.substring(0, httpsIndex); 
        var userIndex = tweet.indexOf(" - "); 

        if(userIndex != -1)
        {
            return true;
        }
        return false;*/

        let tweet = this.text;
        let httpsIndex = tweet.indexOf("https://"); //in the event there is no https for some reason...
        if(httpsIndex == -1)
        {
            return false; 
        }

        if(tweet.startsWith("Just completed") || tweet.startsWith("Just posted") || tweet.startsWith("Watch live"))
        {
            let dash = tweet.indexOf(" - ");
            if(dash == -1)
            {
                return false; 
            }
            else
            {
                if(dash + 3 == httpsIndex)
                {
                    return false;
                }
                return true; 
            }
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
            let tweet = this.text; 
            let httpsIndex = tweet.indexOf("https://");
            if(httpsIndex == -1)
            {
                return ""; 
            }
            
            if(tweet.startsWith("Just completed") || tweet.startsWith("Just posted") || tweet.startsWith("Watch live"))
            {
                let dash = tweet.indexOf(" - ");
                if(dash == -1)
                {
                    return ""; 
                }
                else
                {
                    if(dash + 3 == httpsIndex)
                    {
                        return "";
                    }
                    return tweet.substring(dash + 3, httpsIndex); 
                }
            }
            return ""; 
        }
    }

    get activityType():string 
    {
        if (this.source != "completed_event") 
        {
            return "unknown";
        }
        else
        {
            var tweet:string = this.text.toLowerCase(); //for case matching
            var indexOfRunkeeper = tweet.indexOf("runkeeper");
            tweet = tweet.substring(0, indexOfRunkeeper);
            
            if(tweet.includes("ski run"))
            {
                return "ski running";
            }

            if(tweet.includes("ski"))
            {
                return "skiing";
            }

            if(tweet.includes("run"))
            {
                return "running"; 
            }

            if(tweet.includes("moutain bike"))
            {
                return "mountain biking";
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

            if(tweet.includes("elliptical"))
            {
                return "elliptical"; 
            }

            if(tweet.includes("spinning"))
            {
                return "spinning"; 
            }

            if(tweet.includes("strong"))
            {
                return "strong"; 
            }

            if(tweet.includes("stairmaster"))
            {
                return "stairmaster"; 
            }

            if(tweet.includes("bootcamp"))
            {
                return "bootcamp"; 
            }

            if(tweet.includes("crossfit"))
            {
                return "crossfit"; 
            }

            if(tweet.includes("snowboard"))
            {
                return "snowboard"; 
            }

            if(tweet.includes("activity"))
            {
                return "activity"; 
            }

            return "unknown";
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
            //console.log(distance);
            return distance; 
        }
        
    }

    getTweetLink():string
    {
        let tweet = this.text;
        let index = tweet.indexOf("https://"); 
        let runIndex = tweet.indexOf("#Runkeeper");
        let run = "#Runkeeper";
        

        if(runIndex == -1)
        {
            return tweet.substring(index).trim();
        }
        else
        {
            if(runIndex < index)
            {
                let len = run.length; 
                return tweet.substring(runIndex + len);
            }
            return tweet.substring(index, runIndex).trim();
        }
    }

    generateTweetString():string
    {
        let tweet = this.text;
        let index = tweet.indexOf("https://");
        if(index == -1)
        {
            return "";
        }
        return tweet.substring(0, index).trim(); 
    }

    //For the hashtags...
    generateAfterURL():string
    {
        let tweet = this.text;
        let index = tweet.indexOf("https://");
        let urlPost = tweet.substring(index); 

        let urlEnd = urlPost.indexOf(" ");
        if(urlEnd == -1)
        {
            return ""; 
        }
        else
        {
            return urlPost.substring(urlEnd+1).trim();
        }
    }

    getHTMLTableRow(rowNumber:number):string 
    {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let tweetLink = this.getTweetLink(); 
        let rowHTML = ""; 

        rowHTML += "<tr>";
        rowHTML += "<th>" + rowNumber + "</th>";
        rowHTML += "<th>" + this.activityType + "</th>";
        rowHTML += "<th>" + this.generateTweetString();

        //In the event we're missing an https:// for some reason
        if(tweetLink != "")
        {
            rowHTML += ' <a href="' + tweetLink + '">' + tweetLink + '</a> ';
            rowHTML += this.generateAfterURL() + "</th>";
        }
        else
        {
            rowHTML += "</th>"
        }

        rowHTML += "</tr>"; 

        return rowHTML;
    }
}