# Error Handling Strategy

## Error format
Every thrown error should be normalized before sending to clients; use the shape

```json
{
  "message": "Human readable summary",
  "statusCode": 400,
  "details": { /* optional payload such as validation failures */ }
}
```

`statusCode` defaults to `500` when not provided, `details` stays absent unless there is structured context (field errors, retry hints, etc.).

### Validation error pattern
Use the shared `ValidationError` (or any error with `statusCode = 400` + `details`) to report bad request payloads. Always include `details` such as `{ field: "email", reason: "required" }` so clients know how to fix the request before retrying.

## Global error handler
We will register a middleware near the end of the Express chain that inspects each error, defaults the status code to 500, and responds with the normalized JSON above. HTTP headers should only be set once inside the handler, so controllers must `throw` errors instead of manually sending responses.

## Example responses
- Validation failure: `{ message: "Missing email", statusCode: 400, details: { field: "email" } }`
- Auth failure: `{ message: "Invalid credentials", statusCode: 401 }`
- Internal failure: `{ message: "Unexpected server error", statusCode: 500 }`
