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
                alert('Xóa thành công');
                dispatch(getUserList)
            }

        } catch (err) {
            alert(err.response.data);
        }

    }
    
    //SEARCH VALUE
    const formik = useFormik({
        initialValues: { tuKhoa: '' },
    })

    useEffect(() => {
        if(formik.values.tuKhoa!==""){
            dispatch(getSearchList(formik.values.tuKhoa))
        }else{
            dispatch(getUserList)
        }
    }, [formik.values.tuKhoa])


    const renderUserList = (currentItems) => {
        return currentItems && currentItems.map((item, index) => {
            return <tr>
                <td className="align-middle">{itemOffset + index + 1}</td>
                <td className="align-middle text-wrap">{item.taiKhoan}</td>
                <td className="align-middle text-wrap">{item.maLoaiNguoiDung}</td>
                <td className="align-middle text-wrap">{item.hoTen}</td>
                <td className="align-middle text-break">{item.email}</td>
                <td className="align-middle text-wrap">{item.soDt}</td>
                <td>
                    <button onClick={() => { getUser(item.taiKhoan)}}type="button" className="btn btn-success mx-1" data-toggle="modal" data-target="#userReg" >Ghi danh</button>
                    <button onClick={() => { updateUser(item) }} className="btn btn-warning mx-1" data-toggle="modal" data-target="#userUpdate">Sửa</button>
                    <button onClick={() => { deleteUser(item.taiKhoan) }} className="btn btn-danger mx-1" >Xóa</button>
                </td>
            </tr>
        })

    }

    
    return (
        <div className="details container-fluid card text-center">
            {/* Header */}
            <div className="card-header myCardHeader">
                <div className="row">
                    <div className="col-md-3 text-left ">
                        <button className="btn btn-success" id="btnThem" data-toggle="modal" data-target="#myModal">Thêm người dùng</button>
                    </div>
                    <form onSubmit={formik.handleSubmit} className="col-md-6">
                        <div className="input-group">
                            <input name="tuKhoa"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.tuKhoa} type="text" className="form-control" placeholder="Nhập vào tài khoản hoặc họ tên người dùng" id="searchName" />
                            <div className="input-group-prepend">
                                <button type="submit" className="input-group-text" id="btnTimNV"><i className="fa fa-search" /></button>
                            </div>
                        </div>
                    </form>

                    <div className="col-md-3 text-right ">
                        <LoginInfo/>

                    </div>

                </div>
            </div>
            {/* Body */}
            <div className="container">

                <table className="table table-bordered table-hover myTable">
                    <thead className="text-dark bg-light">
                        <tr>
                            <th className="align-middle">STT</th>
                            <th className="align-middle col-1">Tài khoản</th>
                            <th className="align-middle col-1">Mật khẩu</th>
                            <th className="align-middle col-2 ">Họ và tên</th>
                            <th className="align-middle col-2 ">Email</th>
                            <th className="align-middle col-2 ">Số điện thoại</th>

                            <th className="align-middle col-4"><em className="fa fa-cog" /></th>
                        </tr>
                    </thead>
                    <tbody id="tableDanhSach" >
                        {renderUserList(currentItems)}
                    </tbody>
                </table>
            </div>

            {/* The Modal */}
            <UserModal />
            <UserRegisterModal taiKhoanUser={taiKhoanUser}/>
            <UserUpdateModal userUpdate={userUpdate} />
            <ReactPaginate
                nextLabel="Sau >"
                pageRangeDisplayed={5}
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
