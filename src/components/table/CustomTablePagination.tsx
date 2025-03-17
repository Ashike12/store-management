import TextWrapper from '@components/text/TextWrapper';
import cn from '@core/utils/cn';
import {Pagination, styled, TablePaginationOwnProps} from '@mui/material';

interface ICustomTablePaginationProps
  extends Omit<TablePaginationOwnProps, 'onPageChange'> {
  className?: string;
  onPageChangeFn: (newPage: number) => void;
}

const StyledPagination = styled(Pagination)(() => ({
  '& .MuiPaginationItem-previousNext': {
    color: '#2E65CE',
    padding: '6px !important',
    borderRadius: '2px !important',
  },
  '& .Mui-disabled': {
    color: '#CCD2D8',
  },
  '& .MuiPaginationItem-root': {
    fontSize: '12px',
    padding: '6px !important',
    borderRadius: '2px !important',
  },
  '& .Mui-selected': {
    backgroundColor: '#919EAB1F !important',
    color: '#212B36',
    '&:hover': {
      backgroundColor: '#919EAB1F !important',
    },
  },
}));

export default function CustomTablePagination({
  className,
  count,
  page,
  rowsPerPage,
  onPageChangeFn,
}: Readonly<ICustomTablePaginationProps>) {
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    onPageChangeFn(value - 1);
  };
  const getPageNumberText = () => {
    const pageNumber = page + 1;
    const firstRowNumberInCurrentPage = page * rowsPerPage + 1;
    const lastRowNumberInCurrentPage = pageNumber * rowsPerPage;
    return `${firstRowNumberInCurrentPage}-${lastRowNumberInCurrentPage} of ${count}`;
  };
  return (
    <section
      className={cn('flex w-full items-center justify-between', className)}>
      <TextWrapper
        content={getPageNumberText()}
        variant={'Caption'}
        className="text-text-secondary"
      />
      <StyledPagination
        count={Math.ceil(count / rowsPerPage)}
        size={'medium'}
        shape="rounded"
        color={'standard'}
        page={page + 1}
        onChange={handlePageChange}
      />
    </section>
  );
}
