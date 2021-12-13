# Kinetic
## Live Site URL: https://kinetic-da.herokuapp.com/

## About
Endurance athletes require an individualized and evidence-based approach to training for endurance events and often must go to multiple event organizer pages to sign up for events. Kinetic organizes these events into a centralized location, showing events, a user event calendar and how many days until the next race day. Kinetic provides tools for the athlete to improve their training based on VO2 max, individual sodium and fluid needs and food intake. Kinetic is targeted at both athletes and event organizers. Event organizers can create their own profile and create multiple events.## Tech Stack

**Client:** React, HTML, CSS
- https://github.com/DArmstrong87/kinetic

**Server:** Python, Django
- https://github.com/DArmstrong87/kinetic-server
## Features

### Registering, Log In, Log Out
1. Register either an athlete or event organizer user.
2. Login with your credentials.
3. Logout on button click in the header.

### Events List
- Events are listed in order of closest upcoming date for both user types.
- Users can filter these events by distance, state and month.
- Users can search by event name, description, city and state.

### Event Details
- Users can click on event details to view a description, distance and elevation breakdown by sport and course url.
- Athletes can view how many spots are remaining.

### Event Sign Up
- Athletes can sign up for and leave events.
- When the participant limit is met, the sign up option becomes unavailable.

### Event Calendar
- Athletes can view their upcoming races in the event calendar.
- The closest upcoming race displays at the top with.
- Displays how many days until race day.

### Event Create, Edit, Delete
- Organizers can create, edit and delete events.

### Profile
- Athletes can view their profile.
- The athlete profile includes stats such as VO2max, fluid and sodium loss, resting heart rate and heart rate max.
- The user can view their standard HR zones based or based on heart rate reserve.

### VO2max Testing
- Athletes can take VO2 max tests.
- When athletes get their results, they can save the value to their profile.
- The athlete can view and FAQ and standards on VO2max.
## Run Locally

Clone the project

```bash
  git clone https://github.com/DArmstrong87/kinetic
```

Go to the project directory

```bash
  cd kinetic
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```