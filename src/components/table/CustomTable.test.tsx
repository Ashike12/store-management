import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {ThemeProvider} from '../../theme/theme-provider';
import CustomTable from './CustomTable';

vi.mock('@core/hooks/useLocalization', () => ({
  default: ({content}: {content: string | number}) => content,
}));

const columns = [
  {key: 'name', label: 'Name'},
  {key: 'quantity', label: 'Quantity'},
];

const renderTable = (
  props: Partial<
    React.ComponentProps<typeof CustomTable<{name: string; quantity: number}>>
  >,
) =>
  render(
    <ThemeProvider>
      <CustomTable columns={columns} data={[]} {...props} />
    </ThemeProvider>,
  );

describe('CustomTable states', () => {
  it('keeps the table structure visible while data is loading', () => {
    renderTable({isLoading: true, skeletonRows: 3});

    const desktopTable = screen.getByRole('table');
    expect(desktopTable).toHaveAttribute('aria-busy', 'true');
    expect(desktopTable.querySelectorAll('.MuiSkeleton-root')).toHaveLength(6);
    expect(screen.getAllByTestId('mobile-table-loading-card')).toHaveLength(3);
    expect(screen.queryByText(/nothing to show yet/i)).not.toBeInTheDocument();
  });

  it('shows a descriptive empty state and invokes its action', () => {
    const onAction = vi.fn();
    renderTable({
      emptyState: {
        title: 'No products found',
        description: 'Add a product to get started.',
        actionLabel: 'Add product',
        onAction,
      },
    });

    expect(screen.getByRole('status')).toHaveTextContent('No products found');
    fireEvent.click(screen.getByRole('button', {name: 'Add product'}));
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.queryByText(/page 1 of/i)).not.toBeInTheDocument();
  });

  it('renders populated data without the empty state', () => {
    renderTable({data: [{name: 'Bonafide net', quantity: 12}]});

    expect(screen.getAllByText('Bonafide net')).toHaveLength(2);
    expect(screen.getAllByText('12')).toHaveLength(2);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('keeps mobile details and row actions as separate controls', () => {
    const handleRowClick = vi.fn();
    renderTable({
      data: [{name: 'Bonafide net', quantity: 12}],
      isRowClickable: true,
      showActionButtons: true,
      handleRowClick,
    });

    expect(document.querySelector('button button')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', {name: 'View Bonafide net'}));
    expect(handleRowClick).toHaveBeenLastCalledWith(
      {name: 'Bonafide net', quantity: 12},
      false,
      true,
    );

    fireEvent.click(
      screen.getAllByRole('button', {name: 'Edit record'}).at(-1)!,
    );
    expect(handleRowClick).toHaveBeenLastCalledWith(
      {name: 'Bonafide net', quantity: 12},
      false,
    );
  });
});
