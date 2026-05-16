import { createSlice } from '@reduxjs/toolkit';

const ProjectManagementSlice = createSlice({
  name: 'ProjectManagementSlice',
  initialState: {
    project: {},
    error: {}
  },
  reducers: {
    setProject: (state, action) => {
      state.project = { ...state.project, ...action.payload };
    },
    setError: (state, action) => {
      state.error = { ...state.error, ...action.payload };
    }
  }
});

export const { setProject, setError } = ProjectManagementSlice.actions;

export default ProjectManagementSlice.reducer;
