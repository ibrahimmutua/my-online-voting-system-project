import React, {useState} from 'react'
import {IoMdTrash} from 'react-icons/io'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'
const ElectionCandidate = ({fullName,image,motto,_id:id}) => {
var navigate=useNavigate()
var token=useSelector(state=>state?.vote?.currentVoter?.token)
var [deleting,setDeleting]=useState(false)
var [error,setError]=useState(null)
 
 
 var deleteCandidate=async ()=>{
    if(!token){
      setError('Not authenticated')
      return
    }
    if(!window.confirm('Delete this candidate?')) return
    setDeleting(true)
    setError(null)
    try {
    var response=await axios.delete(`${process.env.REACT_APP_API_URL}/candidates/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
    console.log('delete response', response.data)
    navigate(0)
    } catch (err) {
      console.error('Delete candidate failed', err.response || err.message)
      setError(err.response?.data?.message || err.response?.data || err.message)
    } finally {
      setDeleting(false)
    }
  }
  return (
   <li className='electionCandidate'>
    <div className='electionCandidate_image'>
        <img src={image} alt={fullName} />
    </div>
    <div>
        <h5>{fullName}</h5>
        <small>{motto?.length > 70 ? motto.substring(0,70) + "..." : motto}</small>
        <button className='electionCandidate_btn'onClick={deleteCandidate}><IoMdTrash /></button>
    </div>
   </li>
  )
}

export default ElectionCandidate
