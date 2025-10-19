# Third-Party Integrations

This document provides an overview of all third-party services integrated into the Grocery2Go application.

## 1. Campay Payment Gateway

**Purpose:** Mobile money payment processing for orders

**Provider:** Campay (https://campay.net)

**Integration Files:**
- `index.html` - Campay SDK script
- `src/utils/campay.ts` - TypeScript utility wrapper
- `src/components/CheckoutPage.tsx` - Payment implementation

**Features:**
- MTN Mobile Money support
- Orange Money support
- Secure payment processing
- Real-time payment confirmation
- Transaction reference tracking

**Usage Example:**
```typescript
import { CampayPayment } from './utils/campay';

const campay = new CampayPayment({
  description: 'Order #12345',
  amount: '5000',
  currency: 'XAF',
  externalReference: 'GRO-123456'
});

await campay.initialize();

campay.onSuccess((data) => {
  console.log('Payment successful:', data.reference);
});

campay.onFail((data) => {
  console.log('Payment failed:', data.status);
});
```

**Environment:** Demo environment
- Demo SDK: https://demo.campay.net/sdk/js
- Production requires updating the SDK URL and app-id

---

## 2. Chatbase AI Assistant

**Purpose:** AI-powered customer support and product assistance

**Provider:** Chatbase (https://chatbase.co)

**Integration Files:**
- `index.html` - Chatbase initialization script
- `src/utils/chatbase.ts` - TypeScript utility wrapper
- `src/components/ChatbotButton.tsx` - Custom trigger button
- `src/App.tsx` - Component integration

**Features:**
- 24/7 AI-powered support
- Product recommendations
- Order assistance
- FAQ responses
- Multi-language support (configurable)

**Usage Example:**
```typescript
import { ChatbaseAssistant } from './utils/chatbase';

// Open chat programmatically
ChatbaseAssistant.open();

// Close chat
ChatbaseAssistant.close();

// Toggle chat visibility
ChatbaseAssistant.toggle();

// Check if initialized
if (ChatbaseAssistant.isInitialized()) {
  console.log('Chatbase is ready');
}
```

**Custom Button:**
```tsx
import ChatbotButton from './components/ChatbotButton';

<ChatbotButton
  position="bottom-right"
  tooltipText="Need help? Chat with us!"
/>
```

---

## 3. Supabase Backend

**Purpose:** Database, authentication, and real-time features

**Provider:** Supabase (https://supabase.com)

**Integration Files:**
- `.env` - Connection configuration
- `src/context/AuthContext.tsx` - Authentication
- All database operations throughout the app

**Features:**
- PostgreSQL database
- Row Level Security (RLS)
- Real-time subscriptions
- User authentication
- File storage (if configured)

**Tables:**
- `products` - Product catalog
- `categories` - Product categories
- `user_profiles` - User information
- `orders` - Order history
- `reviews` - Product reviews
- `wishlist` - User wishlists
- `coupons` - Discount coupons

---

## Security Considerations

### API Keys & Secrets
- Never commit API keys to version control
- Use environment variables for sensitive data
- Rotate keys periodically
- Use different keys for development/production

### Data Protection
- All payment processing is handled by Campay
- No credit card data stored locally
- User data protected by Supabase RLS
- HTTPS required for all integrations

### Rate Limiting
- Implement rate limiting for API calls
- Monitor usage to prevent abuse
- Set appropriate timeouts

---

## Testing Integrations

### Campay Testing
1. Use demo environment credentials
2. Test with demo mobile money accounts
3. Verify payment callbacks
4. Check error handling

### Chatbase Testing
1. Open chat widget
2. Test common queries
3. Verify responses are relevant
4. Check mobile responsiveness

### Supabase Testing
1. Test authentication flows
2. Verify data permissions
3. Check real-time updates
4. Test edge cases

---

## Monitoring & Analytics

### Campay Monitoring
- Transaction success rates
- Payment method distribution
- Failed payment reasons
- Average transaction value

### Chatbase Analytics
- Chat engagement rates
- Common queries
- Resolution rates
- User satisfaction

### Supabase Monitoring
- Database performance
- API response times
- Error rates
- Active users

---

## Troubleshooting

### Campay Issues
- Verify SDK is loaded (`window.campay`)
- Check network requests in DevTools
- Confirm API credentials are correct
- Review Campay dashboard for errors

### Chatbase Issues
- Verify script initialization
- Check `ChatbaseAssistant.isInitialized()`
- Look for console errors
- Test in incognito mode (ad blockers)

### Supabase Issues
- Check `.env` configuration
- Verify API keys are valid
- Test database connectivity
- Review RLS policies

---

## Migration to Production

### Campay Production
1. Register for production account
2. Obtain production API keys
3. Update SDK URL in `index.html`
4. Update app-id in script
5. Test with real transactions
6. Configure webhooks

### Chatbase Production
- Already using production chatbot
- Configure knowledge base in dashboard
- Train AI on common queries
- Set up conversation flows
- Monitor and improve responses

### Supabase Production
- Already using production database
- Ensure backups are configured
- Monitor database performance
- Set up alerts for errors
- Review and optimize queries

---

## Support Contacts

**Campay:**
- Website: https://campay.net
- Documentation: https://campay.net/docs
- Support: support@campay.net

**Chatbase:**
- Website: https://chatbase.co
- Documentation: https://chatbase.co/docs
- Dashboard: https://chatbase.co/dashboard
- Support: support@chatbase.co

**Supabase:**
- Website: https://supabase.com
- Documentation: https://supabase.com/docs
- Dashboard: https://app.supabase.com
- Community: https://discord.supabase.com

---

## Cost Considerations

### Campay
- Transaction fees per payment
- Monthly/annual fees (check pricing)
- Volume discounts available

### Chatbase
- Based on message volume
- Different tiers available
- Free tier for testing

### Supabase
- Free tier available
- Paid plans based on usage
- Database size and API calls

---

## Future Enhancements

1. **Campay**
   - Add payment method preferences
   - Implement recurring payments
   - Add refund automation
   - Enhance error handling

2. **Chatbase**
   - Train on order-specific data
   - Add product search integration
   - Implement multilingual support
   - Create custom conversation flows

3. **Supabase**
   - Add real-time notifications
   - Implement file uploads
   - Add analytics dashboard
   - Set up automated backups
