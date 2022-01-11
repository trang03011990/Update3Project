import React, { useState } from 'react'
// import { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { http } from '../../Util/setting';
// import {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getUserList } from '../../Redux/action/UserAction';
import { useEffect } from 'react';
import swal from 'sweetalert';

export default function UserUpdateInfo(props) {
    //Handle addUser
    const dispatch = useDispatch()
    const updateUser = async (values) => {
        try {
            let result = await http.put('/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung', values)
            if (result.request.status === 200) {
                formik.resetForm()
                // alert('Cập nhật thành công')
                swal({
                    title: "Cập nhật thành công",
                    icon: "success",
                    timer: 2000,
                    button: false,
                });
                dispatch(getUserList)

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
    
    const formik = useFormik({
        initialValues: {
            taiKhoan: '',
            matKhau: '',
            hoTen: '',
            soDt: '',
            maLoaiNguoiDung: '',
            maNhom: 'GP01',
            email: ''
        },
        validationSchema: Yup.object().shape({
            taiKhoan: Yup.string()
                .min(2, 'Tài khoản quá ít kí tự')
                .max(16, 'Tài khoản quá 16 kí tự')
                .required('Tài khoản không được để trống'),

            matKhau: Yup.string()
                .required('Nhập lại mật khẩu')
                .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Mật khẩu phải ít nhất 8 ký tự gồm chữ, số, và kí tự đặc biệt'),

            hoTen: Yup.string()
                .required('Tên không được để trống')
                .matches(/^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" + "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" + "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý\\s]+$/, 'Chỉ nhập kí tự chữ'),

            email: Yup.string().email('Email không hợp lệ').required('Email không được để trống'),

            soDt: Yup.string()
                .required('Số điện thoại không được để trống')
                .matches(/([\+84|84|0]+(3|5|7|8|9|1[2|6|8|9]))+([0-9]{8})\b/, 'Số điện thoại chưa đúng định đạng'),
            maLoaiNguoiDung: Yup.string().required('Vui lòng chọn người dùng !'),
        }),
        onSubmit: updateUser
    }

    )
    useEffect(() => {
        props.userUpdate.maNhom="GP01"
        // console.log(props.userUpdate)
        formik.setValues(props.userUpdate)
    }, [props.userUpdate])
    return (
        <div className="modal fade" id="userUpdateInfo">
            <div className="modal-dialog formUser">
                <div className="modal-content px-3">
                    <header className="head-form mb-0">
                        <h3 id="header-title">THÔNG TIN NGƯỜI DÙNG</h3>
                    </header>

                    <div className="modal-body">
                        <form onSubmit={formik.handleSubmit} role="form">
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-user" /></span>
                                    </div>
                                    <input value={formik.values.taiKhoan} onChange={formik.handleChange} onBlur={formik.handleBlur} name="taiKhoan" id="tknv" className="form-control input-sm" placeholder="Tài khoản" />
                                </div>
                                {formik.errors.taiKhoan && <div className="text-danger text-left">{formik.errors.taiKhoan}</div>}
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-address-book" /></span>
                                    </div>
                                    <input value={formik.values.hoTen} onChange={formik.handleChange} onBlur={formik.handleBlur} type="name" name="hoTen" id="name" className="form-control input-sm" placeholder="Họ và tên" />
                                </div>
                                {formik.errors.hoTen && <div className="text-danger text-left">{formik.errors.hoTen}</div>}
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-envelope" /></span>
                                    </div>
                                    <input value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" name="email" id="email" className="form-control input-sm" placeholder="Email" />
                                </div>
                                {formik.errors.email && <div className="text-danger text-left">{formik.errors.email}</div>}
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-key" /></span>
                                    </div>
                                    <input value={formik.values.matKhau} onChange={formik.handleChange} onBlur={formik.handleBlur} type="password" name="matKhau" id="password" className="form-control input-sm" placeholder="Mật khẩu" />
                                </div>
                                {formik.errors.matKhau && <div className="text-danger text-left">{formik.errors.matKhau}</div>}
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-phone" /></span>
                                    </div>
                                    <input value={formik.values.soDt} onChange={formik.handleChange} onBlur={formik.handleBlur} type="text" name="soDt" id="datepicker" className="form-control" placeholder="Số điện thoại" />
                                </div>
                                {formik.errors.soDt && <div className="text-danger text-left">{formik.errors.soDt}</div>}
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><i className="fa fa-briefcase" /></span>
                                    </div>
                                    <select value={formik.values.maLoaiNguoiDung} onChange={formik.handleChange} onBlur={formik.handleBlur} className="form-control" id="chucvu" name="maLoaiNguoiDung">
                                        <option value="">Loại người dùng</option>
                                        <option value="GV">Giáo vụ</option>
                                        <option value="HV">Học viên</option>
                                    </select>
                                </div>
                                {formik.errors.maLoaiNguoiDung && <div className="text-danger text-left">{formik.errors.maLoaiNguoiDung}</div>}
                            </div>
                            
                            <div className="modal-footer" id="modal-footer">
                                <button id="btnThem" type="submit" className="btn">Cập nhật</button>
                                <button id="btnDong" type="button" className="btn btn-danger" data-dismiss="modal">Đóng</button>
                            </div>

                        </form>
                    </div>
                    {/* Modal footer */}

                </div>
            </div>
        </div>
    )
}
