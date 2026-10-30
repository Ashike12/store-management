import TextWrapper from "@components/text/TextWrapper";
import { IconButton } from "@mui/material";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import moment from "moment";
import {useTheme} from "@mui/material/styles";
import {Box} from "@mui/material";
import EmptyTableState, {type EmptyTableStateProps} from "@components/empty-state/EmptyTableState";
import {TableSkeleton} from "@components/loaders/AdminSkeleton";

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
    }

    return (
        <>
            <div
                className="p-4 rounded-lg shadow-lg"
                style={{
                    backgroundColor: theme.vars.palette.background.paper,
                    color: theme.vars.palette.text.primary,
                }}
            >
                <Box sx={{width: '100%', overflowX: 'auto'}}>
                <table className="w-full min-w-[680px] border rounded-sm" style={{borderColor: tableBorderColor}} aria-busy={isLoading}>
                    <thead style={{backgroundColor: theme.vars.palette.background.neutral}}>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key} className="border px-4 py-2 text-left" style={{borderColor: tableBorderColor}}>
                                    <TextWrapper variant={'H6'} content={col.label} />
                                </th>
                            ))}
                            {showActionButtons && (
                                <th colSpan={columns.length} className="border px-4 py-2" style={{borderColor: tableBorderColor}}>
                                    <TextWrapper variant={'H6'} content={'ACTION'} />
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <TableSkeleton columns={columns.length + (showActionButtons ? 1 : 0)} rows={skeletonRows} />
                        ) : currentData.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                style={{transition: 'background-color 120ms ease'}}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = theme.vars.palette.action.selected;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`border px-4 py-2 ${isRowClickable ? 'cursor-pointer' : ''}`}
                                        style={{borderColor: tableBorderColor}}
                                        onClick={() => isRowClickable && handleRowClick(row, false, true)}>
                                        {col.key.indexOf('Date') == -1 ? (<TextWrapper variant={'Body1'} content={getContent(row, col)} />) : moment(String((row as Record<string, unknown>)[col.key])).format("DD/MM/YYYY")}
                                    </td>
                                ))}
                                {showActionButtons && (
                                    <td key={'action' + rowIndex} colSpan={columns.length} className="border px-4 py-2" style={{borderColor: tableBorderColor}}>
                                        <IconButton onClick={() => handleRowClick(row, false)} size={'small'} className="!ml-2 px-5">
                                            <IconEdit color={theme.vars.palette.success.main} />
                                        </IconButton>
                                        {showCloneButton && handleCloneClick && (
                                            <IconButton onClick={() => handleCloneClick(row)} size={'small'} className="!ml-2 px-5">
                                                <IconCopy color={theme.vars.palette.primary.main} />
                                            </IconButton>
                                        )}
                                        {renderRowActions?.(row)}
                                        <IconButton onClick={() => handleRowClick(row, true)} size={'small'} className="!ml-2 px-5">
                                            <IconTrash color={theme.vars.palette.error.main} />
                                        </IconButton>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                </Box>

                {!isLoading && currentData.length === 0 && <EmptyTableState {...emptyState} />}

                {/* Pagination Controls */}
                {!isLoading && currentData.length > 0 && !hidePagination && (<div className="flex justify-between items-center mt-4 gap-3">
                    <button
                        onClick={() => {
                            const nextPage = Math.max(activePage - 1, 1);
                            if (!isServerPaginated) {
                                setCurrentPage(nextPage);
                            }
                            handlePageSelection(nextPage);
                        }}
                        disabled={activePage === 1}
                        className={`px-4 py-2 rounded ${activePage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        style={{
                            backgroundColor: theme.vars.palette.background.neutral,
                            color: theme.vars.palette.text.primary,
                        }}
                    >
                        Previous
                    </button>

                    <span style={{color: theme.vars.palette.text.secondary}}>
                        Page {activePage} of {totalPages}
                    </span>

                    <button
                        onClick={() => {
                            const nextPage = Math.min(activePage + 1, totalPages);
                            if (!isServerPaginated) {
                                setCurrentPage(nextPage);
                            }
                            handlePageSelection(nextPage);
                        }}
                        disabled={activePage === totalPages}
                        className={`px-4 py-2 rounded ${activePage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        style={{
                            backgroundColor: theme.vars.palette.background.neutral,
                            color: theme.vars.palette.text.primary,
                        }}
                    >
                        Next
                    </button>
                </div>)}
            </div>
        </>
    );
};

export default CustomTable;
