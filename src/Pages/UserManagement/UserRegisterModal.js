import React from 'react'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { getCourseListNotConfirmed, getCourseListConfirmed, getCourseListNotRegister } from '../../Redux/action/CourseAction'
import { useFormik } from 'formik'
import { http } from '../../Util/setting'
import swal from 'sweetalert'

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

    // Filter course Register()
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
                    <button onClick={()=>{regCourseByUser(props.taiKhoanUser,item.maKhoaHoc)}}className="btn mx-1" id="btnThem" >X??c th???c</button>
                    <button onClick={()=>{deleteCourseByUser(item.maKhoaHoc,props.taiKhoanUser)}} className="btn btn-danger mx-1" >X??a</button>

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
                    <button onClick={()=>{deleteCourseByUser(item.maKhoaHoc,props.taiKhoanUser)}} className="btn btn-danger mx-1" >X??a</button>
                </td>
            </tr>
        })
    }
    
    // X??? l?? th??nh vi??n ch??a ????ng k??
    // x??? l?? ????? c?? th??? thay ?????i d??? li???u ??? ?? input khi click v??o th??? li gi?? tr??? b??? ????
    const handleCourseRes = (e) => {
        setCoursesTerm(e.target.value)
        // formik.setValues({tenKhoaHoc:e.target.value})
    }

    // ??? h??m n??y em th??m filter theo key tr?????c khi m???ng ???? render th??i ch???, ch??? nh??n l?? hi???u ??
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
            // alert(result.data)
            swal({
                title: result.data,
                icon: "success",
                timer: 2000,
                button: false,
            });
            // formik.resetForm()
            // Em b??? d??ng c??i reset form
            setCoursesTerm('')
            dispatch(getCourseListNotRegister(taiKhoan))
            dispatch(getCourseListConfirmed(taiKhoan))
            dispatch(getCourseListNotConfirmed(taiKhoan))

        } catch (errors) {
            // alert(errors.response.data);
            swal({
                title: errors.response?.data,
                icon: "warning",
                text: '???? x???y ra l???i vui l??ng quay l???i trang ch??? ho???c th??? l???i',
                timer: 2000,
                button: false,
            });
        }
    }

    const deleteCourseByUser=async(maKhoaHoc,taiKhoan)=>{
        const values={maKhoaHoc:maKhoaHoc,taiKhoan:taiKhoan}
        try {
            let result = await http.post('/api/QuanLyKhoaHoc/HuyGhiDanh', values)
            // alert(result.data)
            swal({
                title: result.data,
                icon: "success",
                timer: 2000,
                button: false,
            });
            dispatch(getCourseListNotRegister(taiKhoan))
            dispatch(getCourseListConfirmed(taiKhoan))
            dispatch(getCourseListNotConfirmed(taiKhoan))

        } catch (errors) {
            // alert(errors.response.data);
            swal({
                title: errors.response?.data,
                icon: "warning",
                text: '???? x???y ra l???i vui l??ng quay l???i trang ch??? ho???c th??? l???i',
                timer: 2000,
                button: false,
            });
        }
    }

    // Formik Register  
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
                        <div className="border-bottom border-secondary">
                            <div className="row">
                                <h5 className="text-left my-1 col-3" id="URM-title"> Ch???n kh??a h???c</h5>
                               
                                <form className='form-group col-6'>
                                <div className="input-group float-left ">
                                {/* value={formik.values.tenKhoaHoc} */}
                                {/* value={coursesTerm} */}
                                    <input onChange={handleCourseRes} value={coursesTerm}   data-toggle="dropdown" placeholder="Ch???n kh??a h???c" type="text" className="form-control input-dropdown" aria-label="Text input with segmented dropdown button" />
                                    {/* Ch??? n??y em ???n lu??n do c???m th???y b??? d?? */}
                                    <button style={{display:'none'}} data-reference="parent" data-boundary="window" type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-expanded="false"></button>                          
                                    <div className="input-group-append ">
                                    {/* Em c?? css c???ng ch??? n??y ch??? css l???i nha do n?? nh???y width */}
                                        <ul className="dropdown-menu set-height" style={{width:'100%', left:'2px'}}>
                                        {renderCourseListNotRegister(courseListNotRegister)}
                                        </ul>
                                    </div>
                                </div>
                            </form>
                          
                                <div className="col-3">
                                    <a onClick={()=>{regCourseByUser(props.taiKhoanUser,RegItem.maKhoaHoc)}} className="btn float-right" id="btnThem">Ghi danh</a>

                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Modal body */}
                    <div className="modal-body ">
                        <div className="border-bottom border-secondary">

                            <div className="row">
                                <h5 className="text-left col-6" id="URM-title"> Kh??a h???c ch??? x??c th???c</h5>
                            </div>
                            .<table class="table table-center table-hover myTable table-striped">
                                <thead class="text-dark bg-light">
                                    <tr>
                                        <th>STT</th>
                                        <th>T??n kh??a h???c</th>
                                        <th>Ch??? x??c nh???n</th>

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
                                previousLabel="< Tr?????c"
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
                                <h5 className="text-left col-6"> Kh??a h???c ???? ghi danh</h5>
                            </div>
                            .<table class="table table-center table-hover myTable table-striped">
                                <thead class="text-dark bg-light">
                                    <tr>
                                        <th>STT</th>
                                        <th>T??n kh??a h???c</th>
                                        <th>Ch??? x??c nh???n</th>

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
                                previousLabel="< Tr?????c"
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
