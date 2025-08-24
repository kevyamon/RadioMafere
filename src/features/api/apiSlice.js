// src/features/api/apiSlice.js
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
  tagTypes: ['Post', 'User', 'Event', 'Announcement', 'PendingAnnouncement', 'Advertisement', 'Notification', 'Message'],

  endpoints: (builder) => ({
    // ... (les autres endpoints restent inchangés) ...

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
      providesTags: ['Event'],
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

    // --- ANNOUNCEMENT MODERATION (Admin) ---
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
        invalidatesTags: ['PendingAnnouncement', 'Announcement'],
    }),

    // --- ADVERTISEMENTS ---
    getActiveAdvertisements: builder.query({
      query: () => '/api/advertisements',
      providesTags: ['Advertisement'],
    }),
    createAdvertisement: builder.mutation({
      query: (newAd) => ({
        url: '/api/advertisements',
        method: 'POST',
        body: newAd,
      }),
      invalidatesTags: ['Advertisement'],
    }),
    updateAdvertisement: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/advertisements/${id}`,
        method: 'PUT',
        body: data.formData,
      }),
      invalidatesTags: ['Advertisement'],
    }),
    deleteAdvertisement: builder.mutation({
      query: (id) => ({
        url: `/api/advertisements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Advertisement'],
    }),

    // --- NOTIFICATIONS (Admin) ---
    getNotifications: builder.query({
      query: () => '/api/notifications',
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/api/notifications/${notificationId}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
    }),

    // --- MESSAGES ---
    getConversations: builder.query({
      query: () => '/api/messages/conversations',
      providesTags: ['Message'],
    }),
    getMessages: builder.query({
      query: (conversationId) => `/api/messages/conversations/${conversationId}`,
      providesTags: (result, error, arg) => [{ type: 'Message', id: arg }],
    }),
    sendMessage: builder.mutation({
      query: ({ recipientId, text }) => ({
        url: `/api/messages/send/${recipientId}`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Message'],
    }),
    // NOUVELLES MUTATIONS
    updateMessage: builder.mutation({
        query: ({ messageId, text }) => ({
            url: `/api/messages/${messageId}`,
            method: 'PUT',
            body: { text },
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Message' }],
    }),
    deleteMessage: builder.mutation({
        query: (messageId) => ({
            url: `/api/messages/${messageId}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Message'],
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
  useGetPendingAnnouncementsQuery,
  useUpdateAnnouncementStatusMutation,
  useGetActiveAdvertisementsQuery,
  useCreateAdvertisementMutation,
  useUpdateAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  // --- NOUVEAUX EXPORTS ---
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = apiSlice;