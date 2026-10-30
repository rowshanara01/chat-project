# Chat Application API Documentation

**Base REST URL:** `https://frontend-task-chatapp.onrender.com/api`  
**WebSocket Origin:** `https://frontend-task-chatapp.onrender.com`

---

## Authentication

Protected endpoints require the JWT token in the authorization header:
```http
Authorization: Bearer <JWT_TOKEN>
```

### 1. Login
* **Endpoint:** `POST /auth/login`
* **Description:** Logs in an existing user or creates a new user automatically if the phone number is unique.
* **Request Body:**
```json
{
  "phone": "+15551234567",
  "name": "Ada Lovelace"
}
```

### 2. Get Current User Profile
* **Endpoint:** `GET /auth/me`
* **Description:** Retrieves details of the currently authenticated user.

---

## Users & Searching

### 1. Search Users
* **Endpoint:** `GET /users/search?q={query}`
* **Description:** Search for users by name or phone number.

---

## Conversations & Messaging

### 1. List Conversations
* **Endpoint:** `GET /conversations`
* **Description:** Fetches all direct and group conversations for the authenticated user.

### 2. Start Direct Conversation
* **Endpoint:** `POST /conversations`
* **Description:** Initiates a one-on-one direct chat with another user.
* **Request Body:**
```json
{
  "userId": "TARGET_USER_ID"
}
```

---

## Group Conversations

### 1. Create Group
* **Endpoint:** `POST /conversations/group`
* **Description:** Creates a new group conversation with multiple participants.
* **Request Body:**
```json
{
  "name": "Project Team",
  "participantIds": ["USER_ID_1", "USER_ID_2"]
}
```

### 2. Add Participants
* **Endpoint:** `POST /conversations/{id}/participants`
* **Description:** Adds new members to an existing group.
* **Request Body:**
```json
{
  "userIds": ["USER_ID_3"]
}
```

### 3. Remove Participant / Leave Group
* **Endpoint:** `DELETE /conversations/{id}/participants/{userId}`
* **Description:** Removes a participant from the group or allows a user to leave.

### 4. Promote Member to Admin
* **Endpoint:** `POST /conversations/{id}/admins`
* **Description:** Promotes an existing group member to an admin role.
* **Request Body:**
```json
{
  "userId": "USER_ID_TO_PROMOTE"
}
```

### 5. Rename Group
* **Endpoint:** `PATCH /conversations/{id}`
* **Description:** Updates the name of the group conversation.
* **Request Body:**
```json
{
  "name": "Renamed Team"
}
```

---

## WebSocket Interface (Socket.io)

### Connection
Connect to the root host with the JWT passed in the auth handshake:

```javascript
const socket = io('https://frontend-task-chatapp.onrender.com', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});
```

### Client Events (Outbound)
* `message:send` : Send a new message to a conversation.
  * **Payload:** 
    ```json
    {
      "conversationId": "string",
      "text": "string"
    }
    ```
