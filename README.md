# Starting the App
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



# Icon sources
- https://itch.io/game-assets/free/tag-fantasy/tag-icons
- https://www.freepik.com/search?format=search&last_filter=query&last_value=game+resource+icons&query=game+resource+icons

Splitting images with
https://pinetools.com/split-image






# Todos
- The Admin part is tangled with the game logic. This should not be the case.
  - I want to be able to copy my game into a new project without any dependencies to solve