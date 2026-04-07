# Local Authentication Setup

Your MediConnect application now uses local authentication instead of Supabase. Here's what has been implemented:

## Features
- **Local User Storage**: Users are stored in localStorage for persistence
- **Demo Account**: Built-in demo user for testing
- **Password Validation**: Minimum 6 character password requirement
- **Phone Number Support**: Optional Indian phone number validation
- **Session Management**: Automatic login state persistence

## Demo Account
- **Email**: demo@mediconnect.com
- **Password**: Any 6+ character password

## Files Created/Modified
- `src/types/auth.ts` - Type definitions for local auth
- `src/utils/localAuth.ts` - Local authentication functions
- `src/hooks/useAuth.ts` - Updated to use local auth
- `src/pages/Login.tsx` - Removed Supabase dependencies
- `src/pages/Signup.tsx` - Updated for local auth

## How It Works
1. Users are stored in localStorage as JSON
2. Passwords are validated for length (6+ chars) but not encrypted (demo only)
3. Login state persists across browser sessions
4. No external dependencies required

## Testing
1. Start the development server
2. Go to login page
3. Use demo account or create a new account
4. User remains logged in after page refresh

## Security Notes
This is a demo implementation. For production:
- Implement proper password hashing
- Add server-side authentication
- Use secure session management
- Add input validation and sanitization
