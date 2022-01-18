import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Route } from 'react-router'
import { getListCourse } from '../Redux/action/CourseAction'
import { getUserList } from '../Redux/action/UserAction'

export default function AdminTemplate(props) {
  const dispatch=useDispatch()
  return <Fragment>
    <Route exact path={props.path} render={(propsRoute) => {
      return <Fragment>  
        <div className="container-fluid align-middle bg-all">
          {/* Right  */}
          <div id="content" className="text-center wrapper align-middle">
            <nav id="sidebar" className='align-middle'>
              <div className="sidebar-header pt-4">
                <a href='/trangchu' type="button" id="sidebarCollapse" className="btn btn-light mx-2">
                  <span>
                    <i className="fa fa-home" />
                  </span>
                </a>
              </div>
              <ul className="list-unstyled components py-5 ">
                <li >
                  <a href="/admin/quanlynguoidung">
                    <i className="fa fa-user" />
                    Quản lý người dùng
                  </a>
                </li>
                <li>
                  <a href="/admin/quanlykhoahoc">
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