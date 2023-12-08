import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import axios from '../../../../../store/axios-secure'
import Loader from '../../../../Common/Loader'
import Button from '../../../../Common/Button'
import CustomModal from '../../../../Common/Modal'
import AddFoodItem from '../../AddFoodItem'
import auth from '../../../../../firebase-config'
import { mkConfig, generateCsv, download } from 'export-to-csv'
import { useEffect } from 'react'
import './style.scss'
const FoodItems = () => {
    const [searchText, setSearchText] = useState('')
    const [foodItemList, setFoodItemList] = useState(null)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState()
    const [totalPages, setTotalPages] = useState()
    const [pageOffset, setPageOffset] = useState(25)
    const [rowIndex, setRowIndex] = useState()
    const [hoverRowIndex, setHoverRowIndex] = useState()
    const [showAddFoodItemModal, setShowAddFoodItemModal] = useState(false)
    const [foodInfo, setFoodInfo] = useState()
    const [message, setMessage] = useState({
        error: false,
        success: false,
        msg: '',
    })
    const fetchFoodList = async () => {
        setLoading(true)
        try {
            const response = await axios.get(
                `/food/list?pageNumber=${page}&limit=${pageOffset}&searchKeyword=${searchText}`,
            )
            setFoodItemList(response?.data)
            const totalItems = response?.data?.total
            setTotalPages(Math.ceil(totalItems / pageOffset))
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }
    useEffect(() => {
        if (!showAddFoodItemModal) {
            fetchFoodList()
        }
    }, [searchText, page, showAddFoodItemModal])
    useEffect(() => {
        setPage(1)
    }, [searchText])
    const arrayRange = (start, stop, step) =>
        Array.from(
            { length: (stop - start) / step + 1 },
            (value, index) => start + index * step,
        )
    useEffect(() => {
        if (totalPages <= 10) {
            let pagesSet = arrayRange(1, totalPages, 1)
            setPages(pagesSet)
        } else {
            let pagesSet = arrayRange(1, 10, 1)
            setPages(pagesSet)
        }
    }, [totalPages])
    useEffect(() => {
        if (totalPages > 10 && page === pages[9] && page + 1 <= totalPages) {
            pages.shift()
            pages.push(page + 1)
        }
        if (totalPages > 10 && page === pages[0] && page - 1 >= 1) {
            pages.pop()
            pages.unshift(page - 1)
        }
    }, [page])
    const deleteFoodItem = async (item) => {
        setLoading(true)
        try {
            const response = await axios.delete(`/food/${item?._id}`)
            setMessage({
                ...message,
                success: true,
                msg: response?.data?.Message,
            })
            fetchFoodList()
        } catch (e) {
            setMessage({ ...message, error: true, msg: 'could not delete' })
            console.log(e)
        }
        setLoading(false)
    }
    useEffect(() => {
        if (message.msg) {
            setTimeout(() => {
                setMessage({ error: false, success: false, msg: '' })
            }, 5000)
        }
    }, [message])
    // const handleDownloadCSV = () => {
    //     const csvConfig = mkConfig({ useKeysAsHeaders: true });
    //     const csv = generateCsv(csvConfig)(foodItemList?.foodItems);
    //     download(csvConfig)(csv)
    //     console.log("download")
    // }
    // useEffect(() => {
    //     console.log('list ', foodItemList)
    // }, [foodItemList])
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}
            >
                <div className="heading1">Food Items</div>
                <div
                    style={{
                        backgroundColor: 'black',
                        padding: '10px',
                        width: 'fit-content',
                        borderRadius: '8px',
                    }}
                >
                    <Icon icon="line-md:search" className="searchIcon" />
                    <input
                        placeholder="Search Food item..."
                        type="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: 'white',
                        }}
                    />
                </div>
                {/* <Button
                    type="submit"
                    text="Download"
                    classNames="addButton"
                    color="green"
                    onClick={handleDownloadCSV}
                /> */}
            </div>
            {message?.error ? (
                <div className="displaymsgError">{message?.msg}</div>
            ) : (
                ''
            )}
            {message?.success ? (
                <div className="displaymsgSuccess">{message?.msg}</div>
            ) : (
                ''
            )}
            <div style={{ paddingTop: '30px' }}>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        {foodItemList && foodItemList?.foodItems?.length ? (
                            <>
                                <table>
                                    <tr>
                                        <th className="food-name cell-header">
                                            Name
                                        </th>
                                        <th className="food-calories cell-header">
                                            Calories
                                        </th>
                                        <th className="food-protein cell-header">
                                            Protein
                                        </th>
                                        <th className="food-fat cell-header">
                                            Fat
                                        </th>
                                        <th className="food-carbs cell-header">
                                            Carbs
                                        </th>
                                    </tr>
                                    {foodItemList?.foodItems?.map(
                                        (item, idx) => {
                                            return (
                                                <>
                                                    <tr
                                                        key={idx}
                                                        onClick={() =>
                                                            setRowIndex(idx)
                                                        }
                                                        onMouseOver={() =>
                                                            setHoverRowIndex(
                                                                idx,
                                                            )
                                                        }
                                                    >
                                                        <td className="food-name cell-padding">
                                                            {item?.name}
                                                        </td>
                                                        <td className="food-calories cell-padding">
                                                            {item?.calories}
                                                        </td>
                                                        <td className="food-protein cell-padding">
                                                            {item?.protein}
                                                        </td>
                                                        <td className="food-fat cell-padding">
                                                            {item?.fat}
                                                        </td>
                                                        <td className="food-carbs cell-padding">
                                                            {item?.carbs}
                                                        </td>
                                                        <td
                                                            style={{
                                                                display:
                                                                    hoverRowIndex ===
                                                                        idx &&
                                                                    auth
                                                                        .currentUser
                                                                        .email ===
                                                                        process
                                                                            .env
                                                                            .REACT_APP_ADMIN_MAIL
                                                                        ? 'flex'
                                                                        : 'none',
                                                                flexDirection:
                                                                    'row',
                                                            }}
                                                        >
                                                            <Icon
                                                                icon="mdi:circle-edit-outline"
                                                                className="editIcon iconSize"
                                                                onClick={() => {
                                                                    setFoodInfo(
                                                                        item,
                                                                    )
                                                                    setShowAddFoodItemModal(
                                                                        true,
                                                                    )
                                                                }}
                                                            />
                                                            <Icon
                                                                icon="entypo:circle-with-cross"
                                                                className="crossIcon iconSize"
                                                                onClick={() =>
                                                                    deleteFoodItem(
                                                                        item,
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    {rowIndex === idx ? (
                                                        item?.serving_sizes &&
                                                        item?.serving_sizes
                                                            ?.length ? (
                                                            <tr>
                                                                <td
                                                                    colSpan="5"
                                                                    className="serving_table"
                                                                >
                                                                    <table
                                                                        style={{
                                                                            backgroundColor:
                                                                                'black',
                                                                            borderRadius:
                                                                                '5px',
                                                                            width: '100%',
                                                                            margin: '0 auto',
                                                                        }}
                                                                    >
                                                                        <tr className="serving_size">
                                                                            <th className="food-serving-header">
                                                                                Serving
                                                                                Size
                                                                            </th>
                                                                            <th
                                                                                className="food-serving-header"
                                                                                style={{
                                                                                    textAlign:
                                                                                        'center',
                                                                                }}
                                                                            >
                                                                                Quantity(in
                                                                                gm)
                                                                            </th>
                                                                        </tr>
                                                                        {item?.serving_sizes?.map(
                                                                            (
                                                                                serving,
                                                                                idx2,
                                                                            ) => {
                                                                                return (
                                                                                    <tr
                                                                                        className="serving_size"
                                                                                        key={
                                                                                            idx2
                                                                                        }
                                                                                    >
                                                                                        <td className="food-serving-unit">
                                                                                            {
                                                                                                serving?.unit
                                                                                            }
                                                                                        </td>
                                                                                        <td className="food-serving-multiplier">
                                                                                            {serving?.multiplier
                                                                                                ? Number(
                                                                                                      serving?.multiplier *
                                                                                                          100,
                                                                                                  ).toFixed(
                                                                                                      0,
                                                                                                  )
                                                                                                : null}
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            },
                                                                        )}
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colspan="5"
                                                                    className="serving_noData"
                                                                >
                                                                    No serving
                                                                    defined for
                                                                    this item
                                                                </td>
                                                            </tr>
                                                        )
                                                    ) : null}
                                                </>
                                            )
                                        },
                                    )}
                                </table>
                                <div className="pagination">
                                    <div
                                        className="inactivePage"
                                        onClick={() =>
                                            setPage((prev) => {
                                                if (pages.includes(prev - 1)) {
                                                    return prev - 1
                                                } else {
                                                    return prev
                                                }
                                            })
                                        }
                                    >
                                        &laquo;
                                    </div>
                                    {pages?.map((item, idx) => {
                                        return (
                                            <div
                                                className={
                                                    item === page
                                                        ? 'inactivePage activePage'
                                                        : 'inactivePage'
                                                }
                                                onClick={() => setPage(item)}
                                            >
                                                {item}
                                            </div>
                                        )
                                    })}

                                    <div
                                        className="inactivePage"
                                        onClick={() =>
                                            setPage((prev) => {
                                                if (pages.includes(prev + 1)) {
                                                    return prev + 1
                                                } else {
                                                    return prev
                                                }
                                            })
                                        }
                                    >
                                        &raquo;
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div>No Record Found</div>
                                <Button
                                    type="submit"
                                    text="Add Food Item"
                                    classNames="addButton"
                                    color="green"
                                    onClick={() => {
                                        setShowAddFoodItemModal(true)
                                        setFoodInfo(null)
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
            <CustomModal
                title={foodInfo ? 'Edit Food Item' : 'Add Food Item'}
                show={showAddFoodItemModal}
                onHide={() => setShowAddFoodItemModal(false)}
                width="medium"
                dark={true}
            >
                <AddFoodItem
                    item={foodInfo?.name ? foodInfo?.name : searchText}
                    foodInfo={foodInfo}
                />
            </CustomModal>
        </>
    )
}
export default FoodItems
