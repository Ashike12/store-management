import {createApi} from '@reduxjs/toolkit/query/react';
import {APP_CONFIG} from '@core/config/config';
import {
  ICommandResponse,
  IEmployeeFeedback,
  IEmployeeBatchOption,
  IEmployeeInput,
  IEmployeeOverview,
  IEmployeeSummary,
  IPaginatedEmployeeResponse,
  IPaymentEntry,
  IWorkEntry,
} from '@core/interfaces/api/IEmployee';
import {ApiServiceBaseQuery} from './baseQueries';

const endpoint = (name: string) => `${APP_CONFIG.businessUrl}/employee/${name}`;
export const buildEmployeeRequest = <T>(name: string, body: T) => ({
  url: endpoint(name),
  method: 'POST' as const,
  body,
});

export const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: ApiServiceBaseQuery,
  tagTypes: ['Employee', 'EmployeeOverview', 'EmployeeNotification', 'EmployeeBatch'],
  endpoints: builder => ({
    listEmployees: builder.query<IPaginatedEmployeeResponse<IEmployeeSummary>, {SearchTerm?: string; Status?: 'all' | 'active' | 'inactive'; Page?: number; Size?: number}>({
      query: payload => ({url: endpoint('ListEmployees'), method: 'POST', body: {Status: 'active', Page: 1, Size: 50, ...payload}}),
      providesTags: ['Employee'],
    }),
    createEmployee: builder.mutation<ICommandResponse, IEmployeeInput>({
      query: payload => ({url: endpoint('CreateEmployee'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee'],
    }),
    updateEmployee: builder.mutation<ICommandResponse, Partial<IEmployeeInput> & {ItemId: string}>({
      query: payload => ({url: endpoint('UpdateEmployee'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee', 'EmployeeOverview'],
    }),
    deactivateEmployee: builder.mutation<ICommandResponse, {EmployeeId: string}>({
      query: payload => ({url: endpoint('DeactivateEmployee'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee', 'EmployeeOverview'],
    }),
    getEmployeeOverview: builder.query<ICommandResponse<IEmployeeOverview>, {EmployeeId?: string}>({
      query: payload => ({url: endpoint('GetOverview'), method: 'POST', body: payload}),
      providesTags: ['EmployeeOverview'],
    }),
    listEmployeeBatches: builder.query<IPaginatedEmployeeResponse<IEmployeeBatchOption>, {EmployeeId: string; SearchTerm?: string; Page?: number; Size?: number}>({
      query: payload => ({url: endpoint('ListEmployeeBatches'), method: 'POST', body: {Page: 1, Size: 20, ...payload}}),
      providesTags: (_result, _error, payload) => [{type: 'EmployeeBatch', id: payload.EmployeeId}],
    }),
    createWorkEntry: builder.mutation<ICommandResponse, Omit<IWorkEntry, 'ItemId'>>({
      query: payload => ({url: endpoint('CreateWorkEntry'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee', 'EmployeeOverview'],
    }),
    updateWorkEntry: builder.mutation<ICommandResponse, Partial<IWorkEntry> & {ItemId: string}>({
      query: payload => ({url: endpoint('UpdateWorkEntry'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee', 'EmployeeOverview'],
    }),
    deleteWorkEntry: builder.mutation<ICommandResponse, {ItemId: string}>({
      query: payload => ({url: endpoint('DeleteWorkEntry'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee', 'EmployeeOverview'],
    }),
    createPaymentEntry: builder.mutation<ICommandResponse, Omit<IPaymentEntry, 'ItemId'>>({
      query: payload => ({url: endpoint('CreatePaymentEntry'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee', 'EmployeeOverview'],
    }),
    updatePaymentEntry: builder.mutation<ICommandResponse, Partial<IPaymentEntry> & {ItemId: string}>({
      query: payload => ({url: endpoint('UpdatePaymentEntry'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee', 'EmployeeOverview'],
    }),
    deletePaymentEntry: builder.mutation<ICommandResponse, {ItemId: string}>({
      query: payload => ({url: endpoint('DeletePaymentEntry'), method: 'POST', body: payload}),
      invalidatesTags: ['Employee', 'EmployeeOverview'],
    }),
    submitFeedback: builder.mutation<ICommandResponse, {TargetType: 'work' | 'payment'; TargetId: string; Explanation: string}>({
      query: payload => ({url: endpoint('SubmitFeedback'), method: 'POST', body: payload}),
      invalidatesTags: ['EmployeeOverview', 'EmployeeNotification'],
    }),
    resolveFeedback: builder.mutation<ICommandResponse, {FeedbackId: string; Status: 'accepted' | 'declined'; ResolutionNote: string}>({
      query: payload => ({url: endpoint('ResolveFeedback'), method: 'POST', body: payload}),
      invalidatesTags: ['EmployeeOverview', 'EmployeeNotification'],
    }),
    listEmployeeNotifications: builder.query<IPaginatedEmployeeResponse<IEmployeeFeedback>, {Status?: 'all' | 'unread'; Page?: number; Size?: number}>({
      query: payload => ({url: endpoint('ListNotifications'), method: 'POST', body: {Status: 'unread', Page: 1, Size: 20, ...payload}}),
      providesTags: ['EmployeeNotification'],
    }),
    markEmployeeNotificationRead: builder.mutation<ICommandResponse, {FeedbackId: string}>({
      query: payload => ({url: endpoint('MarkNotificationRead'), method: 'POST', body: payload}),
      invalidatesTags: ['EmployeeNotification'],
    }),
  }),
});

export const {
  useListEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeactivateEmployeeMutation,
  useGetEmployeeOverviewQuery,
  useListEmployeeBatchesQuery,
  useCreateWorkEntryMutation,
  useUpdateWorkEntryMutation,
  useDeleteWorkEntryMutation,
  useCreatePaymentEntryMutation,
  useUpdatePaymentEntryMutation,
  useDeletePaymentEntryMutation,
  useSubmitFeedbackMutation,
  useResolveFeedbackMutation,
  useListEmployeeNotificationsQuery,
  useMarkEmployeeNotificationReadMutation,
} = employeeApi;
