import { configureStore } from '@reduxjs/toolkit';
import todayReducer from './slices/todaySlice';
import authReducer from './slices/authSlice';
import goalReducer from '../redux/goalSlice';
import documentReducer from '../redux/documentSlice';
import notesReducer from '../redux/notesSlice';
import assistantReducer from '../redux/assistantSlice';
import calendarReducer from '../redux/calendarSlice'
import notificationsReducer from '../redux/notificationSlice'
import taskReducer from '../redux/taskSlice'
import settingsReducer from '../redux/settingsSlice'
import travelReducer from '../redux/travelSlice'
import travelPlannerReducer from '../redux/travel'

export const store = configureStore({
  reducer: {
    today: todayReducer,
    auth: authReducer,
    goals: goalReducer,
    documents: documentReducer,
    notes: notesReducer,
    assistant: assistantReducer,
    calendar: calendarReducer,
    notifications: notificationsReducer,
    tasks: taskReducer,
    settings: settingsReducer,
    travel: travelReducer,
    travelPlanner: travelPlannerReducer


  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
