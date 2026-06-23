import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load draft from localStorage if it exists
const loadDraft = () => {
  const draft = localStorage.getItem('eventDraft');
  return draft ? JSON.parse(draft) : { title: '', description: '', category: '', image: '', date: '', time: '', location: '', ticketTypes: [] };
};

// Async thunk for publishing the event
export const publishEvent = createAsyncThunk('event/publish', async (eventData) => {
  const res = await fetch('http://localhost:3000/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...eventData, id: Date.now().toString(), likes: 0, featured: false })
  });
  if (!res.ok) throw new Error('Failed to publish');
  return res.json();
});

const eventSlice = createSlice({
  name: 'event',
  initialState: {
    step: 1,
    formData: loadDraft(),
    status: 'idle',
  },
  reducers: {
    nextStep: (state) => { state.step += 1; },
    prevStep: (state) => { state.step -= 1; },
    updateForm: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
      localStorage.setItem('eventDraft', JSON.stringify(state.formData));
    },
    resetForm: (state) => {
      state.step = 1;
      state.formData = { title: '', description: '', category: '', image: '', date: '', time: '', location: '', ticketTypes: [] };
      localStorage.removeItem('eventDraft');
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishEvent.pending, (state) => { state.status = 'loading'; })
      .addCase(publishEvent.fulfilled, (state) => { state.status = 'success'; });
  }
});

export const { nextStep, prevStep, updateForm, resetForm } = eventSlice.actions;
export default eventSlice.reducer;