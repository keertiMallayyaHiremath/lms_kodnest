# API Documentation

Base URL: `http://localhost:5000/api` (development)

## Authentication

All authenticated endpoints require an `Authorization` header:
```
Authorization: Bearer <access_token>
```

### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGc..."
}
```

### POST /auth/login
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGc..."
}
```

### POST /auth/refresh
Refresh access token using refresh token cookie.

**Response:**
```json
{
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "accessToken": "eyJhbGc..."
}
```

### POST /auth/logout
Logout and revoke refresh token.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Subjects

### GET /subjects
Get all published subjects.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 10)
- `q` (optional): Search query

**Response:**
```json
{
  "subjects": [
    {
      "id": 1,
      "title": "Introduction to Programming",
      "slug": "introduction-to-programming",
      "description": "Learn programming basics",
      "isPublished": true
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### GET /subjects/:subjectId
Get subject details.

**Response:**
```json
{
  "id": 1,
  "title": "Introduction to Programming",
  "slug": "introduction-to-programming",
  "description": "Learn programming basics",
  "isPublished": true
}
```

### GET /subjects/:subjectId/tree
Get subject with sections and videos (requires auth).

**Response:**
```json
{
  "id": 1,
  "title": "Introduction to Programming",
  "description": "Learn programming basics",
  "sections": [
    {
      "id": 1,
      "title": "Getting Started",
      "orderIndex": 0,
      "videos": [
        {
          "id": 1,
          "title": "Introduction",
          "orderIndex": 0,
          "durationSeconds": 600,
          "isCompleted": false,
          "locked": false
        }
      ]
    }
  ]
}
```

### GET /subjects/:subjectId/first-video
Get first unlocked video ID (requires auth).

**Response:**
```json
{
  "videoId": 1
}
```

## Videos

### GET /videos/:videoId
Get video details (requires auth).

**Response:**
```json
{
  "id": 1,
  "title": "Introduction",
  "description": "Course introduction",
  "youtubeVideoId": "xnOwOBYaA3w",
  "orderIndex": 0,
  "durationSeconds": 600,
  "sectionId": 1,
  "sectionTitle": "Getting Started",
  "subjectId": 1,
  "subjectTitle": "Introduction to Programming",
  "previousVideoId": null,
  "nextVideoId": 2,
  "locked": false,
  "unlockReason": null
}
```

## Progress

### GET /progress/videos/:videoId
Get video progress (requires auth).

**Response:**
```json
{
  "lastPositionSeconds": 120,
  "isCompleted": false
}
```

### POST /progress/videos/:videoId
Update video progress (requires auth).

**Request Body:**
```json
{
  "lastPositionSeconds": 120,
  "isCompleted": false
}
```

**Response:**
```json
{
  "lastPositionSeconds": 120,
  "isCompleted": false
}
```

### GET /progress/subjects/:subjectId
Get subject progress (requires auth).

**Response:**
```json
{
  "totalVideos": 10,
  "completedVideos": 3,
  "percentComplete": 30,
  "lastVideoId": 3,
  "lastPositionSeconds": 45
}
```

## Health

### GET /health
Check API health.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```
