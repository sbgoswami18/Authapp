import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const {
  SIGNUP_API,
  LOGIN_API,
} = endpoints

export function signUp(
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("User is already registered")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => { // This returned function is called a thunk function.
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true)) // dispatche action to the Redux store // When you call dispatch(action), Redux middleware intercepts the action and passes it to the redux store, which then update the state of the application based on that action.
    try {
      const response = await apiConnector("POST", LOGIN_API, { // This is asynchronous operation
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token)) // dispatche action to the Redux store // you are dispatching an action to set the user token in the Redux store. It tells Redux store to update the application state by setting the user token to the value received from the API response. // So, this line updates the Redux store with the user's token, making it(user's token) available throughout the application for authentication purposes.
      localStorage.setItem("token", JSON.stringify(response.data.token)) // This line sets a key-value pair in the local storage. The key "token" is used to identify the data, and the value is the token obtained from response.data.token. However, localStorage can only store string(JSON string). Here if response.data.token is an object or a non-string so JSON.stringify() is used to convert it into a JSON string representation before storing it in local storage.
      navigate("/dashboard")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false)) // dispatche action to the Redux store
    toast.dismiss(toastId) // This is a good practice to dismiss toast
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    localStorage.removeItem("token")
    toast.success("Logged Out")
    navigate("/")
  }
}

