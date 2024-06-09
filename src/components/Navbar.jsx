import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../services/operations/authAPI';

const Navbar = () => {

  const {token} = useSelector( (state) => state.auth );
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return (
    <div className='flex justify-between bg-richblack-700 text-white px-4 py-4'>
      <div>
            <Link to="/">
                <button>
                    Home
                </button>
            </Link>
      </div>
      {
        token === null && (
          <div className='flex gap-x-4'>
            <div>
                <Link to="/login">
                    <button>
                        Login
                    </button>
                </Link>
            </div>
            <div>
                <Link to="/signup">
                    <button>
                        Signup
                    </button>
                </Link>
            </div>
          </div>
        )
      }
      {
        token !== null && (
            <div>
                <Link to="/">
                    <button onClick={() => dispatch(logout(navigate))}>
                        Logout
                    </button>
                </Link>
            </div>
        )
      }
      
    </div>
  )
}

export default Navbar
