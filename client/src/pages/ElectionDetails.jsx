import React,{useEffect,useState} from 'react'
import {useNavigate, useParams } from 'react-router-dom'
// import {elections} from '../data'
// import {candidates} from '../data'
// import {voters} from '../data'
import { IoAddOutline } from 'react-icons/io5';

import ElectionCandidate from '../components/ElectionCandidate';
import {useDispatch,useSelector} from 'react-redux'
import {UiActions} from '../store/ui-slice'
import AddCandidateModal from '../components/AddCandidateModal'
import axios from 'axios'
import {voteActions} from '../store/vote-slice'



const ElectionDetails = () => {

  var navigate=useNavigate()
  var {id} =useParams()
  var dispatch=useDispatch()

  var token=useSelector(state=>state?.vote?.currentVoter?.token)
  var isAdmin=useSelector(state=>state?.vote?.currentVoter?.isAdmin)

  useEffect(()=>{
    if(!token){
      navigate('/')
    }
  },[token,navigate])

  var [isLoading,setIsLoading]=useState(false)
  var [election,setElection]=useState([])
  var [candidates,setCandidates]=useState([])
  var [voters,setVoters]=useState([])


  //  var currentElection=elections.find(election=>election.id===id)

  // var electionCandidates=candidates.filter(candidate=>candidate.election==id)


  var addCandidateModalShowing=useSelector(state =>state.ui.addCandidateModalShowing)
  var addCandidateModalShowing=useSelector(state =>state.ui.addCandidateModalShowing)

  const getElection=async()=>{
   setIsLoading(true)
   try {
    var response=await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
    setElection(response.data);
  } catch (error) {
    console.log(error)
    
   }
  }

  var getCandidate=async ()=>{
    try {
      var response=await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
    setCandidates(response.data)
    } catch (error) {
      console.log(error)
    }
  }


  var getVoters=async ()=>{
    try {
     var response=await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/voters`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}}) 
     setVoters(response.data)
    } catch (error) {
      console.log(error)
    }
  }



  var deleteElection = async()=>{
    if(!token){
      console.error('deleteElection: no auth token')
      alert('You must be logged in as an admin to delete this election')
      return
    }
    if(!window.confirm('Delete this election and all its candidates?')) return
    try {
      var response=await axios.delete(`${process.env.REACT_APP_API_URL}/elections/${id}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      console.log('deleteElection response', response.data)
      navigate('/elections')
    } catch (error) {
      console.error('deleteElection error', error.response || error.message)
      alert(error.response?.data?.message || error.response?.data || error.message)
    }
  }


  useEffect(()=>{
    getElection()
    getCandidate()
    getVoters()
  },[])



  var openModal=()=>{
    dispatch(UiActions.openAddCandidateModal())
    dispatch(voteActions.changeAddCandidateElectionId(id))
  }
  return (
  <>
   <section className='electionDetails'>
      <div className="container electionDetails_container">
        <h2>{election.title}</h2>
        <p>{election.description}</p>
        <div className='electionDetails_image'>
          <img src={election.thumbnail} alt={election.title}/>
        </div>
        <menu className='electionDetails_candidates'>
        {
          candidates.map(candidate => <ElectionCandidate key={candidate._id} {...candidate}
            {...candidate} />)
        }
        {isAdmin && <button className='add_candidate-btn' onClick={openModal}><IoAddOutline /></button>}
        </menu>

        <menu className='voters'>
          <h2>Voters</h2>
          <table className="voters_table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
             {
              voters.map(voters => <tr key={voters._id}>
                <td><h5>{voters.fullName}</h5></td>
                <td>{voters.email}</td>
                <td>{voters.createdAt}</td>
              </tr>)
             } 
            </tbody>
          </table>
        </menu>
        {isAdmin && <button className='btn danger full' onClick={deleteElection}>Delete Election</button> }
      </div>
   </section>

   {addCandidateModalShowing &&<AddCandidateModal />}
  </>
  )
}

export default ElectionDetails
