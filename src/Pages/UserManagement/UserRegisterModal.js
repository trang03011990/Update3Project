import React from 'react'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { getCourseListNotConfirmed, getCourseListConfirmed, getCourseListNotRegister } from '../../Redux/action/CourseAction'
import { useFormik } from 'formik'
import { http } from '../../Util/setting'



export default function UserRegisterModal(props) {
    const dispatch = useDispatch()
    const courseListNotConfirmed = useSelector(state => state.CourseReducer.courseListNotConfirmed)
    const courseListConfirmed = useSelector(state => state.CourseReducer.courseListConfirmed)
    const courseListNotRegister = useSelector(state => state.CourseReducer.courseListNotRegister)
    // Pagination
    const [notConfirmedItems, setnotConfirmedItems] = useState([]);
    const [pageCount1, setPageCount1] = useState(0);
    const [itemOffset1, setitemOffset1] = useState(0);

    const [confirmedItems, setConfirmedItems] = useState([]);
    const [pageCount2, setPageCount2] = useState(0);
    const [itemOffset2, setitemOffset2] = useState(0);

    // Filter course Register
    const [coursesTerm, setCoursesTerm] = useState('')

    useEffect(() => {
        const endOffset = itemOffset1 + 2;
        console.log(`Loading items from ${itemOffset1} to ${endOffset}`);
        setnotConfirmedItems(courseListNotConfirmed && courseListNotConfirmed.slice(itemOffset1, endOffset));
        setPageCount1(Math.ceil(courseListNotConfirmed && courseListNotConfirmed.length / 2));
    }, [itemOffset1, courseListNotConfirmed])

    useEffect(() => {
        const endOffset = itemOffset2 + 2;
        console.log(`Loading items from ${itemOffset2} to ${endOffset}`);
        setConfirmedItems(courseListConfirmed && courseListConfirmed.slice(itemOffset2, endOffset));
        setPageCount2(Math.ceil(courseListConfirmed && courseListConfirmed.length / 2));
    }, [itemOffset2, courseListConfirmed])

    const handlePageClick1 = (event) => {
        const newOffset = event.selected * 2 % courseListNotConfirmed.length;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setitemOffset1(newOffset);
    };

    const handlePageClick2 = (event) => {
        const newOffset = event.selected * 2 % courseListConfirmed.length;
        console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
        setitemOffset2(newOffset);
    };
    //endPagination

    const [RegItem, setRegItem] = useState({})
    const getNotRegItem=(i)=>{
        i&&setRegItem(i)
    }


    useEffect(() => {
        // console.log(props.taiKhoanUser)
        dispatch(getCourseListConfirmed(props.taiKhoanUser))
        dispatch(getCourseListNotRegister(props.taiKhoanUser))
        dispatch(getCourseListNotConfirmed(props.taiKhoanUser))
    }, [props.taiKhoanUser])
    
    const renderCourseListNotConfirmed = (notConfirmedItems) => {
        return notConfirmedItems && notConfirmedItems.map((item, index) => {
            return <tr>
                <td className="align-middle" scope="row">{index + 1}</td>
                <td className="align-middle">{item.tenKhoaHoc}</td>
                <td>
                    <button onClick={()=>{regCourseByUser(props.taiKhoanUser,item.maKhoaHoc)}}className="btn btn-success mx-1" >Xác thực</button>
                    <button onClick={()=>{deleteCourseByUser(item.maKhoaHoc,props.taiKhoanUser)}} className="btn btn-danger mx-1" >Xóa</button>

                </td>
            </tr>
        })
    }

    const renderCourseListConfirmed = (confirmedItems) => {
        return confirmedItems && confirmedItems.map((item, index) => {
            return <tr>
                <td className="align-middle" scope="row">{index + 1}</td>
                <td className="align-middle">{item.tenKhoaHoc}</td>
                <td>
                    <button onClick={()=>{deleteCourseByUser(item.maKhoaHoc,props.taiKhoanUser)}} className="btn btn-danger mx-1" >Xóa</button>
                </td>
            </tr>
        })
    }
    
    // Xử lý thành viên chưa đăng ký
    // xử lý để có thể thay đổi dữ liệu ở ô input khi click vào thể li giá trị bị đè
    const handleCourseRes = (e) => {
        setCoursesTerm(e.target.value)
        // formik.setValues({tenKhoaHoc:e.target.value})
    }

    // Ở hàm này em thêm filter theo key trước khi mảng đó render thôi chị, chị nhìn là hiểu à
    const renderCourseListNotRegister = (notRegItems) => {
        if(notRegItems){
           return notRegItems.filter((items) => {
                if(coursesTerm.trim() === ''){
                    return items
                }else if(items.tenKhoaHoc.trim().toLocaleLowerCase().includes(coursesTerm.trim().toLocaleLowerCase())){
                    return items
                }
            }).map((item, index) => {
                return <li key={index} onClick={()=>{getNotRegItem(item) 
                    // formik.setValues({tenKhoaHoc:item.tenKhoaHoc})
                    setCoursesTerm(item.tenKhoaHoc)
                }} className="dropdown-item" href="#">{item.tenKhoaHoc}</li>
    
            })
        }else{
            return ''
        }
        
    }
    


    const regCourseByUser=async(taiKhoan,maKhoaHoc)=>{
        const values={taiKhoan:taiKhoan,maKhoaHoc:maKhoaHoc}
        try {
            let result = await http.post('/api/QuanLyKhoaHoc/GhiDanhKhoaHoc', values)
            alert(result.data)
            formik.resetForm()
            dispatch(getCourseListNotRegister(taiKhoan))
            dispatch(getCourseListConfirmed(taiKhoan))
            dispatch(getCourseListNotConfirmed(taiKhoan))

        } catch (errors) {
            alert(errors.response.data);
        }
    }

    const deleteCourseByUser=async(maKhoaHoc,taiKhoan)=>{
        const values={maKhoaHoc:maKhoaHoc,taiKhoan:taiKhoan}
        try {
            let result = await http.post('/api/QuanLyKhoaHoc/HuyGhiDanh', values)
            alert(result.data)
            dispatch(getCourseListNotRegister(taiKhoan))
            dispatch(getCourseListConfirmed(taiKhoan))
            dispatch(getCourseListNotConfirmed(taiKhoan))

        } catch (errors) {
            alert(errors.response.data);
        }
    }

    // Formik Register
    // Em bỏ k xử dựng cái này khong biết bị ảnh hưởng gì không? Nếu có thể chị có thể gọi hàm setFormikValue ở hàm handleCourseRes bằng formik.setValues({e.target.values}). Lúc đầu không nghỉ ra h mới nghỉ ra chị. Ở trên em có useState để khái báo coursesTerm với setcoursesTerm. để có thể thay đổi giá trị trong ô input. Em vừa thử xong nhưng no k nhảy danh sách theo key gõ chắc k được chị ơi. Vậy nên em dùng useState thay thế formik nha chị để xử lý gõ nó hiện danh sách theo key search. em có test rồi chị test lại xem có lỗi k nha. em có css cứng style cho ul)
    const formik = useFormik({
        initialValues: { tenKhoaHoc: coursesTerm },
    })
    // useEffect(() => {
    //     dispatch(getSearchCourseList(formik.values))
    // }, [formik.values])
    


    return (
        <div className="modal fade" id="userReg">
            <div className="modal-dialog formCourse">
                <div className="modal-content px-3">
                    {/* Modal Header */}
                    <div className="modal-body ">
                        <div className="pb-3 border-bottom border-secondary">
                            <div className="row">
                                <h5 className="text-left my-1 col-3" id="URM-title"> Chọn khóa học</h5>
                               
                                <form className='form-group col-6'>
                                <div className="input-group float-left ">
                                {/* value={formik.values.tenKhoaHoc} */}
                                {/* value={coursesTerm} */}
                                    <input onChange={handleCourseRes} value={coursesTerm}   data-toggle="dropdown" placeholder="Chọn khóa học" type="text" className="form-control input-dropdown" aria-label="Text input with segmented dropdown button" />
                                    {/* Chỗ này em ẩn luôn do cảm thấy bị dư */}
                                    <button style={{display:'none'}} data-reference="parent" data-boundary="window" type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false"></button>                          
                                    <div className="input-group-append ">
                                    {/* Em có css cứng chỗ này chị css lại nha do nó nhảy width */}
                                        <ul className="dropdown-menu set-height" style={{width:'100%', left:'2px'}}>
                                        {renderCourseListNotRegister(courseListNotRegister)}
                                        </ul>
                                    </div>

                                </div>
                            </form>
                          
                                <div className="col-3">
                                    <a onClick={()=>{regCourseByUser(props.taiKhoanUser,RegItem.maKhoaHoc)}} className="btn btn-success float-right">Ghi danh</a>

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Modal body */}
                    <div className="modal-body ">
                        <div className="border-bottom border-secondary">

                            <div className="row">
                                <h5 className="text-left col-6" id="URM-title"> Khóa học chờ xác thực</h5>
                            </div>
                            .<table class="table table-center table-hover myTable table-striped">
                                <thead class="text-dark bg-light">
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên khóa học</th>
                                        <th>Chờ xác nhận</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {renderCourseListNotConfirmed(notConfirmedItems)}
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
                                <h5 className="text-left col-6"> Khóa học đã ghi danh</h5>
                            </div>
                            .<table class="table table-center table-hover myTable table-striped">
                                <thead class="text-dark bg-light">
                                    <tr>
                                        <th>STT</th>
                                        <th>Tên khóa học</th>
                                        <th>Chờ xác nhận</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {renderCourseListConfirmed(confirmedItems)}

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
