import TextWrapper from '@components/text/TextWrapper';
import {IconButton, Skeleton} from '@mui/material';
import {
  IconChevronLeft,
  IconChevronRight,
  IconCopy,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import {useState} from 'react';
import moment from 'moment';
import {useTheme} from '@mui/material/styles';
import {Box} from '@mui/material';
import EmptyTableState, {
  type EmptyTableStateProps,
} from '@components/empty-state/EmptyTableState';
import {TableSkeleton} from '@components/loaders/AdminSkeleton';

// Define types for table columns and data
interface Column {
  key: string; // Unique key for data access
  label: string; // Column header label
  altKey?: string; // Unique key for data access
}

interface TableProps<T> {
  columns: Column[]; // Array of columns
  data: T[]; // Array of data objects
  totalCount?: number; // Optional total count for pagination
  rowsPerPage?: number; // Optional pagination setting
  handleRowClick?: (row: T, isDelete: boolean, isGoDetails?: boolean) => void; // Optional row click handler
  handleCloneClick?: (row: T) => void; // Optional clone action handler
  showActionButtons?: boolean; // Optional flag to show actions column
  showCloneButton?: boolean; // Optional flag to show clone action
  isRowClickable?: boolean; // Optional flag to make row clickable
  hidePagination?: boolean; // Optional flag to hide pagination
  handlePageSelection?: (page: number) => void; // Optional page selection handler
  currentPage?: number; // Optional current page for server-side pagination
  isServerPaginated?: boolean; // Optional flag to use external pagination state
  renderRowActions?: (row: T) => React.ReactNode;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyState?: EmptyTableStateProps;
}

const CustomTable = <T extends object>({
  columns,
  data,
  totalCount = data.length,
  rowsPerPage = 5,
  handleRowClick = () => undefined,
  handleCloneClick,
  showActionButtons = false,
  showCloneButton = false,
  isRowClickable = false,
  hidePagination = false,
  handlePageSelection = () => undefined,
  currentPage: externalCurrentPage = 1,
  isServerPaginated = false,
  renderRowActions,
  isLoading = false,
  skeletonRows = 6,
  emptyState,
}: TableProps<T>) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const activePage = isServerPaginated ? externalCurrentPage : currentPage;
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
  const tableBorderColor = theme.vars.palette.divider;

  // Get current page data
  const currentData = isServerPaginated
    ? data
    : data.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);

  const getContent = (row: T, col: Column) => {
    const record = row as Record<string, unknown>;
    if (record[col.key] == null || record[col.key] == '') {
      return String(col.altKey ? (record[col.altKey] ?? 'N/A') : 'N/A');
    }
    return String(record[col.key]);
  };

  const formatContent = (row: T, col: Column) =>
    col.key.includes('Date')
      ? moment(String((row as Record<string, unknown>)[col.key])).format(
          'DD/MM/YYYY',
        )
      : getContent(row, col);

  const selectRow = (row: T) => {
    if (isRowClickable) handleRowClick(row, false, true);
  };

  const renderActions = (row: T) => (
    <div
      className="flex items-center justify-end gap-1"
      onClick={event => event.stopPropagation()}>
      <IconButton
        aria-label="Edit record"
        onClick={() => handleRowClick(row, false)}
        size="small"
        sx={{width: '44px', height: '44px'}}>
        <IconEdit size={20} color={theme.vars.palette.success.main} />
      </IconButton>
      {showCloneButton && handleCloneClick && (
        <IconButton
          aria-label="Clone record"
          onClick={() => handleCloneClick(row)}
          size="small"
          sx={{width: '44px', height: '44px'}}>
          <IconCopy size={20} color={theme.vars.palette.primary.main} />
        </IconButton>
      )}
      {renderRowActions?.(row)}
      <IconButton
        aria-label="Delete record"
        onClick={() => handleRowClick(row, true)}
        size="small"
        sx={{width: '44px', height: '44px'}}>
        <IconTrash size={20} color={theme.vars.palette.error.main} />
      </IconButton>
    </div>
  );

  return (
    <>
      <div
        className="w-full rounded-xl p-0 shadow-none md:rounded-lg md:p-4 md:shadow-lg"
        style={{
          backgroundColor: theme.vars.palette.background.paper,
          color: theme.vars.palette.text.primary,
        }}>
        <Box
          sx={{
            display: {xs: 'none', md: 'block'},
            width: '100%',
            overflowX: 'auto',
          }}>
          <table
            className="w-full min-w-[680px] rounded-sm border"
            style={{borderColor: tableBorderColor}}
            aria-busy={isLoading}>
            <thead
              style={{backgroundColor: theme.vars.palette.background.neutral}}>
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    className="border px-4 py-2 text-left"
                    style={{borderColor: tableBorderColor}}>
                    <TextWrapper variant={'H6'} content={col.label} />
                  </th>
                ))}
                {showActionButtons && (
                  <th
                    colSpan={columns.length}
                    className="border px-4 py-2"
                    style={{borderColor: tableBorderColor}}>
                    <TextWrapper variant={'H6'} content={'ACTION'} />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableSkeleton
                  columns={columns.length + (showActionButtons ? 1 : 0)}
                  rows={skeletonRows}
                />
              ) : (
                currentData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    style={{transition: 'background-color 120ms ease'}}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor =
                        theme.vars.palette.action.selected;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}>
                    {columns.map(col => (
                      <td
                        key={col.key}
                        className={`border px-4 py-2 ${isRowClickable ? 'cursor-pointer' : ''}`}
                        style={{borderColor: tableBorderColor}}
                        onClick={() =>
                          isRowClickable && handleRowClick(row, false, true)
                        }>
                        <TextWrapper
                          variant={'Body1'}
                          content={formatContent(row, col)}
                        />
                      </td>
                    ))}
                    {showActionButtons && (
                      <td
                        key={'action' + rowIndex}
                        colSpan={columns.length}
                        className="border px-4 py-2"
                        style={{borderColor: tableBorderColor}}>
                        {renderActions(row)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>

        <Box
          sx={{display: {xs: 'grid', md: 'none'}, gap: '10px'}}
          aria-busy={isLoading}>
          {isLoading
            ? Array.from({length: Math.min(skeletonRows, 4)}, (_, index) => (
                <Box
                  data-testid="mobile-table-loading-card"
                  key={index}
                  sx={{
                    border: '1px solid',
                    borderColor: tableBorderColor,
                    borderRadius: '14px',
                    padding: '14px',
                  }}>
                  <Skeleton width="52%" height={24} />
                  <Skeleton width="84%" height={20} />
                  <Skeleton width="68%" height={20} />
                </Box>
              ))
            : currentData.map((row, rowIndex) => (
                <Box
                  component="article"
                  key={rowIndex}
                  sx={theme => ({
                    width: '100%',
                    border: '1px solid',
                    borderColor: tableBorderColor,
                    borderRadius: '14px',
                    padding: '14px',
                    color: theme.vars.palette.text.primary,
                    backgroundColor: theme.vars.palette.background.paper,
                  })}>
                  <Box
                    component={isRowClickable ? 'button' : 'div'}
                    type={isRowClickable ? 'button' : undefined}
                    onClick={() => selectRow(row)}
                    aria-label={
                      isRowClickable
                        ? `View ${formatContent(row, columns[0])}`
                        : undefined
                    }
                    sx={{
                      display: 'grid',
                      gap: '10px',
                      width: '100%',
                      padding: 0,
                      border: 0,
                      borderRadius: '8px',
                      color: 'inherit',
                      background: 'transparent',
                      textAlign: 'left',
                      cursor: isRowClickable ? 'pointer' : 'default',
                      '&:focus-visible': {
                        outline: '3px solid',
                        outlineColor: 'primary.main',
                        outlineOffset: '3px',
                      },
                    }}>
                    {columns.map((col, columnIndex) => (
                      <Box
                        key={col.key}
                        sx={{
                          display: 'grid',
                          gridTemplateColumns:
                            columnIndex === 0 ? '1fr' : 'minmax(92px, 38%) 1fr',
                          gap: '10px',
                          alignItems: 'start',
                          paddingBottom:
                            columnIndex === columns.length - 1 ? 0 : '9px',
                          borderBottom:
                            columnIndex === columns.length - 1
                              ? 'none'
                              : '1px solid',
                          borderColor: tableBorderColor,
                        }}>
                        {columnIndex === 0 ? (
                          <Box>
                            <TypographyLabel label={col.label} />
                            <Box
                              sx={{
                                fontSize: '16px',
                                fontWeight: 700,
                                marginTop: '2px',
                                overflowWrap: 'anywhere',
                              }}>
                              {formatContent(row, col)}
                            </Box>
                          </Box>
                        ) : (
                          <>
                            <TypographyLabel label={col.label} />
                            <Box
                              sx={{
                                fontSize: '14px',
                                fontWeight: 600,
                                overflowWrap: 'anywhere',
                              }}>
                              {formatContent(row, col)}
                            </Box>
                          </>
                        )}
                      </Box>
                    ))}
                  </Box>
                  {showActionButtons && (
                    <Box
                      sx={{
                        marginTop: '10px',
                        paddingTop: '4px',
                        borderTop: '1px solid',
                        borderColor: tableBorderColor,
                      }}>
                      {renderActions(row)}
                    </Box>
                  )}
                </Box>
              ))}
        </Box>

        {!isLoading && currentData.length === 0 && (
          <EmptyTableState {...emptyState} />
        )}

        {/* Pagination Controls */}
        {!isLoading && currentData.length > 0 && !hidePagination && (
          <div className="mt-4 flex items-center justify-between gap-2 md:gap-3">
            <button
              aria-label="Previous page"
              onClick={() => {
                const nextPage = Math.max(activePage - 1, 1);
                if (!isServerPaginated) {
                  setCurrentPage(nextPage);
                }
                handlePageSelection(nextPage);
              }}
              disabled={activePage === 1}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 md:px-4 ${activePage === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              style={{
                backgroundColor: theme.vars.palette.background.neutral,
                color: theme.vars.palette.text.primary,
              }}>
              <IconChevronLeft className="md:hidden" size={20} />
              <span className="hidden md:inline">Previous</span>
            </button>

            <span
              className="text-sm font-medium"
              style={{color: theme.vars.palette.text.secondary}}>
              Page {activePage} of {totalPages}
            </span>

            <button
              aria-label="Next page"
              onClick={() => {
                const nextPage = Math.min(activePage + 1, totalPages);
                if (!isServerPaginated) {
                  setCurrentPage(nextPage);
                }
                handlePageSelection(nextPage);
              }}
              disabled={activePage === totalPages}
              className={`flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 md:px-4 ${activePage === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              style={{
                backgroundColor: theme.vars.palette.background.neutral,
                color: theme.vars.palette.text.primary,
              }}>
              <span className="hidden md:inline">Next</span>
              <IconChevronRight className="md:hidden" size={20} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

function TypographyLabel({label}: Readonly<{label: string}>) {
  return (
    <Box
      sx={{
        fontSize: '11px',
        lineHeight: 1.3,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'text.secondary',
      }}>
      <TextWrapper variant="Body2" content={label} />
    </Box>
  );
}

export default CustomTable;
