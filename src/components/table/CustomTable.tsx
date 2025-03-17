import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import {
  Checkbox,
  Paper,
  TableFooter,
  TableHead,
  TableSortLabel,
} from '@mui/material';
import {useMemo, useState} from 'react';
import CustomTablePagination from './CustomTablePagination';
import {StyledTableCell, StyledTableRow} from './table-styles';
import {ICustomTableProps, Order} from '@core/interfaces/table.interface';
import CustomTableHead from './CustomTableHead';
import {getComparator} from '@core/utils/tableUtils';
import TextWrapper from '@components/text/TextWrapper';

export default function CustomTable<T extends object>({
  rows,
  columns,
  idField,
  initialSort = {field: columns[0].id, order: 'asc'},
  rowsPerPage = 5,
  enableSelection = true,
  onSelectionChange,
  onSortChange,
  onPageChange,
  customRowRenderer,
}: Readonly<ICustomTableProps<T>>) {
  const [order, setOrder] = useState<Order>(initialSort.order);
  const [orderBy, setOrderBy] = useState<keyof T>(initialSort.field);
  const [selected, setSelected] = useState<Array<T[keyof T]>>([]);
  const [page, setPage] = useState(0);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
    onPageChange?.(newPage);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    onSortChange?.(property, newOrder);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map(row => row[idField]);
      setSelected(newSelected);
      onSelectionChange?.(newSelected);
      return;
    }
    setSelected([]);
    onSelectionChange?.([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: T[keyof T]) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: Array<T[keyof T]> = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
  );

  const renderDefaultRow = (row: T, isSelected: boolean, labelId: string) => (
    <StyledTableRow
      hover
      onClick={
        enableSelection ? event => handleClick(event, row[idField]) : undefined
      }
      role={enableSelection ? 'checkbox' : undefined}
      aria-checked={isSelected}
      tabIndex={-1}
      key={String(row[idField])}
      selected={isSelected}
      sx={{cursor: enableSelection ? 'pointer' : 'default'}}>
      {enableSelection && (
        <StyledTableCell padding="checkbox">
          <Checkbox
            color="primary"
            disableRipple
            disableTouchRipple
            disableFocusRipple
            checked={isSelected}
            inputProps={{
              'aria-labelledby': labelId,
            }}
          />
        </StyledTableCell>
      )}
      {columns.map(column => (
        <StyledTableCell
          key={String(column.id)}
          align={'left'}
          padding={column.disablePadding ? 'none' : 'normal'}>
          {column.renderCell
            ? column.renderCell(row[column.id], row)
            : String(row[column.id])}
        </StyledTableCell>
      ))}
    </StyledTableRow>
  );
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '4px',
        '& .MuiTableBody-root': {
          borderBottomLeftRadius: '4px',
          borderBottomRightRadius: '4px',
        },
      }}>
      <Table aria-label="customized table">
        {enableSelection ? (
          <CustomTableHead
            numSelected={selected.length}
            order={order}
            orderBy={String(orderBy)}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            tableHeadCells={columns}
          />
        ) : (
          <TableHead className="border-transparent-grey-12 border">
            <TableRow>
              {columns.map(headCell => (
                <StyledTableCell
                  key={String(headCell.id)}
                  align={headCell.alignCell}
                  padding={headCell.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === headCell.id ? order : false}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={event => handleRequestSort(event, headCell.id)}>
                    <TextWrapper
                      content={headCell.label}
                      variant={'Overline'}
                      className="text-text-secondary"
                    />
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody className="border-transparent-grey-12 border">
          {visibleRows.map((row, index) => {
            const isItemSelected = selected.includes(row[idField]);
            const labelId = `enhanced-table-checkbox-${index}`;
            return customRowRenderer
              ? customRowRenderer(row, isItemSelected, labelId)
              : renderDefaultRow(row, isItemSelected, labelId);
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              sx={{paddingInline: 0}}
              colSpan={enableSelection ? columns.length + 1 : columns.length}>
              <CustomTablePagination
                count={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChangeFn={handleChangePage}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
