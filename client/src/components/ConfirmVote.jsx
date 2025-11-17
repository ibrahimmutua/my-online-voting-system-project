import React,{useState,useEffect} from 'react'
//import {candidates} from '../data'
import {useDispatch,useSelector} from 'react-redux'
import {UiActions} from '../store/ui-slice'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { voteActions } from '../store/vote-slice'
import {requestGeolocation} from '../utils/geolocation'



const ConfirmVote = ({selectedElection}) => {
    var [modalCandidate,setModalCandidate]=useState({})
    var [isSubmitting, setIsSubmitting] = useState(false)
    var [geoError, setGeoError] = useState('')

  var dispatch=useDispatch()
  var navigate=useNavigate()

 var closeCandidateModal=()=>{
    dispatch(UiActions.closeVoteCandidateModal())
    setGeoError('')
 }

var selectedVoteCandidate=useSelector(state=>state.vote.selectedVoteCandidate)
var token=useSelector(state=>state?.vote?.currentVoter?.token)
var currentVoter=useSelector(state=>state?.vote?.currentVoter)


var fetchCandidate= async()=>{
   try {
    var response=await axios.get(`${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
    setModalCandidate(await response.data)
   } catch (error) {
    console.log(error)
   }
}


var confirmVote=async()=>{
  setIsSubmitting(true)
  setGeoError('')
  
  try {
      // Request geolocation
      let geoData = null
      try {
        geoData = await requestGeolocation()
      } catch (geoErr) {
        console.warn('Geolocation not available:', geoErr.message)
        // Continue voting without geolocation if browser doesn't support it
      }

      // Send vote with geolocation data
      const votePayload = {
        selectedElection,
        ...(geoData && {
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          accuracy: geoData.accuracy
        })
      }

      var response=await axios.patch(
        `${process.env.REACT_APP_API_URL}/candidates/${selectedVoteCandidate}`,
        votePayload,
        {withCredentials:true,headers:{Authorization:`Bearer ${token}`}}
      )
      
      var voteResults=await response.data;
      const updatedVoter = {...currentVoter, votedElections: voteResults.votedElections || voteResults}
      // update redux and localStorage so protected routes and congrats can read token
      dispatch(voteActions.changeCurrentVoter(updatedVoter))
      localStorage.setItem('currentUser', JSON.stringify(updatedVoter))
      closeCandidateModal()
      navigate('/congrats')
  } catch (error) {
    console.error('confirmVote error', error.response || error.message)
    if(error.response?.status === 403){
      setGeoError('You are outside the voting region for this election.')
    } else {
      setGeoError(error.response?.data?.message || 'Failed to submit vote. Please try again.')
    }
    setIsSubmitting(false)
  }
}



useEffect(()=>{
    fetchCandidate()
},[])

  return (
    <section className='modal'>
        <div className='modal_center confirm_vote-content'>
            <h5>Please confirm your vote</h5>
            <div className='confirm_vote-image'>
                <img src={modalCandidate.image} alt={modalCandidate.fullName}/>
            </div>
            <h2>{modalCandidate?.fullName?.length>17 ?modalCandidate?.fullName?.substring(0,17) +"...":
            modalCandidate?.fullName}</h2>
            <p>{modalCandidate?.motto?.length>45 ?modalCandidate?.motto?.substring(0,45) +"...":
            modalCandidate?.motto}</p>
            {geoError && <p style={{color: 'var(--color-danger)', margin: '1rem 0', fontSize: '0.9rem'}}>{geoError}</p>}
            <div className='confirm_vote-cta'>
                <button className="btn" onClick={closeCandidateModal} disabled={isSubmitting}>Cancel</button>
                <button className="btn primary" onClick={confirmVote} disabled={isSubmitting}>
                  {isSubmitting ? 'Verifying...' : 'Confirm'}
                </button>
            </div>
        </div>
    </section>
  )
}

export default ConfirmVote
