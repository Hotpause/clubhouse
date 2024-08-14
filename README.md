# Members Only Clubhouse

A Node.js application where members can post anonymously. Inside the clubhouse, members can view post authors; outside, only the posts are visible.

## Features

- **User Authentication:** Sign up and log in with Passport.js and bcrypt.
- **Membership Control:** Access posts' authors only if membership is granted through a secret passcode.
- **Post Management:** Create and view posts with author details visible only to members.
- **Admin Controls:** Admin users can delete posts.

## Tech Stack

- **Node.js & Express:** Server framework
- **PostgreSQL:** Database
- **EJS:** Templating engine
- **Passport.js:** Authentication
- **Tailwind CSS:** Styling

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Hotpause/clubhouse.git
   cd clubhouse
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure PostgreSQL and update the `.env` file

4. Start the server
   ```
   node app.js
   ```
5. Open your browser and go to `http://localhost:3300` or the PORT in `.env` to access the application.

