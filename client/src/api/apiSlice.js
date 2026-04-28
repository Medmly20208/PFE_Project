import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_LINK }),
  tagTypes: ["expense", "blog"],
  endpoints: (builder) => ({
    getExpenses: builder.query({
      query: (query) => ({
        url: `/expenses?${Object.keys(query)
          .map((item) => `${item}=${query[item]}`)
          .join("&")}`,
        method: "GET",
      }),
      providesTags: ["expense"],
    }),
    getLatestExpenses: builder.query({
      query: (query) => ({
        url: `/expenses/latest/${query.id}`,
        method: "GET",
      }),
      providesTags: ["expense"],
    }),
    getAssetsByUserId: builder.query({
      query: (query) => ({
        url: `/assets/${query.userId}`,
        method: "GET",
      }),
      providesTags: ["asset"],
    }),
    addAsset: builder.mutation({
      query: (asset) => ({
        url: "/assets",
        method: "POST",
        body: asset,
      }),
      invalidatesTags: ["asset"],
    }),
    getTickersPrices: builder.mutation({
      query: (tickers) => ({
        url: "/assets/prices",
        method: "POST",
        body: tickers,
      }),
      invalidatesTags: ["asset"],
    }),
    getPortfolioHistory: builder.mutation({
      query: (body) => ({
        url: "/assets/history",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["asset"],
    }),
    getPortfolioReturns: builder.mutation({
      query: (body) => ({
        url: "/assets/returns",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["asset"],
    }),
    getPortfolioMetrics: builder.mutation({
      query: (body) => ({
        url: "/assets/metrics",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["asset"],
    }),

    addExpense: builder.mutation({
      query: (expense) => ({
        url: "/expenses",
        method: "POST",
        body: expense,
      }),
      invalidatesTags: ["expense"],
    }),
    editExpense: builder.mutation({
      query: (expense) => ({
        url: `/expenses/${expense.id}`,
        method: "PUT",
        body: expense.expense,
      }),
      invalidatesTags: ["expense"],
    }),
    updateAsset: builder.mutation({
      query: (asset) => ({
        url: `/assets/${asset.id}`,
        method: "PUT",
        body: asset.asset,
      }),
      invalidatesTags: ["asset"],
    }),
    addMessage: builder.mutation({
      query: (message) => ({
        url: "/messages",
        method: "POST",
        body: message,
      }),
    }),
    getMessagesByRoomId: builder.query({
      query: (query) => ({
        url: `/messages/${query.room}`,
        method: "GET",
      }),
    }),

    getUserNameById: builder.query({
      query: (query) => ({
        url: `/users/${query.id}`,
        method: "GET",
      }),
    }),
    updateUserNameById: builder.mutation({
      query: (query) => ({
        url: `/users/${query.id}`,
        body: query.user,
        method: "PUT",
      }),
    }),
    deleteAssetById: builder.mutation({
      query: (query) => ({
        url: `/assets/${query.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["asset"],
    }),

    deleteExpenseById: builder.mutation({
      query: (query) => ({
        url: `/expenses/${query.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expense"],
    }),

    addBlogPost: builder.mutation({
      query: (blog) => ({
        url: "/blogs",
        method: "POST",
        body: blog,
      }),
      invalidatesTags: ["blog"],
    }),
    updateBlogPost: builder.mutation({
      query: (blog) => ({
        url: `/blogs/${blog.id}`,
        method: "PATCH",
        body: blog.blog,
      }),
      invalidatesTags: ["blog"],
    }),

    getAllBlogPosts: builder.query({
      query: (blog) => ({
        url: "/blogs",
        method: "get",
      }),
      providesTags: ["blog"],
    }),

    getBlogPostsById: builder.query({
      query: (blog) => ({
        url: `/blogs/${blog.id}`,
        method: "get",
      }),
      providesTags: ["blog"],
    }),
    getBlogPostsByUserId: builder.query({
      query: (blog) => ({
        url: `/blogs/users/${blog.userId}?title=${blog.title}`,
        method: "get",
      }),
      providesTags: ["blog"],
    }),
    likePostsById: builder.mutation({
      query: (like) => ({
        url: `/blogs/${like.postId}/likes`,
        method: "PATCH",
        body: like,
      }),
      invalidatesTags: ["blog"],
    }),

    commentPostsById: builder.mutation({
      query: (comment) => ({
        url: `/blogs/${comment.postId}/comments`,
        method: "PATCH",
        body: comment,
      }),
      invalidatesTags: ["blog"],
    }),
    deleteBlogById: builder.mutation({
      query: (blog) => ({
        url: `/blogs/${blog.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const authSlice = createApi({
  reducerPath: "auth",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_LINK }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: `/users/signup`,
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetExpensesQuery,
  useAddExpenseMutation,
  useAddAssetMutation,
  useAddMessageMutation,
  useGetMessagesByRoomIdQuery,
  useGetUserNameByIdQuery,
  useGetTickersPricesMutation,
  useUpdateUserNameByIdMutation,
  useGetPortfolioReturnsMutation,
  useGetPortfolioMetricsMutation,
  useUpdateAssetMutation,
  useDeleteExpenseByIdMutation,
  useEditExpenseMutation,
  useGetLatestExpensesQuery,
  useGetAssetsByUserIdQuery,
  useDeleteAssetByIdMutation,
  useGetPortfolioHistoryMutation,
  useAddBlogPostMutation,
  useGetAllBlogPostsQuery,
  useGetBlogPostsByIdQuery,
  useLikePostsByIdMutation,
  useCommentPostsByIdMutation,
  useGetBlogPostsByUserIdQuery,
  useDeleteBlogByIdMutation,
  useUpdateBlogPostMutation,
} = apiSlice;

export const { useLoginMutation, useRegisterMutation } = authSlice;
