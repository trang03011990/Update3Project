import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route } from 'react-router'
import { getListCourse } from '../Redux/action/CourseAction'
import { getUserList } from '../Redux/action/UserAction'

export default function AdminTemplate(props) {
  const dispatch=useDispatch()
  const [active, setactive] = useState("")
  const addID = () => {
    if (active == "") {
      setactive("active")
    } else {
      setactive("")
    }
  }

  return <Fragment>
    <Route exact path={props.path} render={(propsRoute) => {
      return <Fragment>
        
        <div className=" container-fluid">
          {/* Right  */}
          <div id="content" className="text-center wrapper">
            <nav id="sidebar" className={active}>
              <div className="sidebar-header">
                <h3>Elearning</h3>
                {/* <strong>ML</strong> */}
                <button onClick={addID} type="button" id="sidebarCollapse" className="btn btn-light mx-2">
                  <span>
                    <i className="fa fa-list" />
                  </span>
                  {/* <span>Ẩn/Hiện</span> */}
                </button>
              </div>
              <ul className="list-unstyled components">
                <li className="">
                  <a onClick={dispatch(getUserList)} href="/admin/quanlynguoidung">
                    <i className="fa fa-home" />
                    Quản lý người dùng
                  </a>
                </li>
                <li>
                  <a onClick={dispatch(getListCourse)} href="/admin/quanlykhoahoc">
                    <i className="fa fa-briefcase" />
                    Quản lý khóa học
                  </a>

                </li>

              </ul>

            </nav>
            {/* endRight */}

            {/* Left  */}
            <props.component {...propsRoute} />
            {/* endLeft */}
          </div>

        </div>



      </Fragment>
    }} />

  </Fragment>
}
