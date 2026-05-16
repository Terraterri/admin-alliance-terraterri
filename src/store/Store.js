import { configureStore } from '@reduxjs/toolkit';
import ExpoSlice from './slices/ExpoSlice';
import ProjectManagementSlice from './slices/ProjectManagementSlice';

const Store = configureStore({
  reducer: {
    expo: ExpoSlice,
    projectManagement: ProjectManagementSlice
  }
});

export default Store;
