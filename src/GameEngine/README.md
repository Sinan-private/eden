# Tech

## Starting the App
[TL:DR] By now clicking the start button or run `npm run start` will do the trick.

`npm run dev`
This will start the frontend application
`node src/server/server.js`
This will run the backend.

To simplify things I created a script in the `package.json` that will allow me to only execute `npm run start`
And to make life even easier I connected this to webstorm so that pressing the start button will do the trick :)

# What this is about
This whole app is mainly about handling resources properly. I am recreating this over and over again since I figured that I am using it in most of my games.
So this app offers a way to not only store and handle resources but also to update them in a visual way



## How to use this while developing
- Basically everything with a number can be considered a resource. This way everything has the same underlying mechanic and can reference each other
- Resources should offer flexibility to describe different states like
  - value -> Which is limited by its constraints and conveniently handled
  - cost -> The basic means to get this resource. I need to change stuff to get this. The gain and the give are both arrays to offer multiple costs as well as additional gain
  - revealedAt -> What is needed to preview this resource (before it could be hidden)
  - unlockedAt -> What is needed to be able to buy this or craft it or whatever
  - upkeepCost -> If this falls lower than the described need you loose stuff
  - increaseCondition -> You don't meet those, you can't by or craft more

Note: Under the hood all those conditions should work with the cost logic. Possibly an `upkeepCost` might 
be a bit more complex but I can approach this when needed.


# Icon sources
- https://itch.io/game-assets/free/tag-fantasy/tag-icons
- https://www.freepik.com/search?format=search&last_filter=query&last_value=game+resource+icons&query=game+resource+icons

Splitting images with
https://pinetools.com/split-image






# Known issues
- Adding a resource to the cost and then removing it before saving creates a weird issue
- Replacing an Icon currently doesn't work
- I had to turn of the warning when a resource was not found. The current handling of costs sucks
- When changing a second entry within the cost object before saving the previous changes reset



# Ideas 
