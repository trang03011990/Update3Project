import React from 'react'
import '../Admin/admin.css'
import UserModal from './UserModal'
import UserRegisterModal from './UserRegisterModal'
import { http } from '../../Util/setting'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate'
import { getSearchList, getUserList } from '../../Redux/action/UserAction'
import { useFormik } from 'formik'
import LoginInfo from '../../component/LoginInfo/LoginInfo'
import UserUpdateModal from './UserUpdateModal'
import swal from 'sweetalert'

export default function UserManagement(props) {
    const dispatch = useDispatch()
    const userArray = useSelector(state => state.UserReducer.userArray)
    //Pagination
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    useEffect(() => {
        const endOffset = itemOffset + 5;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(userArray && userArray.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(userArray && userArray.length / 5));
    }, [itemOffset, userArray])

    const handlePageClick = (event) => {
        const newOffset = event.selected * 5 % userArray.length;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };
    //END PAGINATION

    //GHI DANH
    const [taiKhoanUser, setTaiKhoanUser] = useState({})
    const getUser = (i) => {
        i && setTaiKhoanUser(i)
    }
    //SUA
    const [userUpdate, setUserUpdate] = useState({})
    const updateUser = (i) => {
        // console.log(i)
        i && setUserUpdate(i)
    }

    //XOA
    const deleteUser = async (i) => {
        try {
            let result = await http.delete(`/api/QuanLyNguoiDung/XoaNguoiDung?TaiKhoan=${i}`)
            if (result.request.status === 200) {
                // alert('Xóa thành công');
                swal({
                    title: "Xóa thành công",
                    icon: "success",
                    timer: 2000,
                    button: false,
                });
                dispatch(getUserList)
            }

        } catch (errors) {
            // alert(err.response.data);
            swal({
                title: errors.response?.data,
                icon: "warning",
                text: 'Đã xảy ra lỗi vui lòng quay lại trang chủ hoặc thử lại',
                timer: 2000,
                button: false,
            });
        }

    }

    //SEARCH VALUE
    const formik = useFormik({
        initialValues: { tuKhoa: '' },
    })

    useEffect(() => {
        if (formik.values.tuKhoa !== "") {
            dispatch(getSearchList(formik.values.tuKhoa))
        } else {
            dispatch(getUserList)
        }
    }, [formik.values.tuKhoa])


    const renderUserList = (currentItems) => {
        return currentItems && currentItems.map((item, index) => {
            return <tr style={{ width: '100%' }}>
                <td className="align-middle text-break text-wrap" style={{ width: '5%' }}>{itemOffset + index + 1}</td>
                <td className="align-middle text-break text-wrap" style={{ width: '13%' }} >{item.taiKhoan}</td>
                <td className="align-middle text-break text-wrap" style={{ width: '5%' }} >{item.maLoaiNguoiDung}</td>
                <td className="align-middle text-break text-wrap" style={{ width: '15%' }} >{item.hoTen}</td>
                <td className="align-middle text-break text-wrap" style={{ width: '25%' }} >{item.email}</td>
                <td className="align-middle text-break text-wrap" style={{ width: '10%' }} >{item.soDt}</td>
                <td style={{ width: '27%' }}>
                    <button onClick={() => { getUser(item.taiKhoan) }} type="button" className="btn mx-1 text-wrap" id="btnThem" data-toggle="modal" data-target="#userReg" >
                        <span className='hide'>Ghi danh</span>
                        <span className='unhide'>Thêm</span>
                    </button>
                    <button onClick={() => { updateUser(item) }} className="btn btn-warning m-1 text-wrap" data-toggle="modal" data-target="#userUpdate">Sửa</button>
                    <button onClick={() => { deleteUser(item.taiKhoan) }} className="btn btn-danger mx-1 text-wrap" >Xóa</button>
                </td>
            </tr>
        })

    }


    return (
        <div className="details container-fluid card text-center">
            {/* Header */}
            <div className="card-header myCardHeader container-fluid">
                <div className="row">
                    <div className='col-auto mr-auto row item'>
                        <button id="dropdown-toggle menu-icon dropdownMenuButton2" data-toggle="dropdown" className="btn btn-light my-1 item unhide">
                            <span id='menu-icon'>
                                <i className="fa fa-list" />
                            </span>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                            <li><a className="dropdown-item" href="/admin/quanlynguoidung">Quản lý người dùng</a></li>
                            <li><a className="dropdown-item" href="/admin/quanlykhoahoc">Quản lý khóa học</a></li>
                        </ul>
                        <button className="btn text-white m-1" id="btnThem" data-toggle="modal" data-target="#myModal">Thêm người dùng
                        </button>

                    </div>
                    <div className='col-7 row ml-auto item'>
                        <div className='col-7 p-1'>
                            <form onSubmit={formik.handleSubmit} className="">
                                {/* <div className="input-group py-1"> */}
                                <input name="tuKhoa"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    value={formik.values.tuKhoa} type="text" className="form-control" placeholder="Nhập vào tài khoản hoặc họ tên người dùng" id="searchName" />
                                {/* </div> */}
                            </form>

                        </div>

                        <div className="ml-auto">
                            <LoginInfo />

                        </div>

                    </div>

                </div>
            </div>
            {/* Body */}
            <div className="container-fluid px-0">
                <table className="table table-bordered table-hover myTable">
                    <thead className="text-dark bg-light">
                        <tr style={{ width: '100%' }}>
                            <th className="align-middle text-break text-wrap" style={{ width: '7%' }} >
                                <span className='hide'>STT</span>
                                <span className='unhide'>STT</span>
                            </th>
                            <th className="align-middle text-break text-wrap" style={{ width: '13%' }}>
                                <span className='hide'>Tài khoản</span>
                                <span className='unhide'>TK</span>
                            </th>
                            <th className="align-middle text-break text-wrap" style={{ width: '7%' }} >
                                <span className='hide'>Người dùng</span>
                                <span className='unhide'>ND</span>
                            </th>
                            <th className="align-middle text-break text-wrap" style={{ width: '15%' }}>
                                <span className='hide'>Họ và tên</span>
                                <span className='unhide'>Họ Tên</span>
                            </th>
                            <th className="align-middle text-break text-wrap" style={{ width: '21%' }}>Email</th>
                            <th className="align-middle text-break text-wrap" style={{ width: '12%' }}>
                                <span className='hide'>Số điện thoại</span>
                                <span className='unhide'>Điện thoại</span>
                            </th>

                            <th className="align-middle" style={{ width: '25%' }}><em className="fa fa-cog text-wrap" /></th>
                        </tr>
                    </thead>
                    <tbody id="tableDanhSach" >
                        {renderUserList(currentItems)}
                    </tbody>
                </table>
            </div>

            {/* The Modal */}
            <UserModal />
            <UserRegisterModal taiKhoanUser={taiKhoanUser} />
            <UserUpdateModal userUpdate={userUpdate} />
            <ReactPaginate
                nextLabel="Sau >"
                pageRangeDisplayed={3}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                previousLabel="< Trước"
                pageClassName="page-item"
                pageLinkClassName="pageLinkPages"
                previousClassName="page-item"
                previousLinkClassName="pageLinkPages"
                nextClassName="page-item"
                nextLinkClassName="pageLinkPages"
                breakLabel="..."
                breakClassName="page-item"
                breakLinkClassName="pageLinkPages"
                containerClassName="paginationPages"
                activeClassName="active"
                renderOnZeroPageCount={null}
            />
        </div>
    )
}
