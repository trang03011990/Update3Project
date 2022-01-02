import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { http } from '../../Util/setting';
import { useDispatch, useSelector } from 'react-redux'
import { courseCategory, getListCourse } from '../../Redux/action/CourseAction';
import { useEffect, useState } from 'react';

export default function CourseUpdateModal(props) {
    const [thumb, setThumb] = useState(props.courseUpdate.hinhAnh)

    const coursesCategary = useSelector(state => state.CourseReducer.coursesCategary)
    const userArray = useSelector(state => state.UserReducer.userArray)

    const dispatch = useDispatch()
    const updateCourse = async (values) => {
        console.log(values)
        let formData = new FormData();
        for (let key in values) {
            if (key !== 'hinhAnh') {
                formData.append(key, values[key]);
            } else {
                formData.append('hinhAnh', values.hinhAnh, values.hinhAnh.name)
            }
            console.log(formData.get('hinhAnh'))

        }
        try {
            console.log(formData.get('hinhAnh'))
            let result = await http.post('/api/QuanLyKhoaHoc/CapNhatKhoaHocUpload', formData)
            if (result.request.status === 200) {
                formik.resetForm()
                alert('Cập nhật thành công')
                dispatch(getListCourse)

            }

        } catch (errors) {
            alert(errors.response.data)
        }
    }
    
    const formik = useFormik({
        initialValues: {
            maKhoaHoc: "",
            biDanh: "",
            tenKhoaHoc: "",
            moTa: "",
            luotXem: "",
            danhGia: "",
            hinhAnh: {},
            maNhom: "",
            ngayTao: "",
            maDanhMucKhoaHoc: "",
            taiKhoanNguoiTao: ""
        },
        validationSchema: Yup.object().shape({
            maKhoaHoc: Yup.string()
                .required('Mã khóa học không được để trống'),

            tenKhoaHoc: Yup.string()
                .required('Tên Khóa học không được để trống'),

            moTa: Yup.string()
                .required('Mô tả không được để trống'),

            ngayTao: Yup.date()
                .required('Ngày tạo không được để trống')
            // .format('DD/MM/YYYY', true),

        }),
        onSubmit: updateCourse
    }
    )


    useEffect(() => {
        dispatch(courseCategory)
    }, [])
    useEffect(() => {
        // props.courseUpdate.maNhom="GP01"
        // props.courseUpdate.matKhau=""
        setThumb(props.courseUpdate.hinhAnh)
        console.log(props.courseUpdate)
        formik.setValues({maKhoaHoc: props.courseUpdate.maKhoaHoc,
        biDanh: "",
        tenKhoaHoc: props.courseUpdate.tenKhoaHoc,
        moTa: props.courseUpdate.moTa,
        luotXem: props.courseUpdate.luotXem,
        danhGia: 0,
        hinhAnh: props.courseUpdate.hinhAnh,
        maNhom: props.courseUpdate.maNhom,
        ngayTao: props.courseUpdate.ngayTao,
        maDanhMucKhoaHoc: props.courseUpdate.danhMucKhoaHoc&&props.courseUpdate.danhMucKhoaHoc.maDanhMucKhoahoc,
        taiKhoanNguoiTao: props.courseUpdate.nguoiTao&&props.courseUpdate.nguoiTao.taiKhoan})
    }, [props.courseUpdate])

    const renderCourseList = (coursesCategary) => {
        return coursesCategary.map((i) => {
            return <option value={i.maDanhMuc}>{i.tenDanhMuc}-{i.maDanhMuc}</option>
        })
    }

    const renderCreatorList = (userArray) => {
        return userArray.map((i) => {
            if (i.maLoaiNguoiDung == "GV") {
                return <option value={i.taiKhoan}>{i.taiKhoan}</option>
            }
        })
    }
    
    return (
        <div className="modal fade" id="updateCourse">
            <div className="modal-dialog formCourse">
                <div className="modal-content">

                    {/* Modal Header */}
                    <header className="head-form mb-0">
                        <h3 id="header-title">THÊM KHÓA HỌC</h3>
                    </header>
                    {/* Modal body */}
                    <div className="modal-body">
                        <form onSubmit={formik.handleSubmit} className="d-flex flex-wrap" role="form">
                            <div className="form-group col-6">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-user" /></span>
                                    </div>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.maKhoaHoc} type="text" name="maKhoaHoc" id="tknv" className="form-control input-sm" placeholder="Mã khóa học" />
                                </div>
                                {formik.errors.maKhoaHoc && <div className="text-danger text-left">{formik.errors.maKhoaHoc}</div>}
                            </div>
                            <div className="form-group col-6">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-address-book" /></span>
                                    </div>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.tenKhoaHoc} type="name" name="tenKhoaHoc" id="name" className="form-control input-sm" placeholder="Tên khóa học" />
                                </div>
                                {formik.errors.tenKhoaHoc && <div className="text-danger text-left">{formik.errors.tenKhoaHoc}</div>}
                            </div>
                            <div className="form-group col-6">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-briefcase" /></span>
                                    </div>
                                    <select onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.maDanhMucKhoaHoc} className="form-control" name="maDanhMucKhoaHoc">
                                        <option value="">Danh mục khóa học</option>
                                        {renderCourseList(coursesCategary)}
                                    </select>
                                </div>
                                {formik.errors.maDanhMucKhoaHoc && <div className="text-danger text-left">{formik.errors.maDanhMucKhoaHoc}</div>}
                            </div>

                            <div className="form-group col-6">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-calendar" /></span>
                                    </div>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.ngayTao} type="text" name="ngayTao" id="datepicker" className="form-control" placeholder="Ngày tạo" />
                                </div>
                                {formik.errors.ngayTao && <div className="text-danger text-left">{formik.errors.ngayTao}</div>}
                            </div>

                            <div className="form-group col-6">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-user" /></span>
                                    </div>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.danhGia} type="number" name="danhGia" id="tknv" className="form-control input-sm" placeholder="Đánh giá" />
                                </div>
                                {formik.errors.danhGia && <div className="text-danger text-left">{formik.errors.danhGia}</div>}
                            </div>
                            <div className="form-group col-6">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-address-book" /></span>
                                    </div>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.luotXem} type="number" name="luotXem" id="name" className="form-control input-sm" placeholder="Lượt xem" />
                                </div>
                                {formik.errors.luotXem && <div className="text-danger text-left">{formik.errors.luotXem}</div>}
                            </div>
                            <div className="form-group col-6">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-briefcase" /></span>
                                    </div>
                                    <select onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.taiKhoanNguoiTao} className="form-control" name="taiKhoanNguoiTao">
                                        <option value="">Người tạo</option>
                                        {renderCreatorList(userArray)}
                                    </select>
                                </div>
                                {formik.errors.taiKhoanNguoiTao && <div className="text-danger text-left">{formik.errors.taiKhoanNguoiTao}</div>}
                            </div>

                            <div className="form-group col-6">
                                <div>
                                    <input name='hinhAnh'
                                        accept="image/png,image/jpg,image/jpeg"
                                        onChange={(event) => {
                                            let file=event.target.files[0]
                                            let reader = new FileReader();
                                            reader.readAsDataURL(file);
                                            reader.onload = (e) => {
                                                setThumb(e.target.result)
                                            };
                                            formik.setFieldValue("hinhAnh", file);
                                            // console.log(formik.values)
                                        }}
                                        onBlur={formik.handleBlur} type="file" id="hinhAnh" />
                                    {/* <label className="custom-file-label text-left" htmlFor="hinhAnh"></label> */}

                                </div>
                                {formik.errors.hinhAnh && <div className="text-danger text-left">{formik.errors.hinhAnh}</div>}

                            </div>
                            <div className="form-group col-6">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-address-book" /></span>
                                    </div>
                                    <select onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.maNhom} className="form-control" name="maNhom">
                                        <option value="">Mã nhóm</option>
                                        <option value="GP01">GP01</option>
                                        <option value="GP02">GP02</option>
                                        <option value="GP03">GP03</option>
                                        <option value="GP04">GP04</option>
                                        <option value="GP05">GP05</option>
                                        <option value="GP06">GP06</option>
                                        <option value="GP07">GP07</option>
                                        <option value="GP08">GP08</option>
                                        <option value="GP09">GP09</option>
                                        <option value="GP10">GP10</option>
                                        <option value="GP11">GP11</option>
                                        <option value="GP12">GP12</option>
                                        <option value="GP13">GP13</option>
                                        <option value="GP14">GP14</option>
                                        <option value="GP15">GP15</option>



                                    </select>
                                </div>
                                {formik.errors.maNhom && <div className="text-danger text-left">{formik.errors.maNhom}</div>}
                            </div>
                            {/* <div className="form-group col-6">
                                        <label htmlFor="exampleFormControlFile1">HInh</label>
                                        <input type="file" className="form-control-file" id="exampleFormControlFile1" />
                                    
                                </div> */}


                            <div className="col-12 container text-justify">
                                <h5 className="card-header mb-2">Mô tả khóa học</h5>
                                {formik.touched.moTa && formik.errors.moTa && <div className="text-danger text-left">{formik.errors.moTa}</div>}
                                <div className="row">
                                    <span className='col-3'>
                                        <img src={thumb}
                                            className="img-fluid rounded"
                                            // alt={File&&File.name}
                                            height={200}
                                            width={200} />                                    </span>

                                    <textarea onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.moTa} type="text" name="moTa"
                                        className="form-control input-sm col-9"
                                        placeholder="Nhập mô tả" />
                                </div>
                            </div>

                            {/* Modal footer */}
                            <div className="modal-footer col-12" id="modal-footer">
                                <button id="btnThemNV" type="submit" className="btn btn-success">Thêm khóa học</button>
                                <button id="btnDong" type="button" className="btn btn-danger" data-dismiss="modal">Đóng</button>
                            </div>
                        </form>

                    </div>

                </div>
            </div>
        </div>
        // <div className="modal fade" id="updateCourse">
        //         <div className="modal-dialog formCourse">
        //             <div className="modal-content">

        //                 {/* Modal Header */}
        //                 <header className="head-form mb-0">
        //                     <h3 id="header-title">THÊM KHÓA HỌC</h3>
        //                 </header>
        //                 {/* Modal body */}
        //                 <div className="modal-body">
        //                     <form className="d-flex flex-wrap" role="form">
        //                         <div className="form-group col-6">
        //                             <div className="input-group">
        //                                 <div className="input-group-prepend">
        //                                     <span className="input-group-text"><i className="fa fa-user" /></span>
        //                                 </div>
        //                                 <input type="text" name="tk" id="tknv" className="form-control input-sm" placeholder="Mã khóa học" />
        //                             </div>
        //                             <span className="sp-thongbao" id="tbTKNV" />
        //                         </div>
        //                         <div className="form-group col-6">
        //                             <div className="input-group">
        //                                 <div className="input-group-prepend">
        //                                     <span className="input-group-text"><i className="fa fa-address-book" /></span>
        //                                 </div>
        //                                 <input type="name" name="name" id="name" className="form-control input-sm" placeholder="Tên khóa học" />
        //                             </div>
        //                             <span className="sp-thongbao" id="tbTen" />
        //                         </div>
        //                         <div className="form-group col-6">
        //                             <div className="input-group">
        //                                 <div className="input-group-prepend">
        //                                     <span className="input-group-text"><i className="fa fa-briefcase" /></span>
        //                                 </div>
        //                                 <select className="form-control" id="chucvu">
        //                                     <option>Danh mục khóa học</option>
        //                                     <option>Lập trình FrontEnd </option>
        //                                 </select>
        //                             </div>
        //                             <span className="sp-thongbao" id="tbChucVu" />
        //                         </div>

        //                         <div className="form-group col-6">
        //                             <div className="input-group">
        //                                 <div className="input-group-prepend">
        //                                     <span className="input-group-text"><i className="fa fa-calendar" /></span>
        //                                 </div>
        //                                 <input type="text" name="ngaylam" id="datepicker" className="form-control" placeholder="Ngày tạo" />
        //                             </div>
        //                             <span className="sp-thongbao" id="tbNgay" />
        //                         </div>

        //                         <div className="form-group col-6">
        //                             <div className="input-group">
        //                                 <div className="input-group-prepend">
        //                                     <span className="input-group-text"><i className="fa fa-user" /></span>
        //                                 </div>
        //                                 <input type="text" name="tk" id="tknv" className="form-control input-sm" placeholder="Đánh giá" />
        //                             </div>
        //                             <span className="sp-thongbao" id="tbTKNV" />
        //                         </div>
        //                         <div className="form-group col-6">
        //                             <div className="input-group">
        //                                 <div className="input-group-prepend">
        //                                     <span className="input-group-text"><i className="fa fa-address-book" /></span>
        //                                 </div>
        //                                 <input type="name" name="name" id="name" className="form-control input-sm" placeholder="Lượt xem" />
        //                             </div>
        //                             <span className="sp-thongbao" id="tbTen" />
        //                         </div>
        //                         <div className="form-group col-6">
        //                             <div className="input-group">
        //                                 <div className="input-group-prepend">
        //                                     <span className="input-group-text"><i className="fa fa-briefcase" /></span>
        //                                 </div>
        //                                 <select className="form-control" id="chucvu">
        //                                     <option>Người tạo</option>
        //                                     <option>Nguyễn Ngọc Trang </option>
        //                                 </select>
        //                             </div>
        //                             <span className="sp-thongbao" id="tbChucVu" />
        //                         </div>

        //                         <div className="form-group col-6">
        //                             <div className="custom-file">
        //                                 <input type="file" className="custom-file-input" id="customFile" />
        //                                 <label className="custom-file-label text-left" htmlFor="customFile">Chọn hình ảnh</label>
        //                             </div>

        //                         </div>
        //                         {/* <div className="form-group col-6">
        //                                 <label htmlFor="exampleFormControlFile1">HInh</label>
        //                                 <input type="file" className="form-control-file" id="exampleFormControlFile1" />
                                    
        //                         </div> */}


        //                         <div className="col-12 container text-justify">
        //                             <h5 className="card-header mb-2">Mô tả khóa học</h5>
        //                             <div className="d-float bg-light p-3">
        //                                 <img src="../img/logo512.png" className="img-fluid rounded w-25 mr-3 float-left" />

        //                                 <p className="card-text bg-light mt-2">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Doloribus amet quo facilis laborum deleniti enim consequuntur nisi totam, vero suscipit debitis accusamus ipsum eveniet ipsam eligendi velit cum iste consectetur maiores repellendus nam doloremque natus. Consectetur cumque iure magni quae minus numquam sint saepe, iusto eligendi laborum inventore ducimus temporibus ut at sed adipisci necessitatibus nam. Maiores praesentium provident autem, harum dicta fugit, minima iste ea culpa, cum consequuntur debitis eius eos quos nostrum! Cumque eius facere voluptate maxime dolorum?</p>
        //                             </div>
        //                         </div>
        //                     </form>

        //                 </div>
        //                 {/* Modal footer */}
        //                 <div className="modal-footer" id="modal-footer">
        //                     <button id="btnThemNV" type="button" className="btn btn-success">Thêm khóa học</button>
        //                     <button id="btnCapNhat" type="button" className="btn btn-success">Cập nhật</button>
        //                     <button id="btnDong" type="button" className="btn btn-danger" data-dismiss="modal">Đóng</button>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
    )
}
