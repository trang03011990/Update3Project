// import axios from "axios";
import { http } from "../../Util/setting";
import {GET_COURSE_LIST_NOT_REGISTER, GET_COURSE_LIST_CONFIRMED,GET_COURSE_LIST_NOTCONFIRMED,GET_COURSE_PAGINATION, GET_COURSE_CATEGORY, GET_COURSE_CATEGORY_LIST, GET_COURSE_DETAIL, GET_COURSE_LIST, GET_COURSE_SEARCH_LIST } from "../types/courseTypes";
import { LOADING_COMPONENT_HIDE, LOADING_COMPONENT_SHOW, RENDER_PAGE_HIDE, RENDER_PAGE_SHOW } from "../types/isLoadingTypes";
import swal from 'sweetalert'

// get Category
export const courseCategory = async (dispatch) => {
    try {
        let result = await http.get('/api/QuanLyKhoaHoc/LayDanhMucKhoaHoc')

        const action = {
            type: GET_COURSE_CATEGORY,
            data: result.data
        }

        dispatch(action)
    } catch (error) {
        console.log(error)
    }
}

// Course for category
export const courseCategoryList = (maDanhMuc) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`api/QuanLyKhoaHoc/LayKhoaHocTheoDanhMuc?maDanhMuc=${maDanhMuc}&MaNhom=GP01`)

            const action = {
                type: GET_COURSE_CATEGORY_LIST,
                data: result.data
            }

            dispatch(action)
        } catch (error) {
            console.log(error)
        }
    }
}

// Search course
export const courseSearchList = (tuKhoa) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${tuKhoa}&MaNhom=GP01`)

            const action = {
                type: GET_COURSE_SEARCH_LIST,
                data: result.data
            }

            dispatch(action)
        } catch (error) {
            console.log(error)

        }
    }
}

// Detail course
export const getCourseDetail = (maKhoaHoc) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/api/QuanLyKhoaHoc/LayThongTinKhoaHoc?maKhoaHoc=${maKhoaHoc}`)

            const action = {
                type: GET_COURSE_DETAIL,
                data: result.data
            }

            dispatch(action)
        } catch (error) {
            console.log(error)
        }
    }
}

// Regist Course
export const registerCourse = async (maKhoaHoc) => {
    const credentailLocal = localStorage.getItem('credentials')
    if (credentailLocal) {
        const credentailvalues = JSON.parse
            (credentailLocal)

        const valuesRegisCoure = {
            taiKhoan: credentailvalues.taiKhoan,
            maKhoaHoc: maKhoaHoc
        }

        try {
            let result = await http.post('/api/QuanLyKhoaHoc/DangKyKhoaHoc', valuesRegisCoure)
            // console.log(result);
            swal({
                title: "Đăng kí thành công",
                icon: "success",
                timer: 2000,
                button: false,
            });
        } catch (errors) {
            // console.log(errors.response.data);
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

// Course Pagination
export const getCoursePag = (currentPage, count) => {
    return async (dispatch) => {
        try {
            
            await dispatch({
                type: RENDER_PAGE_HIDE
            })
            
            await dispatch({
                type: LOADING_COMPONENT_SHOW
            })

            let result = await http.get(`api/QuanLyKhoaHoc/LayDanhSachKhoaHoc_PhanTrang?page=${currentPage}&pageSize=${count}&MaNhom=GP01`)
            // console.log(result);
            const action = {
                type: GET_COURSE_PAGINATION,
                data: result.data
            }
            await dispatch(action)

            setTimeout(async () => {
                await dispatch({
                    type: LOADING_COMPONENT_HIDE
                })
                await dispatch({
                    type: RENDER_PAGE_SHOW
                })
            }, 500)
            clearTimeout()
        } catch (error) {
            console.log(error);
        }
    }
}

//
export const getListCourse = async (dispatch) => {
    try {
        let result = await http.get('api/QuanLyKhoaHoc/LayDanhSachKhoaHoc')

        const action = {
            type: GET_COURSE_LIST,
            data: result.data
        }

        dispatch(action)
    } catch (error) {
        console.log(error)
    }
}


export const courseSearchList1 = (tuKhoa) => {
    // console.log(tuKhoa)
    return async (dispatch) => {
        try {
            let result = await http.get(`/api/QuanLyKhoaHoc/LayDanhSachKhoaHoc?tenKhoaHoc=${tuKhoa}`)
            const action = {
                type: GET_COURSE_LIST,
                data: result.data
            }
            dispatch(action)
        } catch (error) {
            console.log(error)

        }
    }
}

export const getCourseListNotConfirmed=(taiKhoan)=>{
    console.log(taiKhoan)
    return async(dispatch)=>{
        try {
            let result = await http.post('api/QuanLyNguoiDung/LayDanhSachKhoaHocChoXetDuyet',{taiKhoan})
            console.log(result.data)
            const action = {
                type: GET_COURSE_LIST_NOTCONFIRMED,
                data: result.data
            }
    
            dispatch(action)
        } catch (error) {
            console.log(error.response)
        }
    }
}

export const getCourseListConfirmed=(taiKhoan)=>{
    // console.log(taiKhoan)
    return async(dispatch)=>{
        try {
            let result = await http.post('/api/QuanLyNguoiDung/LayDanhSachKhoaHocDaXetDuyet',{taiKhoan})
            console.log(result.data)
            const action = {
                type: GET_COURSE_LIST_CONFIRMED,
                data: result.data
            }
    
            dispatch(action)
        } catch (error) {
            console.log(error.response)
        }
    }
}

export const getCourseListNotRegister=(taiKhoan)=>{
    // console.log(taiKhoan)
    return async(dispatch)=>{
        try {
            let result = await http.post(`/api/QuanLyNguoiDung/LayDanhSachKhoaHocChuaGhiDanh?TaiKhoan=${taiKhoan}`)
            console.log(result.data)
            const action = {
                type: GET_COURSE_LIST_NOT_REGISTER,
                data: result.data
            }
    
            dispatch(action)
        } catch (error) {
            console.log(error.response)
        }
    }
}




