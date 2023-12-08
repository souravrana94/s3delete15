import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTable, usePagination } from 'react-table'
import './index.scss'
import InputBox from '../Form/InputBox'

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
    columns,
    data,
    fetchData,
    loading,
    pageCount: controlledPageCount,
}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
            manualPagination: true,
            pageCount: controlledPageCount,
        },
        usePagination,
    )

    const [searchText, setSearchText] = useState('')

    // Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
        fetchData({ pageIndex, pageSize, searchText })
    }, [fetchData, pageIndex, pageSize, searchText])

    // Render the UI for your table
    return (
        <div className="admin-table">
            <InputBox
                darkTheme={true}
                type="text"
                placeholder="Search..."
                divClassNames="my-3"
                value={searchText}
                onChange={(evt) => {
                    setSearchText(evt?.target?.value)
                }}
            />
            <table
                {...getTableProps()}
                className="table table-striped table-dark table-sm table-bordered table-responsive"
            >
                <thead>
                    {headerGroups.map((headerGroup, headerGroupIdx) => (
                        <tr
                            key={headerGroupIdx}
                            {...headerGroup.getHeaderGroupProps()}
                        >
                            {headerGroup.headers.map((column, columnIndex) => (
                                <th
                                    key={columnIndex}
                                    {...column.getHeaderProps()}
                                >
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()} key={i}>
                                {row.cells.map((cell, cellIndex) => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            key={cellIndex + i * 100}
                                        >
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    <tr>
                        {loading ? (
                            // Use our custom loading state to show a loading indicator
                            <td colSpan="10000">Loading...</td>
                        ) : (
                            <td colSpan="10000">
                                Showing {page.length} of ~
                                {controlledPageCount * pageSize} results
                            </td>
                        )}
                    </tr>
                </tbody>
            </table>

            <div className="custom-pagination">
                <div>
                    <button
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                        className="page-button"
                    >
                        {'<<'}
                    </button>
                    <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                        className="page-button"
                    >
                        {'<'}
                    </button>
                    <button
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                        className="page-button"
                    >
                        {'>'}
                    </button>
                    <button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                        className="page-button"
                    >
                        {'>>'}
                    </button>
                </div>
                <div>
                    <span>
                        Page
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>
                    </span>
                    <span>
                        {'   '}| Go to page:{'   '}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0
                                gotoPage(page)
                            }}
                            style={{ width: '100px' }}
                        />
                    </span>{' '}
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

Table.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    fetchData: PropTypes.func,
    loading: PropTypes.bool,
    pageCount: PropTypes.number,
}

export default Table
