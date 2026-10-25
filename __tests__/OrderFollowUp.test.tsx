import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {transferableAbortController} from 'node:util';
import {act, cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import OrderFollowUp from '../src/components/header/OrderFollowUp';
import {FollowUpOrder, OrderStatus, ordersApi} from '../src/core/store/api/ordersApi';
import i18n from '../src/core/services/i18n.service';
import {enOrderFollowUp, bnOrderFollowUp, zhOrderFollowUp} from '../src/assets/i18n/orderFollowUp';

// Exercise the real base query, but never use configured/live backend addresses.
vi.mock('@core/config/config', () => ({
  APP_CONFIG: {baseUrl: 'https://mock.invalid', businessUrl: 'https://mock.invalid'},
}));

const initialOrder: FollowUpOrder = {
  _id: 'order-1', OrderNumber: 'MAN-001', CustomerName: 'Test Customer',
  PhoneNumber: '01712345678', Address: '12 Test Road', Area: 'Test Area',
  District: 'Dhaka', Division: 'Dhaka', TotalAmount: 1250, ShippingCost: 80,
  OrderStatus: 'pending', PaymentStatus: 'unpaid', PaymentHandling: 'manual',
  RequiresImmediateAction: true, Version: 3,
  Items: [{ProductName: 'Test rice', Quantity: 2, UnitPrice: 585}],
};

type Body = Record<string, unknown>;
type RequestRecord = {endpoint: string; body: Body; authorization: string | null};
let requests: RequestRecord[];
let order: FollowUpOrder;
let listFailure: number;
let detailFailure: number;
let transitionFailure: number;
let totalCount: number;
let holdList: boolean;
let holdTransition: boolean;
let releaseList: (() => void) | undefined;
let releaseTransition: (() => void) | undefined;
const token = (roles: string[]) => `test.${btoa(JSON.stringify({Roles: roles}))}.signature`;
const stores: ReturnType<typeof makeStore>[] = [];

function makeStore(roles: string[] = ['admin']) {
  const store = configureStore({
    reducer: {
      persisted: (state = {auth: {login_token: token(roles), refresh_token: 'mock'}},
        action: {type: string}) => action.type === 'test/logout'
          ? {auth: {login_token: token([]), refresh_token: ''}} : state,
      [ordersApi.reducerPath]: ordersApi.reducer,
    },
    middleware: defaults => defaults().concat(ordersApi.middleware),
  });
  return store;
}

function mount(roles?: string[]) {
  const store = makeStore(roles);
  stores.push(store);
  render(<Provider store={store}><ThemeProvider theme={createTheme()}>
    <OrderFollowUp />
  </ThemeProvider></Provider>);
  return store;
}

async function openQueue() {
  const trigger = await screen.findByRole('button', {name: 'Order follow-up: 1'});
  trigger.focus();
  fireEvent.click(trigger);
  return screen.findByRole('button', {name: 'Review order MAN-001'});
}

async function review() {
  fireEvent.click(await openQueue());
  await screen.findByRole('textbox', {name: 'Follow-up note'});
}

beforeEach(async () => {
  await i18n.changeLanguage('en');
  // Node's Request requires a Node signal rather than jsdom's AbortSignal.
  vi.stubGlobal('AbortController', class {
    constructor() {return transferableAbortController();}
  });
  requests = [];
  order = {...initialOrder};
  listFailure = detailFailure = transitionFailure = 0;
  totalCount = 1;
  holdList = holdTransition = false;
  releaseList = releaseTransition = undefined;
  const storage = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
    clear: () => storage.clear(),
  });
  localStorage.setItem('access_token', token(['admin']));
  // Every request is intercepted. Unknown endpoints throw rather than falling through.
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
    const request = input as Request;
    expect(new URL(request.url).origin).toBe('https://mock.invalid');
    expect(request.method).toBe('POST');
    const endpoint = new URL(request.url).pathname.split('/').pop()!;
    const body = await request.json() as Body;
    requests.push({endpoint, body, authorization: request.headers.get('Authorization')});
    const response = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
      status, headers: {'Content-Type': 'application/json'},
    });
    if (endpoint === 'ListOrders') {
      if (holdList) await new Promise<void>(resolve => {releaseList = resolve;});
      if (listFailure) return response({IsSuccess: false}, listFailure);
      const pending = order.RequiresImmediateAction && body.Page === 1;
      return response({IsSuccess: true, Data: pending ? [order] : [],
        TotalCount: order.RequiresImmediateAction ? totalCount : 0});
    }
    if (endpoint === 'GetOrder') {
      if (detailFailure) return response({IsSuccess: false}, detailFailure);
      return response({IsSuccess: true, Data: order});
    }
    if (endpoint === 'TransitionOrder') {
      if (holdTransition) await new Promise<void>(resolve => {releaseTransition = resolve;});
      if (transitionFailure) return response({IsSuccess: false, Message: 'Stock unavailable'}, transitionFailure);
      order = {...order, OrderStatus: String(body.Status) as OrderStatus, RequiresImmediateAction: false,
        Version: order.Version + 1};
      return response({IsSuccess: true, Data: order});
    }
    throw new Error(`Unmocked request: ${endpoint}`);
  }));
});

afterEach(() => {
  cleanup();
  stores.splice(0).forEach(store => store.dispatch(ordersApi.util.resetApiState()));
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('admin manual order follow-up (mocked HTTP only)', () => {
  it.each([
    {language: 'bn', locale: 'bn-BD', copy: bnOrderFollowUp, confirm: 'অর্ডার নিশ্চিত করুন'},
    {language: 'zh', locale: 'zh-CN', copy: zhOrderFollowUp, confirm: '确认订单'},
  ])('switches live to $language including accessible labels, BDT, errors and feedback', async ({language, locale, copy, confirm}) => {
    transitionFailure = 409;
    mount();
    await review();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: 'Customer called'}});
    await act(async () => {await i18n.changeLanguage(language);});
    expect(screen.getByRole('dialog', {name: copy.title})).toHaveAccessibleDescription(copy.description);
    expect(screen.getByRole('button', {name: confirm})).toBeEnabled();
    expect(screen.getByRole('button', {name: copy.cancel})).toBeEnabled();
    expect(screen.getByRole('textbox', {name: copy.note})).toHaveValue('Customer called');
    expect(screen.getByRole('list', {name: copy.items})).toHaveTextContent('Test rice');
    expect(screen.getByRole('link', {name: copy.call.replace('{{phone}}', initialOrder.PhoneNumber)}))
      .toHaveAttribute('href', 'tel:01712345678');
    expect(screen.getByText(copy.payment.replace('{{status}}', copy.statuses.pending))).toBeInTheDocument();
    const money = (value: number) => new Intl.NumberFormat(locale, {style: 'currency', currency: 'BDT'}).format(value);
    expect(screen.getByText(copy.totals.replace('{{total}}', money(1250)).replace('{{shipping}}', money(80)),
      {exact: true, collapseWhitespace: false})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', {name: copy.confirm}));
    await screen.findByText(copy.conflict);
    expect(screen.getByRole('button', {name: copy.confirm})).toBeDisabled();
    // Existing feedback must translate too, not remain in the language at request time.
    await act(async () => {await i18n.changeLanguage('en');});
    expect(screen.getByText(enOrderFollowUp.conflict)).toBeInTheDocument();
    await act(async () => {await i18n.changeLanguage(language);});
    transitionFailure = 500;
    const reload = screen.getByRole('button', {name: copy.reload});
    await waitFor(() => expect(reload).toBeEnabled());
    fireEvent.click(reload);
    await waitFor(() => expect(screen.getByRole('button', {name: copy.cancel})).toBeEnabled());
    fireEvent.click(screen.getByRole('button', {name: copy.cancel}));
    await screen.findByText(copy.actionError);
    transitionFailure = 0;
    await waitFor(() => expect(screen.getByRole('button', {name: copy.reload})).toBeEnabled());
    fireEvent.click(screen.getByRole('button', {name: copy.reload}));
    await waitFor(() => expect(screen.getByRole('button', {name: copy.cancel})).toBeEnabled());
    fireEvent.click(screen.getByRole('button', {name: copy.cancel}));
    await screen.findByText(copy.cancelledMessage.replace('{{number}}', 'MAN-001'));
    await screen.findByText(copy.empty);
    await act(async () => {await i18n.changeLanguage('en');});
    expect(screen.getByText('Order MAN-001 cancelled.')).toBeInTheDocument();
    expect(requests.filter(r => r.endpoint === 'TransitionOrder').at(-1)?.body).toEqual({
      ItemId: 'order-1', Status: 'cancelled', ExpectedVersion: 3, Note: 'Customer called',
    });
    expect(order.PaymentStatus).toBe('unpaid');
  });

  it.each([
    {language: 'bn', copy: bnOrderFollowUp, digit: '১'},
    {language: 'zh', copy: zhOrderFollowUp, digit: '1'},
  ])('localizes the $language queue, pagination and retry states', async ({language, copy, digit}) => {
    await i18n.changeLanguage(language);
    listFailure = 500;
    mount();
    fireEvent.click(await screen.findByRole('button', {name: copy.indicator.replace('{{value}}', copy.unavailable)}));
    await screen.findByText(copy.listError);
    expect(screen.getByText(copy.countError)).toBeInTheDocument();
    listFailure = 0;
    fireEvent.click(screen.getByRole('button', {name: copy.retryCount}));
    fireEvent.click(screen.getByRole('button', {name: copy.retry}));
    await screen.findByRole('button', {name: copy.reviewLabel.replace('{{number}}', 'MAN-001')});
    expect(screen.getByText(copy.page.replace('{{page}}', digit))).toBeInTheDocument();
    expect(screen.getByRole('button', {name: copy.previous})).toBeDisabled();
    expect(screen.getByRole('button', {name: copy.next})).toBeDisabled();
    expect(screen.getByRole('button', {name: copy.close})).toBeEnabled();
  });

  it('provides every follow-up key and interpolation in all three registered locales', () => {
    for (const language of ['en', 'bn', 'zh']) {
      const copy = i18n.getResource(language, 'translation', 'ORDER_FOLLOW_UP');
      expect(Object.keys(copy).sort()).toEqual(Object.keys(enOrderFollowUp).sort());
      for (const [key, value] of Object.entries(enOrderFollowUp)) {
        if (typeof value === 'string') {
          expect(copy[key]).toBeTruthy();
          expect(copy[key].match(/{{\w+}}/g)).toEqual(value.match(/{{\w+}}/g));
        } else {
          expect(Object.keys(copy[key]).sort()).toEqual(Object.keys(value).sort());
        }
      }
    }
  });

  it.each([{roles: []}, {roles: ['wholesaler']}, {roles: ['customer']}])('does not render or request orders for roles $roles', async ({roles}) => {
    mount(roles);
    await act(async () => {});
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('polls the authenticated action count every 30 seconds and stops on unmount', async () => {
    vi.useFakeTimers();
    mount();
    await act(async () => {await vi.advanceTimersByTimeAsync(100);});
    expect(requests).toHaveLength(1);
    expect(requests[0]).toEqual({endpoint: 'ListOrders', body: {Page: 1, Size: 1, NeedsAction: true},
      authorization: `Bearer ${token(['admin'])}`});
    await act(async () => {await vi.advanceTimersByTimeAsync(29899);});
    expect(requests).toHaveLength(1);
    await act(async () => {await vi.advanceTimersByTimeAsync(101);});
    expect(requests).toHaveLength(2);
    cleanup();
    await act(async () => {await vi.advanceTimersByTimeAsync(60000);});
    expect(requests).toHaveLength(2);
  });

  it('shows delivery, totals, click-to-call and an accessible dialog with focus restoration', async () => {
    mount();
    await openQueue();
    const dialog = screen.getByRole('dialog', {name: 'Order follow-up'});
    expect(dialog).toHaveAccessibleDescription(/Call the customer/);
    expect(screen.getByRole('link', {name: 'Call 01712345678'})).toHaveAttribute('href', 'tel:01712345678');
    expect(screen.getByText(/12 Test Road, Test Area, Dhaka, Dhaka/)).toBeInTheDocument();
    expect(screen.getByText(/Total:.*1,250.*Delivery charge:.*80/)).toBeInTheDocument();
    expect(screen.getByText(/Manual payment handling; payment not recorded as paid/)).toBeInTheDocument();
    expect(requests.some(r => r.body.Size === 10 && r.body.NeedsAction === true)).toBe(true);
    fireEvent.keyDown(dialog, {key: 'Escape'});
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('button', {name: 'Order follow-up: 1'})).toHaveFocus();
  });

  it('uses a full-screen dialog at mobile widths', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
      matches: true, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    })));
    mount();
    await openQueue();
    expect(screen.getByRole('dialog')).toHaveClass('MuiDialog-paperFullScreen');
  });

  it('shows initial loading and the empty queue', async () => {
    holdList = true;
    order.RequiresImmediateAction = false;
    mount();
    expect(screen.getByRole('button', {name: 'Order follow-up: loading'})).toBeInTheDocument();
    await waitFor(() => expect(releaseList).toBeDefined());
    holdList = false;
    await act(async () => {releaseList?.();});
    fireEvent.click(await screen.findByRole('button', {name: 'Order follow-up: 0'}));
    expect(await screen.findByText('No orders need follow-up.')).toBeInTheDocument();
  });

  it('offers retry for count and list failures, including HTTP 200 business failure', async () => {
    listFailure = 200;
    mount();
    fireEvent.click(await screen.findByRole('button', {name: 'Order follow-up: unavailable'}));
    await screen.findByText('Could not load pending orders.');
    expect(screen.getByText('Follow-up count is unavailable.')).toBeInTheDocument();
    listFailure = 0;
    fireEvent.click(screen.getByRole('button', {name: 'Retry'}));
    fireEvent.click(screen.getByRole('button', {name: 'Retry count'}));
    await screen.findByRole('button', {name: 'Review order MAN-001'});
    await waitFor(() => expect(screen.queryByText('Follow-up count is unavailable.')).not.toBeInTheDocument());
  });

  it('paginates pending orders', async () => {
    totalCount = 11;
    mount();
    fireEvent.click(await screen.findByRole('button', {name: 'Order follow-up: 11'}));
    await screen.findByRole('button', {name: 'Review order MAN-001'});
    fireEvent.click(screen.getByRole('button', {name: 'Next'}));
    await screen.findByText('No more orders on this page. Return to the previous page.');
    expect(requests.some(r => r.body.Page === 2 && r.body.Size === 10)).toBe(true);
    fireEvent.click(screen.getByRole('button', {name: 'Previous'}));
    await screen.findByRole('button', {name: 'Review order MAN-001'});
  });

  it.each(['confirmed', 'cancelled'] as const)('sends note and current version for %s and refreshes the count', async status => {
    mount();
    await review();
    fireEvent.change(screen.getByRole('textbox'), {target: {value: '  Called customer  '}});
    fireEvent.click(screen.getByRole('button', {name: status === 'confirmed' ? 'Confirm order' : 'Cancel order'}));
    await screen.findByText(`Order MAN-001 ${status}.`);
    expect(requests.find(r => r.endpoint === 'GetOrder')?.body).toEqual({ItemId: 'order-1'});
    expect(requests.find(r => r.endpoint === 'TransitionOrder')?.body).toEqual({
      ItemId: 'order-1', Status: status, ExpectedVersion: 3, Note: 'Called customer',
    });
    await screen.findByText('No orders need follow-up.');
    expect(order.PaymentStatus).toBe('unpaid');
    expect(order.PaymentHandling).toBe('manual');
    await waitFor(() => expect(screen.getByText('Order follow-up: 0')).toBeInTheDocument());
  });

  it('blocks duplicate actions and closing while the mutation is pending', async () => {
    holdTransition = true;
    mount();
    await review();
    const confirm = screen.getByRole('button', {name: 'Confirm order'});
    act(() => {
      confirm.click();
      confirm.click();
    });
    await screen.findByText('Saving order action...');
    expect(screen.getByRole('button', {name: 'Confirm order'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Cancel order'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeDisabled();
    fireEvent.keyDown(screen.getByRole('dialog'), {key: 'Escape'});
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await waitFor(() => expect(releaseTransition).toBeDefined());
    await act(async () => {releaseTransition?.();});
    await screen.findByText('Order MAN-001 confirmed.');
    expect(requests.filter(r => r.endpoint === 'TransitionOrder')).toHaveLength(1);
  });

  it.each([409, 500, 200])('requires reload after mutation failure %i and retries with fresh version', async status => {
    transitionFailure = status;
    mount();
    await review();
    fireEvent.click(screen.getByRole('button', {name: 'Confirm order'}));
    await screen.findByText(status === 409 ? /Order changed or stock is unavailable/ : /The action could not be completed/);
    expect(screen.getByRole('button', {name: 'Confirm order'})).toBeDisabled();
    order = {...order, Version: 7};
    transitionFailure = 0;
    const reload = screen.getByRole('button', {name: 'Reload order for review'});
    await waitFor(() => expect(reload).toBeEnabled());
    fireEvent.click(reload);
    await waitFor(() => expect(screen.getByRole('button', {name: 'Confirm order'})).toBeEnabled());
    fireEvent.click(screen.getByRole('button', {name: 'Confirm order'}));
    await screen.findByText('Order MAN-001 confirmed.');
    expect(requests.filter(r => r.endpoint === 'TransitionOrder').at(-1)?.body.ExpectedVersion).toBe(7);
  });

  it('retries detail errors and prevents acting on an already handled order', async () => {
    detailFailure = 500;
    mount();
    fireEvent.click(await openQueue());
    await screen.findByText('Could not load current order.');
    expect(screen.getByRole('button', {name: 'Confirm order'})).toBeDisabled();
    detailFailure = 0;
    order.RequiresImmediateAction = false;
    fireEvent.click(screen.getByRole('button', {name: 'Retry'}));
    await screen.findByText('This order no longer needs follow-up.');
    expect(screen.getByRole('button', {name: 'Confirm order'})).toBeDisabled();
    expect(screen.getByRole('button', {name: 'Cancel order'})).toBeDisabled();
  });

  it('removes the open dialog immediately when the admin role is lost', async () => {
    const store = mount();
    await openQueue();
    act(() => {store.dispatch({type: 'test/logout'});});
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows item quantities/prices and limits submitted notes to 1000 characters', async () => {
    mount();
    await review();
    expect(screen.getByRole('list', {name: 'Order items'})).toHaveTextContent('Test rice');
    expect(screen.getByText(/Quantity: 2.*Unit price:.*585/)).toBeInTheDocument();
    const note = screen.getByRole('textbox', {name: 'Follow-up note'});
    expect(note).toHaveAttribute('maxlength', '1000');
    fireEvent.change(note, {target: {value: 'x'.repeat(1001)}});
    expect(note).toHaveValue('x'.repeat(1000));
    fireEvent.click(screen.getByRole('button', {name: 'Cancel order'}));
    await screen.findByText('Order MAN-001 cancelled.');
    expect(requests.find(r => r.endpoint === 'TransitionOrder')?.body.Note).toBe('x'.repeat(1000));
  });
});
