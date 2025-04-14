# Playwright E2E Testing Framework

This project is an **End-to-End (E2E)** testing framework built using **TypeScript** and **Playwright**.
The project is divided into two parts – API and UI, with their respective logic and tests located in separate directories at the root of the project (/api, /ui).
Shared logic, project configuration files, and reports (both local and Docker-based) are also located at the root level.

## Project Overview

### Test Scenarios:

## UI tests

1. **Authentication Test (Login)**: Verifies that the login functionality works correctly. It checks if valid credentials redirect the user to the dashboard.
2. **Crash Game Test**: Simulates a bet on the Crash game, waits for the game result, and validates the expected outcome.
3. **Wallet Functionality Test**: Verifies a specific function of the wallet to ensure it behaves as expected.

## API tests (Jira CRUD)

### 🧪 Tests Implemented:

- **Create Issue** – Verifies successful creation of a Jira issue via API.
- **Read Issue** – Checks retrieval of an issue by its ID.
- **Update Issue** – Validates updating an existing issue.
- **Delete Issue** – Confirms deletion of an issue and ensures it's no longer accessible.

### 🛠️ Technologies Used:

- **TypeScript** – For writing type-safe test logic.
- **Playwright Test** – As the test runner and test framework.
- **Axios** – For making HTTP requests to the Jira REST API.

## Features

- Playwright E2E tests in TypeScript.
- Page Object Pattern for organizing page interactions.
- Automated code linting and formatting with ESLint and Prettier.
- Husky pre-commit hooks for automatic linting and formatting checks.

## Installation

Clone this repository and install the dependencies:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

To run the tests locally, you need to have **Node.js** and **npm** installed. 2. **Setup environment variables**:
Add test credentials and test url to .env file on the route directory of the project
You should add the next variables:
TEST_USERNAME=
TEST_PASSWORD=
BASE_URL=
JIRA_URL=
JIRA_PROJECT_KEY=
JIRA_TOKEN=
For CI run these variables are saved in github secrets

3. **Run Tests Locally**:
   Once dependencies are installed, you can run the tests locally using the following command:
   ```bash
   npm run test
   ```
   This will execute the tests in a **real browser**.

---

## Running Tests in Docker (Headless)

To run the tests in a Docker container, use the following scripts.

### Steps to Build and Run Tests in Docker:

1. **Build Docker Image and Run Tests**:

   ```bash
   npm run docker:test
   ```

   This will build the Docker image and run the tests inside a **headless browser** within the container. After tests run it will copy playwright reports from docker container to the directory /docker-reports in the root of the project

2. **Force Rebuild Docker Image**:
   If you want to force a fresh build without cache, use:
   ```bash
   npm run docker:test:clean
   ```

### Docker Command Explanation:

- `docker run --rm`: Runs the container and removes it after the tests complete.
- `-e CI=true`: Sets the environment variable `CI=true` inside the container, indicating the environment is CI-like (automatically runs tests in headless mode).

# CI for Playwright Tests

## Overview

Automated test execution can be done using **GitHub Actions**. The tests are run in a Docker container, ensuring isolation and consistency of the environment for each run.

### Process

1. **Running Tests:**

   - Each time code is pushed to the `main` or `develop` branches, or a pull request is created, the CI workflow triggers and runs the tests using GitHub Actions.
   - Tests are executed inside a Docker container with the image `mcr.microsoft.com/playwright:v1.42.1-jammy`.
   - Secrets such as usernames, passwords, tokens are passed through environment variables for security.

2. **Reports:**
   - The test results are stored in the `docker-reports` folder.
   - The report is uploaded as an artifact, allowing you to view the results after the test run.
   - The reports are generated in HTML format using the default Playwright reporter and saved in the `playwright-report` folder.
