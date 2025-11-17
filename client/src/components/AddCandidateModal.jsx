import React,{useState} from 'react'
import {IoMdClose} from 'react-icons/io'
import {useDispatch,useSelector} from 'react-redux'
import {UiActions} from '../store/ui-slice'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
const AddCandidateModal = () => {

    var [fullName,setFullName]=useState("")
    var [motto,setMotto]=useState("")
    var [image,setImage]=useState("")

   var dispatch=useDispatch()
   var navigate=useNavigate()
   var closeModal=()=>{
    dispatch(UiActions.closeAddCandidateModal())
   } 

   var token=useSelector(state=>state?.vote?.currentVoter?.token)
    var electionId=useSelector(state=>state?.vote?.addCandidateElectionId)
  var isAdmin = useSelector(state=>state?.vote?.currentVoter?.isAdmin)
   var [error,setError]=useState(null)

   var addCandidate =async (e)=>{
    e.preventDefault()
    setError(null)
    if(!token){
      setError('Not authenticated. Please log in.')
      return
    }
    if(!electionId){
      setError('No election selected. Open the add-candidate modal from an election.')
      return
    }
    if(!fullName || !motto){
      setError('Fill in all fields')
      return
    }
    if(!image){
      setError('Choose an image file')
      return
    }

    try {
     var candidateInfo=new FormData()
     candidateInfo.set('fullName',fullName) 
     candidateInfo.set('motto',motto) 
     candidateInfo.set('image',image) 
     candidateInfo.set('currentElection',electionId)
     if(!isAdmin){
       setError('Only admins can add candidates')
       return
     }
     var res = await axios.post(`${process.env.REACT_APP_API_URL}/candidates`,candidateInfo,{withCredentials: true, headers:{Authorization:`Bearer ${token}`}})
     // close modal and refresh
     dispatch(UiActions.closeAddCandidateModal())
     navigate(0)
    } catch (err) {
      // show server response if available
      const serverMsg = err.response?.data?.message || err.response?.data || err.message
      console.error('Add candidate failed:', err.response || err)
      setError(serverMsg)
    }
   }

  return (
  <section className='modal'>
    <div className='modal_content'>
        <header className='modal_header'>
            <h4>Add Candidate</h4>
            <button className='modal_close' onClick={closeModal}><IoMdClose/></button>
        </header>
        <form onSubmit={addCandidate}>
          <div>
              <h6>Candidate Name</h6> 
              <input type='text' value={fullName} name='fullName' onChange={e =>setFullName
                (e.target.value)}/> 
            </div>

            <div>
              <h6>Candidate Motto</h6> 
              <input type='text' value={motto} name='motto' onChange={e =>setMotto
                (e.target.value)}/> 
            </div>

            <div>
              <h6>Candidate Image</h6> 
              <input type='file'  name='image' onChange={e =>setImage
                (e.target.files[0])} accept='png,jpg,jpeg,webp,avif,jfif'/> 
            </div>
            <button type='submit' className='btn primary'>Add Candidate</button>
            {error && <p className='form_error' style={{color:'var(--color-danger)',marginTop:'1rem'}}>{error}</p>}
        </form>
    </div>
  </section>
  )
}

export default AddCandidateModal
