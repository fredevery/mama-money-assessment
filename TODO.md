# TODO Checklist for Mama Money Frontend Technical Assessment

- [x] Implement `sendInboxTestEvent` in `src/app/home/home.page.ts` to trigger the "INBOX_MESSAGE_TEST" event using the Braze SDK
- [x] Complete `PushNotificationService` in `src/app/shared/services/push-notification.service.ts`
  - [x] In `pushNotificationReceived`, check if notification is from Braze (type === 'inbox' in extras)
  - [x] Refetch content cards from Braze when appropriate (structure and parsing logic in place; actual fetch logic can be implemented next)
- [ ] Build or complete `InboxComponent` in `src/app/shared/components/inbox/inbox.component.ts` following the Figma design
  - [ ] Implement inbox UI per design system
  - [ ] Update inbox cards array when new content is available
  - [ ] Implement card dismissal with confirmation dialog
  - [ ] Handle deep linking for card URLs
- [ ] Ensure `InboxButtonComponent` shows unread indicator and animates notification icon
- [ ] Update inbox card list when new content is available
- [ ] Log card impressions when viewed
- [ ] Handle navigation via deep links for cards
- [ ] Allow users to dismiss cards
- [ ] Use provided `.env` for credentials
- [ ] Develop and test only for Android
- [ ] Follow Angular best practices and maintain code quality
