import React from 'react'
import '../Admin/admin.css'
import CourseModal from './CourseModal'
import CourseRegisterModal from './CourseRegisterModal'
import { useState, useEffect } from 'react'
import { http } from '../../Util/setting'
import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate'
import { useFormik } from 'formik'
import { courseSearchList1, getListCourse } from '../../Redux/action/CourseAction'
import LoginInfo from '../../component/LoginInfo/LoginInfo'
import CourseUpdateModal from './CourseUpdateModal'
import swal from 'sweetalert'
export default function CourseManagement() {

    const dispatch = useDispatch()
    const coursesList = useSelector(state => state.CourseReducer.coursesList)

    //Pagination
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const endOffset = itemOffset + 5;
        console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(coursesList && coursesList.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(coursesList && coursesList.length / 5));
    }, [itemOffset, coursesList])

    const handlePageClick = (event) => {
        const newOffset = event.selected * 5 % coursesList.length;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setItemOffset(newOffset);
    };
    //endPagination

    //GHI DANH
    const [course, setCourse] = useState({})
    const getCourse = (i) => {
        i && setCourse(i)
    }
    //SUA
    const [courseUpdate, setCourseUpdate] = useState({})
    const updateCourse = (i) => {
        i && setCourseUpdate(i)
    }
    //XOA
    const deleteCourse = async (i) => {
        try {
            let result = await http.delete(`/api/QuanLyKhoaHoc/XoaKhoaHoc?MaKhoaHoc=${i}`)
            if (result.request.status === 200) {
                // alert('Xóa thành công');
                swal({
                    title: "Xóa thành công",
                    icon: "success",
                    timer: 2000,
                    button: false,
                });
                dispatch(getListCourse)
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
    //SEARCH
    const formik = useFormik({
        initialValues: { tuKhoa: '' },
    })

    useEffect(() => {
        if (formik.values.tuKhoa == "") {
            dispatch(getListCourse)
        } else {
            dispatch(courseSearchList1(formik.values.tuKhoa))
        }
    }, [formik.values.tuKhoa])


    const renderCourseList = (currentItems) => {
        return currentItems.map((item, index) => {
            return <tr style={{ width: '100%' }}>
                <td className="align-middle text-break" style={{ width: '7%' }}>{itemOffset + index + 1}</td>
                <td className="align-middle text-break text-wrap" style={{ width: '15%' }}>{item.maKhoaHoc}</td>
                <td className="align-middle text-break text-wrap" style={{ width: '15%' }}>{item.tenKhoaHoc}</td>
                <td className="align-middle img-fluid" style={{ backgroundImage: `url(${item.hinhAnh})`, backgroundSize: "cover", width:'14%'}}>

                </td>
                <td className="align-middle text-break" style={{ width: '11%' }}>{item.luotXem}</td>
                <td className="align-middle text-break text-wrap" style={{ width: '13%' }}>{item.nguoiTao.hoTen} </td>
                <td className='align-middle' style={{ width: '25%' }}>
                    <button onClick={() => { getCourse(item.maKhoaHoc) }} type="button" className="btn mx-1 text-wrap" id='btnThem' data-toggle="modal" data-target="#courseReg" >
                    <span className='hide'>Ghi danh</span>
                        <span className='unhide'>Reg</span>
                    </button>
                    <button onClick={() => { updateCourse(item) }} className="btn btn-warning m-1 text-wrap" data-toggle="modal" data-target="#updateCourse">Sửa</button>
                    <button onClick={() => { deleteCourse(item.maKhoaHoc) }} className="btn btn-danger mx-1" >Xóa</button>
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

                        <button className="btn text-white m-1" id="btnThem" data-toggle="modal" data-target="#myModal">Thêm khóa học</button>
                    </div>
                    <div className='col-7 row ml-auto item'>
                        <div className='col-7 p-1'>
                            <form onSubmit={formik.handleSubmit} className="">
                                    <input name="tuKhoa"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.tuKhoa} type="text" className="form-control" placeholder="Nhập vào khóa học cần tìm" id="searchName" />
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
                            <th className="align-middle text-break text-wrap" style={{ width: '15%' }}>
                                <span className='hide'>Mã khóa học</span>
                                <span className='unhide'>Mã KH</span>
                            </th>
                            <th className="align-middle text-break text-wrap" style={{ width: '15%' }} >
                                <span className='hide'>Tên khóa học</span>
                                <span className='unhide'>Tên KH</span>
                            </th>
                            <th className="align-middle text-break text-wrap" style={{ width: '14%' }}>
                                <span >Hình ảnh</span>
                            </th>
                            <th className="align-middle text-break text-wrap" style={{ width: '11%' }}>
                                <span >Lượt xem</span>
                            </th>
                            <th className="align-middle text-break text-wrap" style={{ width: '13%' }}>
                                <span >Người tạo</span>
                            </th>

                            <th className="align-middle" style={{ width: '25%' }}><em className="fa fa-cog text-wrap" /></th>
                        </tr>
                    </thead>
                    
                    <tbody id="tableDanhSach" >
                        {renderCourseList(currentItems)}
                    </tbody>
                </table>
            </div>
            <CourseModal />
            <CourseRegisterModal course={course} />
            <CourseUpdateModal courseUpdate={courseUpdate} />
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

