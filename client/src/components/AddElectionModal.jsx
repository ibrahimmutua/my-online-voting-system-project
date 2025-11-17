import React,{useState} from 'react'
import {IoMdClose} from "react-icons/io"
import {useDispatch,useSelector} from 'react-redux'
import {UiActions} from '../store/ui-slice'
import axios from "axios"
import { useNavigate } from 'react-router-dom';


const AddElectionModal = () => {
    var [title,setTitle]=useState('')
    var [description,setDescription]=useState('')
    var [thumbnail,setThumbnail]=useState('')

    var dispatch=useDispatch()
    var navigate=useNavigate()

    var closeModal=()=>{
       dispatch(UiActions.closeElectionModal())
    }

    var token=useSelector(state=>state?.vote?.currentVoter?.token)
    
  
    var createElection=async(e)=>{
      e.preventDefault()
      try {
        var electionData=new FormData()
        electionData.set('title',title) 
         electionData.set('description',description) 
          electionData.set('thumbnail',thumbnail) 
          var response=await axios.post(`${process.env.REACT_APP_API_URL}/elections`,electionData,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
         console.log("create election",response)
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
          <h4>Create New Election</h4>
          <button className="modal_close" onClick={closeModal}><IoMdClose/></button>
       </header>
      <form onSubmit={createElection}>
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
      <button type='submit' className='btn primary' >Add Election</button>
       </form>
    </div>
   </section>
  )
}

export default AddElectionModal
