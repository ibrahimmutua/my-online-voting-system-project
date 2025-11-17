import React, { useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { voteActions } from '../store/vote-slice'
import { useNavigate } from 'react-router-dom'
const Logout = () => {

  var dispatch=useDispatch()
  var navigate=useNavigate()
  useEffect(()=>{
    dispatch(voteActions.changeCurrentVoter(null))
    localStorage.removeItem('currentUser')
    localStorage.removeItem('token');
    navigate('/')
  })
  return (
 <></>
  )
}

export default Logout
