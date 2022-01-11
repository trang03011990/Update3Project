import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { getUserListNotConfirmed, getUserListConfirmed, getUserListNotRegister, getSearchListNotReg, getUserList } from '../../Redux/action/UserAction'
import { useFormik } from 'formik'
import { http } from '../../Util/setting'
import swal from 'sweetalert'
export default function CourseRegisterModal(props) {

    const dispatch = useDispatch()
    const UserListNotConfirmed = useSelector(state => state.UserReducer.UserListNotConfirmed)
    const UserListConfirmed = useSelector(state => state.UserReducer.UserListConfirmed)
    const UserListNotRegister = useSelector(state => state.UserReducer.UserListNotRegister)
    const UserListNotRegisterSearch = useSelector(state => state.UserReducer.UserListNotRegisterSearch)

    // Pagination
    const [notConfirmedItems, setnotConfirmedItems] = useState([]);
    const [pageCount1, setPageCount1] = useState(0);
    const [itemOffset1, setitemOffset1] = useState(0);

    const [confirmedItems, setConfirmedItems] = useState([]);
    const [pageCount2, setPageCount2] = useState(0);
    const [itemOffset2, setitemOffset2] = useState(0);

    useEffect(() => {
        const endOffset = itemOffset1 + 2;
        console.log(`Loading items from ${itemOffset1} to ${endOffset}`);
        setnotConfirmedItems(UserListNotConfirmed && UserListNotConfirmed.slice(itemOffset1, endOffset));
        setPageCount1(Math.ceil(UserListNotConfirmed && UserListNotConfirmed.length / 2));
    }, [itemOffset1, UserListNotConfirmed])

    useEffect(() => {
        const endOffset = itemOffset2 + 2;
        console.log(`Loading items from ${itemOffset2} to ${endOffset}`);
        setConfirmedItems(UserListConfirmed && UserListConfirmed.slice(itemOffset2, endOffset));
        setPageCount2(Math.ceil(UserListConfirmed && UserListConfirmed.length / 2));
    }, [itemOffset2, UserListConfirmed])

    const handlePageClick1 = (event) => {
        const newOffset = event.selected * 2 % UserListNotConfirmed.length;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setitemOffset1(newOffset);
    };

    const handlePageClick2 = (event) => {
        const newOffset = event.selected * 2 % UserListConfirmed.length;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setitemOffset2(newOffset);
    };
    //endPagination

    const [RegItem, setRegItem] = useState({})
    const getNotRegItem = (i) => {
        i && setRegItem(i)
    }


    useEffect(() => {
        // console.log(props.course)
        dispatch(getUserListConfirmed(props.course))
        dispatch(getUserListNotRegister(props.course))
        dispatch(getUserListNotConfirmed(props.course))
    }, [props.course])

    const renderUserListNotConfirmed = (notConfirmedItems) => {
        return notConfirmedItems && notConfirmedItems.map((item, index) => {
            return <tr>
                <td className="align-middle" scope="row">{index + 1}</td>
                <td className="align-middle">{item.taiKhoan}</td>
                <td className="align-middle">{item.hoTen}</td>
                <td>
                    <button onClick={() => { regUserByCourse(props.course, item.taiKhoan) }} className="btn mx-1" id="btnThem" >Xác thực</button>
                    <button onClick={() => { deleteUserByCourse(props.course, item.taiKhoan) }} className="btn btn-danger mx-1" >Xóa</button>

                </td>
            </tr>
        })
    }

    const renderUserListConfirmed = (confirmedItems) => {
        return confirmedItems && confirmedItems.map((item, index) => {
            return <tr>
                <td className="align-middle" scope="row">{index + 1}</td>
                <td className="align-middle">{item.taiKhoan}</td>
                <td className="align-middle">{item.hoTen}</td>
                <td>
                    <button onClick={() => { deleteUserByCourse(props.course, item.taiKhoan) }} className="btn btn-danger mx-1" >Xóa</button>
                </td>
            </tr>
        })
    }

    const renderUserListNotRegister = (notRegItems) => {
        return notRegItems && notRegItems.map((item, index) => {
            return <li onClick={() => {
                getNotRegItem(item);
                formik.setValues({ hoTen: item.hoTen })
            }} className="dropdown-item" href="#">{item.hoTen}</li>

        })
    }

    const regUserByCourse = async (maKhoaHoc, taiKhoan) => {
        const values = { maKhoaHoc: maKhoaHoc, taiKhoan: taiKhoan }
        try {
            let result = await http.post('/api/QuanLyKhoaHoc/GhiDanhKhoaHoc', values)
            // alert(result.data)
            swal({
                title: result.data,
                icon: "success",
                timer: 2000,
                button: false,
            });
            formik.resetForm();
            dispatch(getUserListNotRegister(maKhoaHoc))
            dispatch(getUserListConfirmed(maKhoaHoc))
            dispatch(getUserListNotConfirmed(maKhoaHoc))

        } catch (errors) {
            // alert(errors.response.data);
            swal({
                title: errors.response?.data,
                icon: "warning",
                text: 'Đã xảy ra lỗi vui lòng quay lại trang chủ hoặc thử lại',
                timer: 2000,
                button: false,
            });
        }
    }

    const deleteUserByCourse = async (maKhoaHoc, taiKhoan) => {
        const values = { maKhoaHoc: maKhoaHoc, taiKhoan: taiKhoan }
        try {
            let result = await http.post('/api/QuanLyKhoaHoc/HuyGhiDanh', values)
            // alert(result.data)
            swal({
                title: result.data,
                icon: "success",
                timer: 2000,
                button: false,
            });
            dispatch(getUserListNotRegister(maKhoaHoc))
            dispatch(getUserListConfirmed(maKhoaHoc))
            dispatch(getUserListNotConfirmed(maKhoaHoc))

        } catch (errors) {
            // alert(errors.response.data);
            swal({
                title: errors.response?.data,
                icon: "warning",
                text: 'Đã xảy ra lỗi vui lòng quay lại trang chủ hoặc thử lại',
                timer: 2000,
                button: false,
            });
        }
    }

    const formik = useFormik({
        initialValues: { hoTen: '' },
    })

    //SEARCH VALUE
    // const formik1 = useFormik({
    //     initialValues: { tuKhoa: '' },
    // })

    // useEffect(() => {
    //     if(formik.values.hoTen!==""){
    //         const tuKhoa=formik.values.hoTen;
    //         dispatch(getSearchListNotReg(tuKhoa,UserListNotRegister));

    //     }else{
    //     }
    // }, [formik.values.hoTen])


    // useEffect(() => {
    //     dispatch(getSearchCourseList(formik.values))
    // }, [formik.values])



    return (
        <div className="modal fade" id="courseReg">
            <div className="modal-dialog formCourse">
                <div className="modal-content px-3">
                    {/* Modal Header */}
                    <div className="modal-body ">
                        <div className="border-bottom border-secondary">
                            <div className="row">
                                <h5 className="text-left my-1 col-3" id="URM-title"> Chọn người dùng</h5>
                                <form className='form-group col-6'>
                                    <div className="input-group float-left ">
                                        <input name='hoTen' placeholder="Tên người dùng" onBlur={formik.handleBlur} onChange={formik.handleChange} value={formik.values.hoTen} data-toggle="dropdown" type="text" className="form-control input-dropdown" aria-label="Text input with segmented dropdown button" />
                                        {/* <button data-reference="parent" data-boundary="window" type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false"></button> */}

                                        <ul className="dropdown-menu set-height">
                                            {renderUserListNotRegister(UserListNotRegister)}
                                        </ul>
                                    </div>

                                </form>
                                <div className="col-3">
                                    <a onClick={() => { regUserByCourse(props.course, RegItem.taiKhoan) }} className="btn btn-success float-right" id="btnThem">Ghi danh</a>

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Modal body */}
                    <div className="modal-body ">
                        <div className="border-bottom border-secondary">

                            <div className="row">
                                <h5 className="text-left col-6" id="URM-title"> Học viên chờ xác thực</h5>
                                <div className="col-6">
                                    <input className="form-control" type="search" placeholder="Nhập tên học viên hoặc số điện thoại" aria-label="Search" />
                                </div>
                            </div>
                            .<table class="table table-center table-hover myTable table-striped">
                                <thead class="text-dark bg-light">
                                    <tr>
                                        <th>STT</th>
                                        <th>Tài khoản</th>
                                        <th>Học viên</th>
                                        <th>Chờ xác nhận</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {renderUserListNotConfirmed(notConfirmedItems)}

                                </tbody>

                            </table>
                            <ReactPaginate
                                nextLabel="Sau >"
                                pageRangeDisplayed={2}
                                pageCount={pageCount1}
                                onPageChange={handlePageClick1}
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
                    </div>

                    {/* Modal footer */}
                    <div className="modal-body">
                        <div className="">
                            <div className="row">
                                <h5 className="text-left col-6"> Học viên đã tham gia khóa học</h5>
                                <div className="col-6">
                                    <input className="form-control" type="search" placeholder="Nhập tên học viên hoặc số điện thoại" aria-label="Search" />
                                </div>

                            </div>
                            .<table class="table table-center table-hover myTable table-striped">
                                <thead class="text-dark bg-light">
                                    <tr>
                                        <th>STT</th>
                                        <th>Tài khoản</th>
                                        <th>Học viên</th>
                                        <th>Chờ xác nhận</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {renderUserListConfirmed(confirmedItems)}

                                </tbody>

                            </table>
                            <ReactPaginate
                                nextLabel="Sau >"
                                pageRangeDisplayed={2}
                                pageCount={pageCount2}
                                onPageChange={handlePageClick2}
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
                    </div>
                </div>
            </div>
        </div>
    )
}
