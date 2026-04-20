import { configureStore } from '@reduxjs/toolkit';
import promptsReducer from './promptsSlice';

const loadState = () => {
  try {
    const serialised = localStorage.getItem('promptsState');
    if (!serialised) return undefined;
    return { prompts: JSON.parse(serialised) };
  } catch {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem('promptsState', JSON.stringify(state.prompts));
  } catch {
    // ignore write errors
  }
};

const store = configureStore({
  reducer: {
    prompts: promptsReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => saveState(store.getState()));

export default store;
