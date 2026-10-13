# Student Registration Portal

A school-project demo built with HTML, CSS, JavaScript, Node.js, Express, and SQLite. It validates form entries in the browser and on the server, then saves successful registrations in a local SQLite database (`students.db`).

## Requirements
- Node.js 18 or newer
- npm (included with Node.js)

## Run locally
1. Extract the project folder.
2. Open a terminal in the `student-registration-portal` folder.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000` in your browser.

The database is created automatically the first time the server starts. Keep the terminal open while using the site. Stop the server with Ctrl+C.

## Project structure
- `public/index.html` — form structure
- `public/styles.css` — responsive design
- `public/app.js` — client-side validation and API submission
- `server.js` — Express API and server-side validation
- `students.db` — SQLite database created when the server runs

## Notes for the class demonstration
- A successful registration returns a reference number.
- The email address is unique; attempting to register the same email twice returns a clear error.
- Server-side validation is included because browser validation alone can be bypassed.
- This is a local learning demo, not a production admissions system. Before public deployment, add HTTPS, stronger abuse protection, access controls for any admin features, backups, and an appropriate privacy notice. Do not collect real student data for a classroom demo unless you have permission.
