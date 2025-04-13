## Global Setup

### Overview

The **global setup** is executed only once before all tests to avoid redundant logins and speed up test execution.

- **Login Process**:

  - The global setup verifies if the user is already logged in by checking the user balance on the page.
  - If the user is logged in, the setup is skipped, and the current session is used for the tests.
  - If the user is not logged in, the setup will perform the login using credentials stored in the environment variables `TEST_USERNAME` and `TEST_PASSWORD` (or fallback to `default_user` and `default_pass`).

- **Login Failure Handling**:

  - If the login fails during the global setup, it will retry logging in.
  - If login still fails, a screenshot is taken (`global-setup-error.png`), and test execution is stopped.

- **Skipping Global Setup for `@auth` Tests**:
  - For tests tagged with `@auth`, the global setup is skipped, and the login will follow the default procedure within the test itself.

### How It Works:

1. **Executed Once**: The global setup is only executed once before the entire test suite to avoid multiple logins.
2. **Login Verification**: It checks whether the user is already logged in:
   - If the user is logged in, the setup is skipped.
   - If the user is not logged in, the setup logs the user in and stores the session for subsequent tests.
3. **Error Handling**:
   - If login fails, the setup will attempt to log in again.
   - If login fails a second time, the setup captures a screenshot (`global-setup-error.png`) and stops the execution.

### When is Global Setup Skipped?

The global setup will be skipped for tests marked with the `@auth` tag. In these cases, the login is performed by the test itself, as per the normal test flow.
