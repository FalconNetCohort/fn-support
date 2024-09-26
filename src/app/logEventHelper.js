import { logEvent, analytics } from './firebase';

// Helper to log events safely, no need for checks in components
export const logEventHelper = (eventName, eventParams = {}) => {
    if (analytics) {
        logEvent(analytics, eventName, eventParams);
    } else {
        // Optionally, you can log this or handle the case where analytics isn't available
        console.warn(`Analytics is not available for event: ${eventName}`);
    }
};
