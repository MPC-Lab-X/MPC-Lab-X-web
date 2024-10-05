# MPC-Lab-X-web

MPC-Lab-X-web is the frontend component of the MPC-Lab-X project, built using Express. It provides a user interface for generating and solving questions in mathematics, physics, and chemistry. This application is designed to interact with the backend services and deliver solutions through a straightforward web interface.

## Features

- User-friendly interface for generating and solving questions.
- Supports multiple subjects, including mathematics, physics, and chemistry.
- Provides detailed solutions and explanations for each question.
- Uses Express.js for server-side rendering and API handling.
- Supports user authentication and session management.

## Prerequisites

- Node.js

## Installation

1. Clone the repository:

```bash
git clone https://github.com/MPC-Lab-X/MPC-Lab-X-web.git
```

2. Install the dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=3000 # Port number for the server (default: 3000)
HOST=localhost # Host address for the server (default: localhost)
DESMOS_API_KEY=dcb31709b452b1cf9dc26972add0fda6 # API key for Desmos API (required for graphing)
```

4. Start the server:

```bash
npm start
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
