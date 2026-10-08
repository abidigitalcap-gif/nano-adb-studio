# Improvements for Nano ADB Studio

## Security
1. **Remove hardcoded fallback encryption key**: Replace the static fallback `'nanolancers-fallback-secret-2026'` with a strong random key generated at first run and stored securely (e.g., in an environment variable or a platform-specific keyring). Never commit hardcoded secrets.
2. **Encrypt sensitive data at rest**: Currently, GitHub tokens are encrypted with AES-256-CBC using a key stored in `secret.key`. Consider using an established library like `crypto-js` with a key derived from an environment variable via PBKDF2 or using a system keyring (e.g., `keytar` on Windows) to avoid storing the encryption key alongside the data.
3. **Minimize plaintext token exposure**: The `encryptCredential`/`decryptCredential` functions return the plaintext on error, which could leak tokens. Instead, throw an error or return a safe placeholder and log the error internally.
4. **Validate and sanitize inputs**: Add strict validation for all API inputs (e.g., using Joi or express-validator) to prevent injection attacks (though the surface is limited, it's good practice).
5. **Limit token scopes**: When creating GitHub accounts, request only the necessary scopes (e.g., `repo`, `workflow`) and inform the user. Avoid requesting excessive permissions.
6. **Use HTTPS for external calls**: Ensure all outbound API calls (e.g., to GitHub, ipapi.co, proxyscrape.com) use HTTPS. The code already does this, but double-check.
7. **Implement rate limiting**: Add rate limiting on API endpoints (especially `/api/github/verify` and `/api/proxy/test`) to prevent abuse and protect against credential stuffing.
8. **Secure error messages**: Avoid exposing stack traces or internal details in error responses to clients. Log details server-side and return generic messages to users.

## Performance
1. **Cache JSON data in memory**: Instead of reading files synchronously on every request (`readJSON`), maintain in-memory caches for frequently accessed data (profiles, accounts, proxies, usage stats) and update them via file watchers (`fs.watch`) or on write operations.
2. **Parallelize proxy testing**: In `refreshUSProxyPool` and `getVerifiedUSCloudProxy`, test multiple proxies concurrently using `Promise.all` or a pool to reduce latency.
3. **Optimize user agent loading**: The `loadRealUserAgents` function is already cached. Consider lazy-loading and serving from a pre-processed list to reduce startup time.
4. **Debounce frequent operations**: For endpoints like `/api/profiles/check-all-ips` that may be called often, debounce or throttle the underlying IP fetch and proxy tests.
5. **Use connection pooling for HTTPS**: The `githubApiRequest` function creates a new agent for each request. Consider using a global `https.Agent` with keep-alive to reuse connections.

## Maintainability
1. **Modularize the codebase**: Split `server.js` into multiple files:
   - `routes/profiles.js`
   - `routes/github.js`
   - `routes/proxies.js`
   - `services/encryption.js`
   - `services/proxyTester.js`
   - `services/githubService.js`
   - `utils/helpers.js`
   - `config.js` (for paths, defaults, etc.)
2. **Extract repeated logic**: Create helper functions for common operations like reading/writing JSON, logging audit events, and error handling.
3. **Use async/await consistently**: The code mixes callbacks and promises. Refactor to use async/await throughout for readability.
4. **Centralize configuration**: Move hardcoded values (ports, file paths, default values, fallback proxies) to a configuration file or environment variables.
5. **Add JSDoc comments**: Document functions, parameters, and return values to improve readability and IDE support.

## Code Quality
1. **Break down large functions**: The `/api/profiles/:id/launch` handler is over 200 lines. Split it into smaller functions for each launch mode (Firefox, Chromium) and substeps (proxy setup, argument building, process spawning).
2. **Reduce nesting**: Early returns and guard clauses can reduce deep nesting (e.g., in `testProxyConnection`).
3. **Consistent error handling**: Instead of scattering try/catch blocks, consider using express-async-errors or a wrapper to catch async errors and pass them to an error-handling middleware.
4. **Replace magic numbers/strings**: Define constants for values like `10000` (audit log limit), `3000` (timeouts), and strings like `'github_cloud'`.
5. **Use modern JavaScript features**: Where appropriate, use optional chaining, nullish coalescing, and array/destructuring to simplify code.

## Potential Bug Fixes
1. **Auto-sync may violate 1:1 rule**: In `syncProfilesFromStore`, when creating profiles from directories, assign GitHub accounts in a round-robin fashion or check allocations to avoid assigning the same account to multiple profiles in 1:1 mode. Alternatively, skip GitHub assignment during auto-sync and let the user assign later.
2. **Proxy testing does not verify end-to-end connectivity**: For HTTP proxies, after establishing a CONNECT tunnel, make a simple GET request (e.g., to `https://ipapi.co/json/`) through the tunnel to confirm the proxy forwards traffic correctly.
3. **Fallback proxies may be stale**: Replace the hardcoded `FALLBACK_US_PROXIES` list with a dynamic source (e.g., fetch from a reputable proxy API on startup) or allow users to configure fallback proxies.
4. **Missing cleanup on profile deletion**: When deleting a profile, ensure the associated user data directory in `profiles_store` is removed (the batch delete endpoint does this, but the single delete endpoint does not). Add directory removal to the single delete endpoint.
5. **Inconsistent use of `writeJSON`**: Some functions call `writeJSON` without checking the return value. Consider making `writeJSON` throw on error and handle it upstream, or at least log failures.
6. **Race condition in `getProfileAllocations`**: The function reads and writes the allocations file without locking. Under high concurrency, this could lead to lost updates. Consider using a file lock or a lightweight database (e.g., SQLite) for allocation data.

## Additional Recommendations
1. **Add automated tests**: Write unit tests for core utilities (encryption, proxy testing, allocation logic) and integration tests for critical API endpoints.
2. **Implement health check endpoint**: Add a simple `/health` endpoint that returns server status, memory usage, and dependency checks (e.g., GitHub API connectivity).
3. **Use a process manager for production**: Recommend using PM2 or Docker for deployment to ensure the server restarts on failure and manages logs.
4. **Document deployment steps**: Create a `DEPLOYMENT.md` guide covering environment variables, HTTPS setup (using a reverse proxy like Nginx), and backup procedures.
5. **Monitor and log**: Integrate with a logging service (e.g., Winston) to log to files or external systems, and set up alerts for critical errors.

By addressing these points, the application will be more secure, performant, maintainable, and robust.