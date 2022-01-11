import React from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { http } from '../../Util/setting';
import { useDispatch, useSelector } from 'react-redux'
import { courseCategory, getListCourse } from '../../Redux/action/CourseAction';
import { useEffect, useState } from 'react';
import swal from 'sweetalert'
export default function CourseUpdateModal(props) {
    const [thumb, setThumb] = useState(props.courseUpdate.hinhAnh)

    const coursesCategary = useSelector(state => state.CourseReducer.coursesCategary)
    const userArray = useSelector(state => state.UserReducer.userArray)

    const dispatch = useDispatch()
    const updateCourse = async (values) => {
        console.log(values)
        if(values.hinhAnh.name){
            let formData = new FormData();
            for (let key in values) {
                if (key !== 'hinhAnh') {
                    formData.append(key, values[key]);
                } else {
                    formData.append('hinhAnh', values.hinhAnh, values.hinhAnh.name)
                }
                console.log(formData.get('moTa'))
    
            }
            try {
                console.log(formData.get('hinhAnh'))
                let result = await http.post('/api/QuanLyKhoaHoc/CapNhatKhoaHocUpload', formData)
                if (result.request.status === 200) {
                    formik.resetForm()
                    // alert('Cập nhật thành công')
                    swal({
                        title: "Cập nhật thành công",
                        icon: "success",
                        timer: 2000,
                        button: false,
                    });
                    dispatch(getListCourse)
    
                }
    
            } catch (errors) {
                // alert(errors.response.data)
                swal({
                    title: errors.response?.data,
                    icon: "warning",
                    text: 'Đã xảy ra lỗi vui lòng quay lại trang chủ hoặc thử lại',
                    timer: 2000,
                    button: false,
                });
            }

        }else{
            try {
                let result = await http.put('/api/QuanLyKhoaHoc/CapNhatKhoaHoc', values)
                if (result.request.status === 200) {
                    formik.resetForm()
                    // alert('Cập nhật thành công')
                    swal({
                        title: "Cập nhật thành công",
                        icon: "success",
                        timer: 2000,
                        button: false,
                    });
                    dispatch(getListCourse)
                }
    
            } catch (errors) {
                // alert(errors.response.data)
                swal({
                    title: errors.response?.data,
                    icon: "warning",
                    text: 'Đã xảy ra lỗi vui lòng quay lại trang chủ hoặc thử lại',
                    timer: 2000,
                    button: false,
                });
            }


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
                .required('Tên khóa học không được để trống'),

            moTa: Yup.string()
                .required('Mô tả không được để trống'),

            ngayTao: Yup.string()
                .required('Ngày tạo không được để trống')
                .matches(/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/, 'Vui lòng nhập đúng định dạng DD/MM/YYYY'),
            // .format('DD/MM/YYYY', true),
            danhGia: Yup.number()
                .required('Đánh giá không được để trống')
                .max(5, 'Đánh giá nhiều nhất là 5 sao')
                .min(0, 'Đánh giá thấp nhất là 0 sao'),
            luotXem: Yup.number()
                .required('Đánh giá không được để trống')
                .min(0, 'Lượt xem thấp nhất là 0'),
            maDanhMucKhoaHoc: Yup.string()
                .required('Danh mục khóa học không được để trống'),
            taiKhoanNguoiTao: Yup.string()
                .required('Tài khoản không được để trống'),
            maNhom: Yup.string()
                .required('Mã nhóm không được để trống')
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
                        <h3 id="header-title">CẬP NHẬT</h3>
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
                                <button id="btnThem" type="submit" className="btn btn-success">CẬP NHẬT</button>
                                <button id="btnDong" type="button" className="btn btn-danger" data-dismiss="modal">Đóng</button>
                            </div>
                        </form>

                    </div>

                </div>
            </div>
        </div>
    )
}