import {fireEvent, render, screen, waitFor, within} from '@testing-library/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import {describe, expect, it, vi} from 'vitest';
import {LedgerDialog} from './pages/employeeManagement';

const apiMocks = vi.hoisted(() => ({listBatches: vi.fn()}));

vi.mock('@core/store/api/employeeApi', async importOriginal => ({
  ...(await importOriginal<typeof import('@core/store/api/employeeApi')>()),
  useListEmployeeBatchesQuery: apiMocks.listBatches,
}));

const batch = {
  BatchId: 'BAT-BONAFIDE-001',
  ProductId: 'product-1',
  ProductName: 'Bonafide Net',
  Category: 'MosquitoNet',
  SubCategory: 'Double',
  QuantityReceived: 25,
  CreatedDate: '2026-10-30T10:00:00.000Z',
};

describe('employee work batch selector', () => {
  it('searches employee batches and submits the selected batch ID', async () => {
    apiMocks.listBatches.mockReturnValue({
      data: {IsSuccess: true, Data: [batch], TotalCount: 1},
      isFetching: false,
    });
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(
      <ThemeProvider theme={createTheme()}>
        <LedgerDialog
          state={{kind: 'work'}}
          employeeId="employee-1"
          onClose={vi.fn()}
          onSave={onSave}
        />
      </ThemeProvider>,
    );

    const selector = screen.getByLabelText('Related production batch (optional)');
    fireEvent.change(selector, {target: {value: 'Bonafide'}});
    await waitFor(() => expect(apiMocks.listBatches).toHaveBeenLastCalledWith(
      expect.objectContaining({EmployeeId: 'employee-1', SearchTerm: 'Bonafide'}),
      expect.objectContaining({skip: false}),
    ), {timeout: 1000});

    fireEvent.focus(selector);
    fireEvent.keyDown(selector, {key: 'ArrowDown'});
    fireEvent.click(await screen.findByRole('option', {name: /Bonafide Net/}));
    fireEvent.change(screen.getByLabelText(/Amount \(Tk\)/), {target: {value: '500'}});
    fireEvent.change(screen.getByLabelText(/Work description/), {target: {value: 'Stitched mosquito nets'}});
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', {name: 'Save'}));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      amount: '500',
      description: 'Stitched mosquito nets',
      reference: 'BAT-BONAFIDE-001',
    })));
  });
});
