// Import createAsyncThunk and createSlice here.
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Create loadCommentsForArticleId here.
const loadCommentsForArticleId = createAsyncThunk(
  'comments/loadCommentsForArticleId',
  async (id) => {
    const response = await fetch(`api/articles/${id}/comments`);
    const json = await response.json();
    return json;
  }
)

// Create postCommentForArticleId here.
export const postCommentForArticleId = createAsyncThunk(
  'comments/postCommentForArticleId',
  async ({articleId, comment}) => {
    const requestBody = JSON.stringify({comment: comment});
    const response = await fetch(`api/articles/${articleId}`, {
      method: 'POST',
      body: requestBody
    });
    const json = await response.json();

    return json;
  }
)

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    byArticleId: {},
    isLoadingComments: false,
    failedToLoadComments: false,
    createCommentIsPending: false,
    failedToCreateComment: false
  },
  extraReducers: {
    [loadCommentsForArticleId.pending]: (state, action) => {
      state.isLoadingComments = true;
      state.failedToLoadComments = false;
    },
    [loadCommentsForArticleId.fulfilled]: (state, action) => {
      state.byArticleId = {[action.payload.articleId]: action.payload.comments};
      state.isLoadingComments = false;
      state.failedToLoadComments = false;
    },
    [loadCommentsForArticleId.rejected]: (state, action) => {
      state.isLoadingComments = false;
      state.failedToLoadComments = true;
    },
    [postCommentForArticleId.pending]: (state, action) => {
      state.createCommentIsPending = true,
      state.failedToCreateComment = false
    },
    [postCommentForArticleId.fulfilled]: (state, action) => {
      state.byArticleId[action.payload.articleId].push(action.payload);
      state.createCommentIsPending = false,
      state.failedToCreateComment = false
    },
    [postCommentForArticleId.rejected]: (state, action) => {
      state.createCommentIsPending = false,
      state.failedToCreateComment = true
    }
  }
});

export const selectComments = (state) => state.comments.byArticleId;
export const isLoadingComments = (state) => state.comments.isLoadingComments;
export const createCommentIsPending = (state) => state.comments.createCommentIsPending;

export default commentsSlice.reducer;