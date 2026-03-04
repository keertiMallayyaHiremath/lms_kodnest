# LMS Features

## Authentication System

### JWT-Based Authentication
- Access tokens (15 minutes lifetime)
- Refresh tokens (30 days lifetime)
- HTTP-only secure cookies for refresh tokens
- Automatic token refresh on expiration
- Token revocation on logout

### Security Features
- Password hashing with bcrypt (12 rounds)
- Token-based session management
- CORS protection
- Secure cookie configuration

## Video Management

### YouTube Integration
- Embedded YouTube player via react-youtube
- No local video storage required
- Support for YouTube video IDs and URLs
- Automatic video ID extraction from URLs

### Video Ordering
- Strict sequential ordering enforced by backend
- Section-based organization
- Order index for sections and videos
- Flattened video sequence for navigation

### Video Locking
- Videos locked until previous video is completed
- Clear unlock requirements displayed
- Backend validation of video access
- Automatic unlock on completion

## Progress Tracking

### Video Progress
- Real-time position tracking (every 5 seconds)
- Resume from last position
- Completion status tracking
- Progress saved on pause and end

### Subject Progress
- Total videos count
- Completed videos count
- Percentage completion
- Last watched video tracking

### Edge Cases Handled
- Browser closed mid-video (progress saved)
- Network loss (progress saved on reconnect)
- Device switching (progress synced via backend)
- Video order changes (handled by backend)

## User Interface

### Responsive Design
- Mobile-friendly layout
- Collapsible sidebar
- Adaptive video player
- Touch-friendly controls

### Navigation
- Subject browsing
- Section-based organization
- Video list with completion status
- Previous/Next video buttons
- Direct video navigation

### Visual Feedback
- Completed videos marked with checkmark
- Locked videos shown with lock icon
- Current video highlighted
- Loading states
- Error messages

## Data Flow

### Video Playback Flow
1. User clicks video
2. Frontend fetches video details
3. Frontend fetches progress
4. Player starts at saved position
5. Progress updates every 5 seconds
6. Completion triggers next video unlock
7. Auto-navigation to next video

### Authentication Flow
1. User logs in
2. Access token stored in localStorage
3. Refresh token stored in HTTP-only cookie
4. Access token sent with each request
5. On 401 error, refresh token used
6. New access token obtained
7. Original request retried

## API Architecture

### RESTful Design
- Resource-based endpoints
- Standard HTTP methods
- JSON request/response
- Consistent error handling

### Modular Structure
- Separated concerns (controller/service/repository)
- Reusable components
- Clean architecture
- TypeScript for type safety

## Database Schema

### Normalized Design
- Users table
- Subjects table
- Sections table (with subject FK)
- Videos table (with section FK)
- Video progress table (user + video)
- Refresh tokens table (user FK)

### Indexes
- Email index on users
- Slug index on subjects
- Composite unique indexes for ordering
- Foreign key indexes

## Deployment Ready

### Environment Configuration
- Separate dev/prod configs
- Environment variable validation
- Secure defaults

### Production Features
- Error logging
- Request logging
- Health check endpoint
- Graceful shutdown
- Database connection pooling

### Scalability
- Stateless backend (horizontal scaling)
- Token-based auth (no sessions)
- Efficient database queries
- Optimized frontend bundle

## Testing Support

### Seed Data
- Test user account
- Sample subject with 3 videos
- Real YouTube video IDs
- Proper ordering setup

### Development Tools
- Prisma Studio for database viewing
- Hot reload for both frontend/backend
- TypeScript for compile-time checks
- ESLint for code quality
