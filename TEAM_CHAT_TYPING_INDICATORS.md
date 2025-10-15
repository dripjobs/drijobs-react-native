# Team Chat Typing Indicators

## Overview

The team chat now includes typing indicators that show when other users are typing in the same channel or direct message thread. This feature provides real-time feedback and improves the chat experience.

## Features

- ✅ Real-time typing indicators in both channels and DMs
- ✅ Shows single user typing: "John Doe is typing..."
- ✅ Shows multiple users typing: "John Doe and Jane Smith are typing..." or "John Doe and 2 others are typing..."
- ✅ Automatic timeout after 3 seconds of no typing activity
- ✅ Clean, animated UI with typing dots
- ✅ Thread-specific indicators (only shows for the current channel/DM)

## Current Implementation

The current implementation includes:

### 1. State Management

```typescript
// Stores typing users per thread ID
const [typingUsers, setTypingUsers] = useState<{[key: string]: string[]}>({});
const typingTimeoutRef = useRef<{[key: string]: NodeJS.Timeout}>({});
```

### 2. Helper Functions

Two helper functions are provided for managing typing state:

- `addTypingUser(threadId: string, userName: string)` - Adds a user to the typing list
- `removeTypingUser(threadId: string, userName: string)` - Removes a user from the typing list

### 3. UI Display

The typing indicator appears between the messages area and the message input, showing:
- Animated typing dots
- User name(s) with proper formatting
- Smooth fade-in/fade-out animations

## Integration with Real Backend

To connect this feature with your WebSocket or real-time messaging backend, follow these steps:

### Step 1: Set Up WebSocket Connection

Create a WebSocket service or use your existing real-time connection:

```typescript
// services/TeamChatWebSocketService.ts
import { io, Socket } from 'socket.io-client';

class TeamChatWebSocketService {
  private socket: Socket | null = null;
  
  connect(userId: string) {
    this.socket = io('YOUR_WEBSOCKET_SERVER_URL', {
      query: { userId }
    });
    
    return this.socket;
  }
  
  // Emit typing event
  sendTypingStatus(threadId: string, isTyping: boolean) {
    this.socket?.emit('typing', { threadId, isTyping });
  }
  
  // Listen for typing events
  onTyping(callback: (data: { threadId: string, userName: string, isTyping: boolean }) => void) {
    this.socket?.on('user-typing', callback);
  }
  
  disconnect() {
    this.socket?.disconnect();
  }
}

export default new TeamChatWebSocketService();
```

### Step 2: Update TeamChat Component

Modify `app/(tabs)/team-chat.tsx` to integrate with the WebSocket service:

```typescript
import TeamChatWebSocketService from '@/services/TeamChatWebSocketService';

export default function TeamChat() {
  // ... existing code ...
  
  // Set up WebSocket connection
  useEffect(() => {
    const currentUserId = 'CURRENT_USER_ID'; // Get from auth context
    const socket = TeamChatWebSocketService.connect(currentUserId);
    
    // Listen for typing events from other users
    TeamChatWebSocketService.onTyping(({ threadId, userName, isTyping }) => {
      if (isTyping) {
        addTypingUser(threadId, userName);
      } else {
        removeTypingUser(threadId, userName);
      }
    });
    
    return () => {
      TeamChatWebSocketService.disconnect();
    };
  }, []);
  
  // Broadcast typing status when user types
  const handleTextChange = (text: string) => {
    setNewMessage(text);
    
    // ... existing mention detection code ...
    
    // Broadcast typing status
    const threadId = selectedChannel ? selectedChannel.id : `dm-${selectedDM?.id}`;
    const isTyping = text.length > 0;
    
    // Debounce the typing event
    if (typingBroadcastTimeout.current) {
      clearTimeout(typingBroadcastTimeout.current);
    }
    
    TeamChatWebSocketService.sendTypingStatus(threadId, isTyping);
    
    // Auto-stop typing after 3 seconds of no input
    typingBroadcastTimeout.current = setTimeout(() => {
      TeamChatWebSocketService.sendTypingStatus(threadId, false);
    }, 3000);
  };
  
  // ... rest of the code ...
}
```

### Step 3: Server-Side Implementation

Your backend server should handle typing events:

```javascript
// Node.js + Socket.IO example
io.on('connection', (socket) => {
  socket.on('typing', ({ threadId, isTyping }) => {
    // Get user info from socket session
    const user = socket.user;
    
    // Broadcast to all users in the same thread except sender
    socket.to(threadId).emit('user-typing', {
      threadId,
      userName: user.name,
      isTyping
    });
  });
  
  // Join thread/channel rooms
  socket.on('join-thread', (threadId) => {
    socket.join(threadId);
  });
  
  // Leave thread/channel rooms
  socket.on('leave-thread', (threadId) => {
    socket.leave(threadId);
  });
});
```

### Step 4: Thread Room Management

Make sure users join the appropriate room when opening a channel:

```typescript
useEffect(() => {
  if (!selectedChannel && !selectedDM) return;
  
  const threadId = selectedChannel ? selectedChannel.id : `dm-${selectedDM?.id}`;
  
  // Join the thread room
  TeamChatWebSocketService.socket?.emit('join-thread', threadId);
  
  return () => {
    // Leave the thread room when switching away
    TeamChatWebSocketService.socket?.emit('leave-thread', threadId);
  };
}, [selectedChannel, selectedDM]);
```

## Best Practices

1. **Debounce Typing Events**: Don't send a typing event for every keystroke. Use a debounce or throttle mechanism to reduce server load.

2. **Auto-timeout**: Always set a timeout to automatically stop showing typing indicators if no new typing events are received (implemented at 3 seconds).

3. **Thread Isolation**: Only show typing indicators for the currently active thread. Users should only see typing status for the channel/DM they're viewing.

4. **Privacy**: Consider privacy settings - some users may want to disable broadcasting their typing status.

5. **Performance**: Clean up timeouts and WebSocket listeners properly to prevent memory leaks.

## Testing

To test the typing indicators:

1. Open a team channel or DM
2. Type a message (you'll see simulated typing from other users occasionally)
3. Switch between different channels to see thread-specific indicators
4. Test with multiple "users" typing simultaneously

## Future Enhancements

Potential improvements to consider:

- **User preferences**: Allow users to disable showing/broadcasting typing status
- **Mobile optimization**: Adjust indicator size and position for mobile devices
- **Accessibility**: Add screen reader support for typing indicators
- **Animations**: Add more sophisticated animations for the typing dots
- **Group DM support**: Handle typing indicators in group direct messages
- **Throttling**: Implement more sophisticated throttling for high-traffic channels

## Troubleshooting

**Typing indicators not showing:**
- Check WebSocket connection status
- Verify thread/room join events are firing
- Check console for errors
- Ensure user names are being passed correctly

**Indicators not clearing:**
- Verify timeout cleanup in useEffect
- Check that removeTypingUser is being called
- Look for memory leaks with timeoutRef

**Performance issues:**
- Reduce typing event frequency with debouncing
- Limit the number of concurrent typing users shown
- Optimize re-renders with React.memo if needed

## Notes

- The current implementation includes a simulation for demonstration purposes that shows random typing activity when channels are opened
- Remove or disable the simulation useEffect before deploying to production
- The helper functions `addTypingUser` and `removeTypingUser` are production-ready and can be used with your backend integration

