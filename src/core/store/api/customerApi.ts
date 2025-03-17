import {createApi} from '@reduxjs/toolkit/query/react';
import {ApiServiceBaseQuery} from './baseQueries';
import {SINGLE_CUSTOMER_DATA} from '../mockData/customer';
import {
  ICustomer,
  ICustomerResponse,
} from '@core/interfaces/api/customer.model';
import {APP_CONFIG} from '@core/config/config';

const paths = {
  partner: APP_CONFIG.version1 + 'partner/',
};

export const customerApi = createApi({
  reducerPath: 'customerApi',
  baseQuery: ApiServiceBaseQuery, // Empty baseQuery (no base URL here)
  tagTypes: ['customer'],
  keepUnusedDataFor: 120, //  Keep unused data in cache for 120 seconds (2 mins)
  endpoints: builder => ({
    // GET User List
    getCustomerById: builder.query<ICustomer, string>({
      query: id => paths.partner + `partner/${id}`,
      providesTags: (result, error, id) => [{type: 'customer', id}], // Cache by ID
      transformResponse: (response: ICustomer) => {
        const {name, vorname} = response;
        return {...response, fullName: `${vorname} ${name}`} as ICustomer;
      },
    }),
  }),
});

export const {useGetCustomerByIdQuery} = customerApi;
