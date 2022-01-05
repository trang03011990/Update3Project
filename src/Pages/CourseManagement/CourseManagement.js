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

export default function CourseManagement() {

    const dispatch = useDispatch()
    const coursesList = useSelector(state => state.CourseReducer.coursesList)

    //Pagination
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);

    useEffect(() => {
        const endOffset = itemOffset + 5;
        // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
        setCurrentItems(coursesList&&coursesList.slice(itemOffset, endOffset));
        setPageCount(Math.ceil(coursesList&&coursesList.length / 5));
    }, [itemOffset, coursesList])

    const handlePageClick = (event) => {
        const newOffset = event.selected * 5 % coursesList.length;
        console.log(newOffset);
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
                alert('Xóa thành công');
                dispatch(getListCourse)
            }
        } catch (err) {
            alert(err.response.data);
        }

    }
    //SEARCH
    const formik = useFormik({
        initialValues: { tuKhoa: '' },
    })

    useEffect(() => {
        if(formik.values.tuKhoa==""){
            dispatch(getListCourse)
        }else{
            dispatch(courseSearchList1(formik.values.tuKhoa))
        }
    }, [formik.values.tuKhoa])


    const renderCourseList = (currentItems) => {
        return currentItems.map((item, index) => {
            return <tr>
                <td className="align-middle">{itemOffset + index + 1}</td>
                <td className="align-middle text-wrap">{item.maKhoaHoc}</td>
                <td className="align-middle text-wrap">{item.tenKhoaHoc}</td>
                <td className="align-middle text-wrap" style={{ backgroundImage: `url(${item.hinhAnh})`, backgroundSize: "cover" }}>

                </td>
                <td className="align-middle text-break">{item.luotXem}</td>
                <td className="align-middle text-wrap">{item.nguoiTao.hoTen} </td>
                <td>
                    <button onClick={()=>{getCourse(item.maKhoaHoc)}}type="button" className="btn btn-success mx-1" data-toggle="modal" data-target="#courseReg" >Ghi danh</button>
                    <button onClick={()=>{updateCourse(item)}}className="btn btn-warning mx-1" data-toggle="modal" data-target="#updateCourse">Sửa</button>
                    <button onClick={()=>{deleteCourse(item.maKhoaHoc)}} className="btn btn-danger mx-1" >Xóa</button>
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
                        <button className="btn btn-success" id="btnThem" data-toggle="modal" data-target="#myModal">Thêm khóa học</button>
                    </div>
                    <form onSubmit={formik.handleSubmit} className="col-md-6">
                        <div className="input-group">
                            <input name="tuKhoa"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.tuKhoa} type="text" className="form-control" placeholder="Nhập vào khóa học cần tìm" id="searchName" />
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
                            <th>STT</th>
                            <th className="nowrap">Mã khóa học</th>
                            <th className="col-2">Tên khóa học</th>
                            <th>Hình ảnh</th>
                            <th>Lượt xem</th>
                            <th>Người tạo</th>

                            <th className="col-4">Thao tác<em className="fa fa-cog ml-3" /></th>
                        </tr>
                    </thead>
                    <tbody id="tableDanhSach" >
                        {renderCourseList(currentItems)}
                    </tbody>
                </table>
            </div>
            <CourseModal />
            <CourseRegisterModal course={course} />
            <CourseUpdateModal courseUpdate={courseUpdate}/>
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

