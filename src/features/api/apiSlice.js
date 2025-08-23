import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://radio-mafere-backend.onrender.com',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery,
  tagTypes: ['Post', 'User', 'Event', 'Announcement', 'PendingAnnouncement'], // <-- 'PendingAnnouncement' ajouté

  endpoints: (builder) => ({
    // --- AUTH ---
    register: builder.mutation({
      query: (credentials) => ({ url: '/api/auth/register', method: 'POST', body: credentials }),
    }),
    login: builder.mutation({
      query: (credentials) => ({ url: '/api/auth/login', method: 'POST', body: credentials }),
    }),

    // --- POSTS ---
    getPosts: builder.query({
      query: () => '/api/posts',
      providesTags: (result = [], error, arg) => [
        'Post',
        ...result.map(({ _id }) => ({ type: 'Post', id: _id })),
      ],
    }),
    addPost: builder.mutation({
      query: (newPost) => ({
        url: '/api/posts',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'],
    }),
    likePost: builder.mutation({
      query: ({ postId }) => ({
        url: `/api/posts/${postId}/like`,
        method: 'PUT',
      }),
      async onQueryStarted({ postId, userId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            const post = draft.find((p) => p._id === postId);
            if (post) {
              const userIndex = post.likes.indexOf(userId);
              if (userIndex === -1) {
                post.likes.push(userId);
              } else {
                post.likes.splice(userIndex, 1);
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    addComment: builder.mutation({
      query: ({ postId, text }) => ({
        url: `/api/posts/${postId}/comments`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { postId }) => [{ type: 'Post', id: postId }],
    }),
    
    // --- USERS (ADMIN) ---
    getUsers: builder.query({
      query: () => '/api/users',
      providesTags: ['User'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, statut }) => ({
        url: `/api/users/${userId}/status`,
        method: 'PUT',
        body: { statut },
      }),
      invalidatesTags: ['User'],
    }),

    // --- STATS (ADMIN) ---
    getStats: builder.query({
        query: () => '/api/stats',
        providesTags: ['User', 'Post'],
    }),

    // --- EVENTS ---
    getEvents: builder.query({
      query: () => '/api/events',
      providesTags: (result = [], error, arg) => [
        'Event',
        ...result.map(({ _id }) => ({ type: 'Event', id: _id })),
      ],
    }),
    toggleParticipation: builder.mutation({
      query: (eventId) => ({
        url: `/api/events/${eventId}/participate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, eventId) => [{ type: 'Event', id: eventId }],
    }),
    
    // --- ANNOUNCEMENTS ---
    getApprovedAnnouncements: builder.query({
      query: () => '/api/announcements',
      providesTags: ['Announcement'],
    }),
    createAnnouncement: builder.mutation({
      query: (newAnnouncement) => ({
        url: '/api/announcements',
        method: 'POST',
        body: newAnnouncement,
      }),
    }),

    // --- ANNOUNCEMENT MODERATION (Admin) --- (NOUVELLE SECTION)
    getPendingAnnouncements: builder.query({
        query: () => '/api/announcements/pending',
        providesTags: ['PendingAnnouncement'],
    }),
    updateAnnouncementStatus: builder.mutation({
        query: ({ id, status }) => ({
            url: `/api/announcements/${id}/status`,
            method: 'PUT',
            body: { status },
        }),
        // On rafraîchit la liste des annonces en attente ET la liste des annonces publiques
        invalidatesTags: ['PendingAnnouncement', 'Announcement'],
    }),
  }), 
});

export const { 
  useRegisterMutation, 
  useLoginMutation,
  useGetPostsQuery,
  useAddPostMutation,
  useLikePostMutation,
  useAddCommentMutation,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useGetStatsQuery,
  useGetEventsQuery,
  useToggleParticipationMutation,
  useGetApprovedAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useGetPendingAnnouncementsQuery,    // <-- NOUVEAU HOOK EXPORTÉ
  useUpdateAnnouncementStatusMutation, // <-- NOUVEAU HOOK EXPORTÉ
} = apiSlice;