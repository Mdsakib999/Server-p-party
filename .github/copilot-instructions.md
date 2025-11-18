# AI Agent Instructions for BNP Server

## Project Overview

This is an Express.js-based authentication and user management server with the following key features:

- Multi-provider authentication (credentials & Google OAuth)
- OTP verification system
- JWT-based access and refresh token system
- Role-based authorization
- Email notifications using templates

## Architecture

### Module Structure

The codebase follows a modular architecture with feature-based organization:

```
src/
  modules/           # Feature modules (auth, user, otp)
    [module]/
      *.controller.js  # Request handlers
      *.service.js     # Business logic
      *.route.js       # Route definitions
      *.model.js       # Data models (if applicable)
  config/            # Configuration (env, passport, redis)
  middlewares/       # Global middleware
  utils/            # Shared utilities
  routes/           # Route aggregation
```

### Key Patterns

1. **Error Handling**:

   - Use `ApiError` class from `utils/ApiError.js` for consistent error responses
   - All async routes are wrapped with `catchAsync` utility
   - Global error handler in `middlewares/globalErrorHandler.js`

2. **Authentication Flow**:

   - JWT tokens managed through `utils/jwt.js` and `utils/userTokens.js`
   - `checkAuth` middleware for protected routes
   - Multiple auth providers supported via Passport strategies

3. **Response Format**:
   - Use `sendResponse` utility for consistent API responses
   - Standard format: `{ success: boolean, message: string, data?: any }`

## Development Workflows

### Environment Setup

Required environment variables (see `config/envVariables.js`):

- `EXPRESS_SESSION_SECRET`
- `CLIENT_URL`
- `BCRYPT_SALT_ROUNDS`
- JWT secrets and email configuration

### Common Tasks

- **Email Templates**: Add new templates in `utils/Email/templates/`
- **New Auth Provider**: Update `config/passport.js` and add provider in user model's `auths` array
- **Protected Routes**: Use `checkAuth` middleware and optionally add role checks

## Integration Points

- Redis for session management
- MongoDB for data persistence
- SMTP server for email notifications
- OAuth providers (currently Google)

## Examples

### Adding a Protected Route

```javascript
import { checkAuth } from "../../middlewares/checkAuth.js";
router.get("/profile", checkAuth, UserController.getProfile);
```

### Error Handling Pattern

```javascript
if (!user) {
  throw new ApiError(404, "User not found");
}
```

### Auth Provider Integration

```javascript
user.auths.push({
  provider: "credential",
  providerId: user.email,
});
```
