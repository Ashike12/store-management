import TextWrapper from "@components/text/TextWrapper";
import { IconButton } from "@mui/material";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

// Define types for table columns and data
interface Column {
    key: string; // Unique key for data access
    label: string; // Column header label
}

interface TableProps<T> {
    columns: Column[]; // Array of columns
    data: T[]; // Array of data objects
    rowsPerPage?: number; // Optional pagination setting
    handleRowClick?: (row: T, isDelete: boolean) => void; // Optional row click handler
    showActionButtons?: boolean; // Optional flag to show actions column
    isRowClickable?: boolean; // Optional flag to make row clickable
}

const CustomTable = <T extends Record<string, any>>({
    columns,
    data,
    rowsPerPage = 5,
    handleRowClick = (row: T, isDelete: boolean) => { },
    showActionButtons = false,
    isRowClickable = false
}: TableProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    // Get current page data
    const currentData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <table className="w-full border rounded-sm border-grey-grey-200">
                <thead className="bg-gray-200">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="border border-grey-grey-200 px-4 py-2 text-left">
                                <TextWrapper variant={'H6'} content={col.label} />
                            </th>
                        ))}
                        {showActionButtons && (
                            <th colSpan={columns.length} className="border border-grey-grey-200 px-4 py-2">
                                <TextWrapper variant={'H6'} content={'ACTION'} />
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-100">
                            {columns.map((col) => (
                                <td key={col.key} className={`border border-grey-grey-200 px-4 py-2 ${isRowClickable ? 'cursor-pointer' : ''}`} onClick={() => isRowClickable && handleRowClick(row, false)}>
                                    <TextWrapper variant={'Body1'} content={row[col.key]} />
                                </td>
                            ))}
                            {showActionButtons && (
                                <td key={'action'+rowIndex} colSpan={columns.length} className="border border-grey-grey-200 px-4 py-2">
                                    <IconButton onClick={() => handleRowClick(row, false)} size={'small'} className="!ml-2 px-5">
                                        <IconEdit color="green" />
                                    </IconButton>
                                    <IconButton onClick={() => handleRowClick(row, true)} size={'small'} className="!ml-2 px-5">
                                        <IconTrash color="red" />
                                    </IconButton>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 bg-gray-500 text-white rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600 cursor-pointer"
                        }`}
                >
                    Previous
                </button>

                <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-gray-500 text-white rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600 cursor-pointer"
                        }`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CustomTable;
