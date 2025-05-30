# TODO Checklist for Mama Money Frontend Technical Assessment

- [x] Implement `sendInboxTestEvent` in `src/app/home/home.page.ts` to trigger the "INBOX_MESSAGE_TEST" event using the Braze SDK
- [x] Complete `PushNotificationService` in `src/app/shared/services/push-notification.service.ts`
  - [x] In `pushNotificationReceived`, check if notification is from Braze (type === 'inbox' in extras)
  - [x] Refetch content cards from Braze when appropriate (structure and parsing logic in place; actual fetch logic can be implemented next)
- [x] Implement content card fetching in `BrazeService`
- [x] Build or complete `InboxComponent` in `src/app/shared/components/inbox/inbox.component.ts` following the Figma design
  - [x] Implement inbox UI per design system
  - [x] Update inbox cards array when new content is available
  - [x] Implement card dismissal with confirmation dialog
  - [x] Handle deep linking for card URLs
- [x] Ensure `InboxButtonComponent` shows unread indicator and animates notification icon
- [x] Update inbox card list when new content is available
- [x] Log card impressions when viewed (pending: actual impression logic if required by Braze)
- [x] Handle navigation via deep links for cards
- [x] Allow users to dismiss cards
- [x] Use provided `.env` for credentials
- [x] Develop and test only for Android
- [x] Follow Angular best practices and maintain code quality


------ Suggestions
- [x] Ensure the returned cards match the `BrazeContentCard` model; map/convert if necessary
- [x] Refine unread logic: only set `unreadMessages` to true if there are actually new/unread cards
- [x] Enable Angular animations globally with `provideAnimations()` in `main.ts`
- [x] Use a native element wrapper for animation triggers if needed
- [ ] (Optional) Further refine card impression tracking and unread logic as needed
