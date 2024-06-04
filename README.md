# Holiday Checker

Tired of typing in when the next holiday is so you can dream of when your next upcoming day off will be like? Well fear no longer fellow Canadian, I have created a website that does the check for you! All you need to do is visit the website and it'll find the next closest holiday. Unless if there is already a holiday happening today, then why are you even using this?

This is a react app that uses a single component and one API call to get data. I created this as a simple react app that was supposed to be quick but ended up taking longer as I got carried away. 

Yes it is too flashy and probably hard on the eyes, I got bored and wanted to create a monstrosity of a webpage.
Yes the goose is annoying, I made it to represent what geese are like when you walk around the streets in Canada

## Deployed on AWS
http://holiday-checker.s3-website.us-east-2.amazonaws.com/

## Future work
- check when there is no more holiday past the selected date (should be after christmas or boxing day). display error if this occurs
- make the webpage look at least somewhat usable

## Bugs
- When selecting a date that will result in displaying the same holiday that is currently displayed, it will display the next holiday instead (for example: Today is June 3rd. Starting the web page displays June 24th (Jean-Baptiste Day). Then selecting June 4th will display Canada Day, which is on July 1st.
  
API for holiday data: https://canada-holidays.ca/api/v1/holidays/
