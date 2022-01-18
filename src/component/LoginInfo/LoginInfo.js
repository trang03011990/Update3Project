import React from 'react'
import { useHistory } from 'react-router'
import { useState, useEffect } from 'react'
import UserUpdateInfo from '../../Pages/UserManagement/UserUpdateInfo'

export default function LoginInfo() {
    const history = useHistory()
    const credentail = JSON.parse(localStorage.getItem('credentials'))

    //Dang xuat
    const userLogout = () => {
        localStorage.removeItem('credentials');
        if (!localStorage.getItem('credentials')) {
            alert('Bạn đã đăng xuất');
            history.push('/trangchu')
        }
    }

    const [UserUpdate, setUserUpdate] = useState({})
    const updateUser = (i) => {
        i && setUserUpdate(i)
    }
    return (
        <div className='loginInfo'>
            <span className="text-right text-dark font-weight-bold fs-1">Chào {credentail && credentail.taiKhoan},</span>
            <img className="rounded-circle ml-2" style={{ width: '40px', height: '40px' }} src={credentail && credentail.hinhAnh} alt="" />
            <span className="dropdown">
                <button className="btn btn-lg btn-white dropdown-toggle ml-1" type="button" id="dropdownMenuButton1" data-toggle="dropdown" aria-expanded="false">

                </button>
                <ul className="dropdown-menu " aria-labelledby="dropdownMenuButton1">
                    <li><a onClick={() => { updateUser(credentail) }} className="dropdown-item" data-toggle="modal" data-target="#userUpdateInfo">Cập nhật thông tin</a></li>
                    <li><a onClick={() => { userLogout() }} className="dropdown-item" href="#">Đăng xuất</a></li>
                </ul>
            </span>
            <UserUpdateInfo userUpdate={UserUpdate} />

        </div>

        
    )
}
