Deploy: [link](https://izy-code.github.io/async-race/)
![image](https://github.com/izy-code/async-race/assets/126877709/34ab221c-9c1c-4323-a558-0b3497f62a98)
Task: [link](https://github.com/rolling-scopes-school/tasks/tree/master/stage2/tasks/async-race)

### Description

A SPA that manages a collection of cars, operates their engines, and showcases race statistics in an engaging, interactive way. The primary emphasis in this task is on using the fetch API to handle asynchronous server responses.

**IMPORTANT!** To run this application, you need to start the local server first, which can be found at the [following link](https://github.com/izy-code/async-race-api).

### Basic Structure

- Two main views: "Garage" and "Winners", each with their name, page number, and a count of items in the database.
- Persistent view state between switches, maintaining user input and pagination.

### Garage View

- CRUD operations for cars with "name" and "color" attributes.
- Color selection from an RGB palette with a preview of the car in the chosen color.
- Pagination to display cars (7 per page) and a feature to generate 100 random cars at once.

### Car Animation

- Start/stop engine buttons with corresponding animations and handling of engine states.
- Adaptive animations that work on screens as small as 500px.

### Race Animation

- A button to start a race for all cars on the current page.
- A reset button to return all cars to their starting positions.
- The winner's name displayed upon race completion.

### Winners View

- Shows winning cars with their image, name, number of wins, and best time.
- Pagination and sorting capabilities by wins and best times.
