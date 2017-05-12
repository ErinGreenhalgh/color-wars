# COLOR WARS

Place your color and watch 'em race! Color wars is a game that requires a little luck, and a little strategy. Each level will render a new game board. Place your color (orange) somewhere within the board. As soon as you do, your color and the computer colors (blue, pink) will race to fill up the board. Win the level by placing your color so that it beats the other colors and fills the largest portion of the board. 

[Play The Game!](https://lucyfox4131.github.io/color-wars/)

![Color Wars](http://i.imgur.com/3aqwkLn.png?1)

## Technologies 
* JavaScript
* HTML5 Canvas
* Webpack

## Project Goals and Learning Objectives
* Create a game using entirely client-side JavaScript
* Separate view logic from game logic
* Implement object-oriented JavaScript
 
## Game Design and Challenges
This app was inspired by a mobile app called [Lines](http://gamious.com/press/sheet.php?p=Lines) with a similar premise. As this was our first application written entirely in JavaScript, we had multiple challenges of working with a language that we new to us as well as determining what features would make an MVP for this game. 

### False Starts and Design Options
We considered multiple routes for designing this game:

**What if we drew a pattern of lines in a vector-drawing program, then imported the image into our application? We could create a gameboard by determining whether a given pixel belonged to the pattern or the background by pixel color.**
* This approach turned out to be unweildy. The pattern we drew was grey, which was clearly distinct from the white background to the human eye, but on a pixel level, the RGB values were too close together to indicate with confidence what pixel belonged to the board and which belonged to the pattern. 

**What if we created the gameboard pattern like a stencil over the canvas, so that the board was a negative outline of the pattern? Then we could fill in color behing it as expanding squares or circles, including some logic that would stop the expansion once the shapes touched?**
* We implemented a simple version of this idea, with the board being a simple elongated rectangle and two differently-colored squares filling behind it. This worked ok, but we found that when we expanded the board pattern to something more complex, the "physics" of the shapes filling behind the patten wasn't right — depending on the pattern, the shape behind it would fill more than one area at once, or fill areas at different rates. 

### Final Design
* Our final design implements the game board as an abstraction of the canvas on a pixel level. Essentially we drew consecutive grey rectangles that formed patterns of intersecting verticle and horizontals lines. 
* The pattens fills using a double-linked list structure: every block in the pattern knows about its direct neighbors, and when the user places a color on the board, color expands out from that point by recursively asking each block for the color if its consecutive neighboors. If the neighbor is grey, it fills in with the user's color (or the randomly places computer color.) If the next block is any other color, filling stops. 

### Design Challenges 
* In this linked-list structure, we ran into a problem with intersections between segments. Essentially, intersections were two blocks rendered on top of each other but unaware of each other, so the segments would simply fill over or under each other in different colors.
* We thought about implementing a quadruple-linked list structure to handle these intersections, so that every block could potentially have 4 neighbors, north, south, east, and west, but this demanded too much change from our application in too little time. 
* We decided to employ some logic so that checked for blocks with repeating coordinates, meaning they were placed in the exact same spot. If this was the case, we would fil the duplicat block with the color of the other block in the same location.

* Note: there are still some bugs in this functionally that pop up in certain rare board layouts. This may be due to race conditions where colors reach an intersection at the exact same time. More work needs to be done to determine when these bugs occur in order to set up a robust test and tweak our color-filling logic. 


## Running Locally:

1. Clone this project and `cd color-wars`
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Fire up the dev server: `npm start`

Once the server is running, you can visit:

* `http://localhost:8080/webpack-dev-server/` to run your application.
* `http://localhost:8080/webpack-dev-server/test.html` to run your test suite in the browser.

To run tests in Node:

```js
npm test
```
