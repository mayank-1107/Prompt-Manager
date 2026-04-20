import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    prompts: [
        { id: 1, title: 'API Documentation', content: 'How to write clear and comprehensive API documentation.', category: 'Learning', isFavorite: false },
        { id: 2, title: 'User Guide Template', content: 'Create a user-friendly guide for your product.', category: 'Learning', isFavorite: false },
        { id: 3, title: 'Clean Code Principles', content: 'What are the key principles of writing clean, maintainable code?', category: 'Code', isFavorite: false },
        { id: 4, title: 'Refactoring Strategy', content: 'Develop a step-by-step refactoring plan for legacy code.', category: 'Code', isFavorite: false },
        { id: 5, title: 'Market Research', content: 'Analyze competitor features and market positioning.', category: 'General', isFavorite: false },
        { id: 6, title: 'Data Analysis', content: 'How to effectively visualize and interpret data sets.', category: 'General', isFavorite: false },
        { id: 7, title: 'Content Ideas', content: 'Generate creative content ideas for your blog.', category: 'General', isFavorite: false },
        { id: 8, title: 'Brainstorming Session', content: 'Facilitate a productive brainstorming session.', category: 'General', isFavorite: false },
        { id: 9, title: 'Project Roadmap', content: 'Create a detailed project roadmap with milestones.', category: 'General', isFavorite: false },
        { id: 10, title: 'Sprint Planning', content: 'How to organize and prioritize tasks for a sprint.', category: 'General', isFavorite: false },
        { id: 11, title: 'Team Communication', content: 'Best practices for effective team communication.', category: 'Others', isFavorite: false },
        { id: 12, title: 'Remote Work Tips', content: 'Tips for staying productive while working remotely.', category: 'Others', isFavorite: false },
    ],
    enhancedPrompts: [],
    filter: '',
    showFavoritesOnly: false,
    categories: ['Learning', 'Code', 'General', 'Others'],
};

const promptsSlice = createSlice({
    name: 'prompts',
    initialState,
    reducers: {
        addPrompt(state, action) {
            state.prompts.push(action.payload);
        },
        toggleFavorite(state, action) {
            const prompt = state.prompts.find((p) => p.id === action.payload);
            if (prompt) {
                prompt.isFavorite = !prompt.isFavorite;
            }
        },
        deletePrompt(state, action) {
            state.prompts = state.prompts.filter((p) => p.id !== action.payload);
        },
        setFilter(state, action) {
            state.filter = action.payload;
        },
        setShowFavoritesOnly(state, action) {
            state.showFavoritesOnly = action.payload;
        },
        addEnhancedPrompt(state, action) {
            const { id, originalPrompt, enhancedPrompt, isFavorite = false, category = null } = action.payload;
            state.enhancedPrompts.push({
                id,
                originalPrompt,
                enhancedPrompt,
                isFavorite,
                category,
                createdAt: new Date().toISOString(),
            });
        },
        toggleEnhancedFavorite(state, action) {
            const prompt = state.enhancedPrompts.find((p) => p.id === action.payload);
            if (prompt) {
                prompt.isFavorite = !prompt.isFavorite;
            }
        },
        addToCategory(state, action) {
            const { id, category } = action.payload;
            const prompt = state.enhancedPrompts.find((p) => p.id === id);
            if (prompt) {
                prompt.category = category;
            }
        },
        deleteEnhancedPrompt(state, action) {
            state.enhancedPrompts = state.enhancedPrompts.filter((p) => p.id !== action.payload);
        },
    },
});

export const { 
    addPrompt, 
    toggleFavorite, 
    deletePrompt, 
    setFilter, 
    setShowFavoritesOnly,
    addEnhancedPrompt,
    toggleEnhancedFavorite,
    addToCategory,
    deleteEnhancedPrompt,
} = promptsSlice.actions;
export default promptsSlice.reducer;