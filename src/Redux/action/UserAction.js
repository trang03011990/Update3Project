import { http } from "../../Util/setting"
import { GET_SEARCH_LIST_NOT_REG, GET_USER_LIST_CONFIRMED, GET_USER_LIST_NOTCONFIRMED, GET_USER_LIST_NOT_REGISTER, CANCEL_COURSE, GET_INFO_USER, GET_MY_COURSE, LOG_IN, UP_DATE, GET_USER_LIST, GET_SEARCH_LIST, NOT_LOGIN_REGISTER_COURSE } from "../types/userTypes"
import swal from 'sweetalert'
// Handle SignUp
export const handleSignup = async (values, formikSignup) => {
    try {
        let result = await http.post('/api/QuanLyNguoiDung/DangKy', values)

        if (result.request.status === 200) {
            formikSignup.resetForm()
            // alert('Đăng kí thành công')
            swal({
                title: "Đăng kí thành công",
                icon: "success",
                timer: 2000,
                button: false,
            });
        }

    } catch (errors) {
        swal({
            title: errors.response?.data,
            icon: "warning",
            text: 'Đã xảy ra lỗi vui lòng quay lại trang chủ hoặc thử lại',
            timer: 2000,
            button: false,
        });
        // alert(errors.response?.data)
    }
}

// userLogin
export const userLogin = (values, formikLogin) => {
    return async (dispatch) => {
        try {
            let resultLogin = await http.post('/api/QuanLyNguoiDung/DangNhap', values)

            const action = {
                type: LOG_IN,
                data: {
                    ...resultLogin.data,
                    hinhAnh: 'https://cdn.dribbble.com/users/2364329/screenshots/6676961/02.jpg?compress=1&resize=800x600'
                }
            }
            dispatch(action)

            if (resultLogin.request.status === 200) {
                localStorage.setItem('credentials', JSON.stringify({
                    ...resultLogin.data,
                    hinhAnh: 'https://cdn.dribbble.com/users/2364329/screenshots/6676961/02.jpg?compress=1&resize=800x600'
                }))

                // alert('Đăng nhập thành công')
                formikLogin.resetForm()
            }


        } catch (errors) {
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

//userRegister course not login
export const userNotloginRegis = (maKhoaHoc) => {
    return (dispatch) => {
        const action = {
            type: NOT_LOGIN_REGISTER_COURSE ,
            data : maKhoaHoc
        }
        dispatch(action)
    }
}

export const getCredentailFromLocal = (dispatch) => {
    const credentailLocal = localStorage.getItem('credentials')

    if (credentailLocal) {
        const credentailvalues = JSON.parse
            (credentailLocal)

        const action = {
            type: LOG_IN,
            data: credentailvalues

        }
        dispatch(action)

    }
}

// Get user's info
export const getUserInfo = async (dispatch) => {
    const credentailLocal = localStorage.getItem('credentials')
    if (credentailLocal) {
        const credentailvalues = JSON.parse
            (credentailLocal)

        const values = {
            taiKhoan: credentailvalues.taiKhoan,
            matKhau: credentailvalues.matKhau
        }

        try {
            let result = await http.post('api/QuanLyNguoiDung/ThongTinTaiKhoan', values)

            const action = {
                type: GET_INFO_USER,
                data: result.data
            }

            dispatch(action)
        } catch (errors) {
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

// User Update
export const userUpdate = (values, formik) => {
    const credentailLocal = localStorage.getItem('credentials')

    if (credentailLocal) {
        return async (dispatch) => {
            try {
                let result = await http.put('api/QuanLyNguoiDung/CapNhatThongTinNguoiDung', values)
                // console.log(result);

                if (result.request.status === 200) {
                    formik.resetForm()
                    swal({
                        title: "Cập nhật thành công",
                        icon: "success",
                        timer: 2000,
                        button: false,
                    });
                }

                const action = {
                    type: UP_DATE,
                    data: result.data
                }

                dispatch(action)
            } catch (errors) {
                swal({
                    title: errors.response?.data,
                    icon: "warning",
                    text: 'Đã xảy ra lỗi vui lòng quay lại trang chủ hoặc thử lại',
                    timer: 2000,
                    button: false,
                });
                // alert(errors.response?.data)
            }
        }
    }

}

// Cancel Course
export const userCancelCourse = (maKhoaHoc) => {
    return async (dispatch) => {
        const credentailLocal = localStorage.getItem('credentials')
        if (credentailLocal) {
            const credentailvalues = JSON.parse
                (credentailLocal)

            const cancleCoure = {
                taiKhoan: credentailvalues.taiKhoan,
                maKhoaHoc: maKhoaHoc
            }

            try {
                let resultCancel = await http.post('api/QuanLyKhoaHoc/HuyGhiDanh', cancleCoure)

                if (resultCancel.request.status === 200) {
                    dispatch(getUserInfo)
                }

            } catch (errors) {
                console.log(errors.response?.data);
            }
        }
    }

}

//

export const getUserList = async (dispatch) => {
    try {
        let result = await http.get('/api/QuanLyNguoiDung/LayDanhSachNguoiDung')
        const action = {
            type: GET_USER_LIST,
            data: result.data
        }
        dispatch(action)
    } catch (errors) {
        alert(errors)
    }
}

export const getSearchList = (v) => {
    console.log(v)
    return async (dispatch) => {
        try {
            let result = await http.get(`/api/QuanLyNguoiDung/TimKiemNguoiDung?tuKhoa=${v}`)
            console.log(result.data)
            const action = {
                type: GET_SEARCH_LIST,
                data: result.data
            }
            dispatch(action)
        } catch (errors) {
            alert(errors)
        }
    }
}

export const getSearchListNotReg = (tuKhoa,ListNotReg) => {
    return (dispatch) => {
        const searchItem=[];
        ListNotReg.filter(item=>item.includes(tuKhoa)).map(filteredItem=>{
            searchItem.push(filteredItem)
        })
        try {
            const action = {
                type: GET_SEARCH_LIST_NOT_REG,
                data: searchItem
            }
            dispatch(action)
        } catch (e) {
            console.log(e)
        }

    }

}


// export const courseSearchList1 = (tuKhoa) => {
//     console.log(tuKhoa)
//     return async (dispatch) => {
//         try {
//             let result = await http.get(`/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${tuKhoa}`)
//             const action = {
//                 type: GET_COURSE_LIST,
//                 data: result.data
//             }
//             dispatch(action)
//         } catch (error) {
//             console.log(error)

//         }
//     }
// }

export const getUserListNotConfirmed = (maKhoaHoc) => {
    console.log(maKhoaHoc)
    return async (dispatch) => {
        try {
            let result = await http.post('/api/QuanLyNguoiDung/LayDanhSachHocVienChoXetDuyet', { maKhoaHoc })
            console.log(result.data)
            const action = {
                type: GET_USER_LIST_NOTCONFIRMED,
                data: result.data
            }

            dispatch(action)
        } catch (error) {
            console.log(error.response)
        }
    }
}

export const getUserListConfirmed = (maKhoaHoc) => {
    console.log(maKhoaHoc)
    return async (dispatch) => {
        try {
            let result = await http.post('/api/QuanLyNguoiDung/LayDanhSachHocVienKhoaHoc', { maKhoaHoc })
            console.log(result.data)
            const action = {
                type: GET_USER_LIST_CONFIRMED,
                data: result.data
            }

            dispatch(action)
        } catch (error) {
            console.log(error.response)
        }
    }
}

export const getUserListNotRegister = (maKhoaHoc) => {
    console.log(maKhoaHoc)
    return async (dispatch) => {
        try {
            let result = await http.post('https://elearningnew.cybersoft.edu.vn/api/QuanLyNguoiDung/LayDanhSachNguoiDungChuaGhiDanh', { maKhoaHoc })
            console.log(result.data)
            const action = {
                type: GET_USER_LIST_NOT_REGISTER,
                data: result.data
            }

            dispatch(action)
        } catch (error) {
            console.log(error.response)
        }
    }
}
