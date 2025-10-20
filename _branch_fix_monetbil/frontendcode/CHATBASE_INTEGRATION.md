# Chatbase AI Assistant Integration

This document explains how the Chatbase AI assistant is integrated into the Grocery2Go application.

## Overview

Chatbase provides an AI-powered customer support assistant that can answer questions, help with orders, and provide product recommendations.

## Integration Details

### 1. Script Integration
The Chatbase script is loaded in `index.html` and initializes automatically when the page loads.

**Location:** `index.html` (bottom of `<body>`)

The script:
- Loads asynchronously to avoid blocking page rendering
- Initializes the chat widget automatically
- Provides a default floating chat button

### 2. TypeScript Utility
A TypeScript wrapper provides type-safe access to Chatbase functions.

**Location:** `src/utils/chatbase.ts`

**Available Methods:**
```typescript
ChatbaseAssistant.open()           // Open the chat window
ChatbaseAssistant.close()          // Close the chat window
ChatbaseAssistant.toggle()         // Toggle chat window open/closed
ChatbaseAssistant.show()           // Show the chat button
ChatbaseAssistant.hide()           // Hide the chat button
ChatbaseAssistant.isInitialized()  // Check if Chatbase is ready
```

### 3. Custom Button Component
An optional custom trigger button with animations and tooltips.

**Location:** `src/components/ChatbotButton.tsx`

**Features:**
- Animated icon transitions
- Pulse effect for first-time visitors
- Hover tooltip
- Responsive positioning
- Only shows when Chatbase is initialized

**Usage:**
```tsx
import ChatbotButton from './components/ChatbotButton';

// Default (bottom-right position)
<ChatbotButton />

// Custom position
<ChatbotButton position="bottom-left" />

// Custom tooltip
<ChatbotButton
  tooltipText="Ask me anything!"
  showTooltip={true}
/>

// Custom styling
<ChatbotButton
  position="custom"
  className="top-20 right-4"
/>
```

## Customization Options

### Hide Default Button
If you want to use only the custom button and hide Chatbase's default button:

```typescript
import { ChatbaseAssistant } from './utils/chatbase';

// Hide the default Chatbase button
ChatbaseAssistant.hide();
```

### Programmatic Control
You can trigger the chat from anywhere in your application:

```tsx
import { ChatbaseAssistant } from '../utils/chatbase';

const handleHelpClick = () => {
  ChatbaseAssistant.open();
};

<button onClick={handleHelpClick}>
  Need Help?
</button>
```

### Integration with User Context
You can pass user information to the chat:

```typescript
// The Chatbase script automatically detects user context
// You can also use their API to set user properties
```

## Chat Widget Features

The Chatbase AI assistant can:
- Answer product questions
- Help with order tracking
- Provide shopping recommendations
- Explain delivery and payment options
- Handle customer support inquiries
- Guide users through the checkout process

## Configuration

The chat widget is configured through the Chatbase dashboard at:
https://www.chatbase.co

You can customize:
- Chat widget appearance and branding
- AI responses and knowledge base
- Conversation flows
- Language and tone
- Integration settings

## Testing

To test the integration:
1. Load the application in a browser
2. Wait for the Chatbase widget to initialize
3. Click the chat button (bottom-right by default)
4. Interact with the AI assistant

## Troubleshooting

### Chat widget not appearing
- Check browser console for script loading errors
- Verify the Chatbase ID is correct in `index.html`
- Ensure no ad blockers are interfering

### TypeScript errors
- Ensure `src/utils/chatbase.ts` is imported correctly
- Check that window.chatbase is available

### Custom button not showing
- Verify Chatbase script has loaded (`ChatbaseAssistant.isInitialized()`)
- Check browser console for errors
- Ensure the component is rendered in the DOM

## Best Practices

1. **Load Optimization**: The script loads asynchronously to avoid blocking page rendering
2. **Graceful Degradation**: The custom button only shows when Chatbase is ready
3. **User Experience**: The pulse animation draws attention for first-time users
4. **Accessibility**: Proper ARIA labels for screen readers
5. **Mobile Responsive**: Button adapts to different screen sizes

## Support

For Chatbase-specific issues:
- Documentation: https://www.chatbase.co/docs
- Support: support@chatbase.co
- Dashboard: https://www.chatbase.co/dashboard
