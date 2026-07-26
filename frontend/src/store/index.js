import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import treatmentsReducer from './slices/treatmentSlice';
import paymentsReducer from './slices/paymentSlice';
import feedbackReducer from './slices/feedbackSlice';
import adminReducer from './slices/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    treatments: treatmentsReducer,
    payments: paymentsReducer,
    feedback: feedbackReducer,
    admin: adminReducer
  }
});
