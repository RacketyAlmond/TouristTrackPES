export const addNotificationReceivedListener = jest.fn();
export const addNotificationResponseReceivedListener = jest.fn();
export const getExpoPushTokenAsync = jest.fn(() =>
  Promise.resolve('mock-token'),
);
export const cancelAllScheduledNotificationsAsync = jest.fn();
export const scheduleNotificationAsync = jest.fn();
