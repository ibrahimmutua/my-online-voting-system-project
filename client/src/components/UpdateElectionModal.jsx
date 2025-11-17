import React,{useState, useEffect} from 'react'
import {IoMdClose} from "react-icons/io"
import {useDispatch,useSelector} from 'react-redux'
import {UiActions} from '../store/ui-slice'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const UpdateElectionModal = () => {
    var [title,setTitle]=useState('')
    var [description,setDescription]=useState('')
    var [thumbnail,setThumbnail]=useState('')
    


    var dispatch=useDispatch()
    var idOfElectionToUpdate=useSelector(state=>state?.vote?.idOfElectionToUpdate)
    var token=useSelector(state=>state?.vote?.currentVoter?.token)
    var navigate=useNavigate()
   console.log(idOfElectionToUpdate)
    var closeModal=()=>{
       dispatch(UiActions.closeUpdateElectionModal())
    }

    var fetchElection=async()=>{
      try {
            var response= await axios.get(`${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}}) 
        var election=await response.data
        setTitle(election.title)
        setDescription(election.description)
      } catch (error) {
         console.log(error)
      }
    }


  useEffect(()=>{
   fetchElection()
  },[])


  var updateElection=async(e)=>{
   e.preventDefault()
   try {
      var electionData=new FormData()
      electionData.set('title',title)
      electionData.set('description',description)
      electionData.set('thumbnail',thumbnail)
      console.log("ID",idOfElectionToUpdate)
         var response=await axios.patch(`${process.env.REACT_APP_API_URL}/elections/${idOfElectionToUpdate}`,electionData,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      closeModal()
      navigate(0)
   } catch (error) {
     console.log(error) 
   }
  }

  return (
   <section className="modal">
    <div className="modal_content">
       <header className="modal_header">
          <h4>Edit Election</h4>
          <button className="modal_close" onClick={closeModal}><IoMdClose/></button>
       </header>
       <form onSubmit={updateElection}>
        <div>
            <h6>Election Title:</h6>
            <input type="text" value={title} onChange={e =>setTitle(e.target.value)} 
            name='title'/>
        </div>

         <div>
            <h6>Election Description:</h6>
            <input type="text" value={description} name='description' onChange=
            {e =>setDescription(e.target.value)}/>
        </div>

         <div>
            <h6>Election Thumbnail:</h6>
            <input type="file" name='thumbnail' onChange={e => setThumbnail
                (e.target.files[0])}  accept='png,jpg,jpeg,webp,avif,jfif'/>
        </div>
      <button type='submit' className='btn primary' >Update Election</button>
       </form>
    </div>
   </section>
  )
}

export default UpdateElectionModal

