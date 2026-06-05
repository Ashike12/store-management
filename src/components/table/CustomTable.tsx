import TextWrapper from "@components/text/TextWrapper";
import { IconButton } from "@mui/material";
import { IconCopy, IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import moment from "moment";
import {useTheme} from "@mui/material/styles";

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
}

const CustomTable = <T extends Record<string, any>>({
    columns,
    data,
    totalCount = data.length,
    rowsPerPage = 5,
    handleRowClick = (row: T, isDelete: boolean, isGoDetails?: boolean) => { },
    handleCloneClick,
    showActionButtons = false,
    showCloneButton = false,
    isRowClickable = false,
    hidePagination = false,
    handlePageSelection = (page: number) => { },
    currentPage: externalCurrentPage = 1,
    isServerPaginated = false,
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

    const isValidDate = (date: any) => {
        return moment(date, moment.ISO_8601, true).isValid();
    };

    const getContent = (row: any, col: Column) => {
        if (row[col.key] == null || row[col.key] == undefined || row[col.key] == '') {
            return col.altKey ? (row[col.altKey] ?? 'N/A') : 'N/A';
        }
        return row[col.key];
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
                <table className="w-full border rounded-sm" style={{borderColor: tableBorderColor}}>
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
                        {currentData.map((row, rowIndex) => (
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
                                        {col.key.indexOf('Date') == -1 ? (<TextWrapper variant={'Body1'} content={getContent(row, col)} />) : moment(row[col.key]).format("DD/MM/YYYY")}
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
                                        <IconButton onClick={() => handleRowClick(row, true)} size={'small'} className="!ml-2 px-5">
                                            <IconTrash color={theme.vars.palette.error.main} />
                                        </IconButton>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {!hidePagination && (<div className="flex justify-between items-center mt-4">
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
