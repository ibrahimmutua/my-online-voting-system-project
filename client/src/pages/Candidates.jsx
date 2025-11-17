import React,{useState, useEffect} from 'react'
//import {candidates as dummyCandidates} from '../data'
import {useParams} from 'react-router-dom'
import Candidate from '../components/Candidate'
import ConfirmVote from '../components/ConfirmVote'
import {useSelector} from 'react-redux'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
 const Candidates = () => {
 const navigate = useNavigate();
  var token=useSelector(state=>state?.vote?.currentVoter?.token)

  useEffect(()=>{
    if(!token){
      navigate('/')
    }
  },[])
  var {id:selectedElection}=useParams()
  var [candidates,setCandidates]=useState([])
  var [canVote,setCanVote]=useState(true)

  var voteCandidateModalShowing=useSelector(state=>state.ui.voteCandidateModalShowing)


  
  var voterId=useSelector(state=>state?.vote?.currentVoter?.id)
  var votedElections=useSelector(state=>state?.vote?.currentVoter?.votedElections)
  
  //  var candidates=dummyCandidates.filter(candidate=>candidate.election===id)
  var getCandidates=async()=>{
    try {
      var response=await axios.get(`${process.env.REACT_APP_API_URL}/elections/${selectedElection}/candidates`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      setCandidates(response.data)

    } catch (error) {
      console.log(error)
    }
  }

 

 var getVoter=async()=>{
  try {
    var response=await axios.get(`${process.env.REACT_APP_API_URL}/voters/${voterId}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
    var votedElection=await response.data.votedElections;
    if(votedElection.includes(selectedElection)){
      setCanVote(false)
    }
  } catch (error) {
    console.log(error)
  }
 }




  useEffect(()=>{
    getCandidates()
    // If we already have voterId, check whether they've voted in this election
    if(voterId){
      if(Array.isArray(votedElections) && votedElections.includes(selectedElection)){
        setCanVote(false)
      }else{
        // fallback to server check
        getVoter()
      }
    }
  },[])

  // Update canVote when votedElections changes (e.g., after voting)
  useEffect(()=>{
    if(Array.isArray(votedElections)){
      if(votedElections.includes(selectedElection)) setCanVote(false)
      else setCanVote(true)
    }
  },[votedElections, selectedElection])

  return (
  <>
  {/* <section style={{ marginTop: '5rem' }}> */}
   <section className="candidates">
    {!canVote ?  <header className="candidates_header">
       {/* <header className='candidates_header'> */}
      <h1>Already voted</h1>
     <p>You are only allowed to vote once.</p>
    </header>:<> {candidates.length >0 ? <header className="candidates_header">
       <h1>Vote your candidate</h1>
       <p>These are the candidates for this selected election.</p>
      </header>: <header className="candidates_header">
       <h1>Inactive Election</h1>
       <p>There are no candidates found for this election</p>
      </header>}
    <div className='container candidates_container'>
      {
        candidates.map(candidate=><Candidate key={candidate._id} {...candidate} />)
      }
    </div>
 </>}
  </section>
   {voteCandidateModalShowing &&<ConfirmVote selectedElection={selectedElection}/>}
  </>
  )
}

export default Candidates
