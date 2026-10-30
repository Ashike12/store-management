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

const renderTable = (props: Partial<React.ComponentProps<typeof CustomTable<{name: string; quantity: number}>>>) =>
  render(
    <ThemeProvider>
      <CustomTable columns={columns} data={[]} {...props} />
    </ThemeProvider>,
  );

describe('CustomTable states', () => {
  it('keeps the table structure visible while data is loading', () => {
    renderTable({isLoading: true, skeletonRows: 3});

    expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
    expect(document.querySelectorAll('.MuiSkeleton-root')).toHaveLength(6);
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

    expect(screen.getByText('Bonafide net')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
