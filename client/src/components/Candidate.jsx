import React from 'react'
import {UiActions} from '../store/ui-slice'
import { useDispatch } from 'react-redux'
import { voteActions } from '../store/vote-slice'

const Candidate = ({image,_id:id,fullName,motto}) => {


 var dispatch=useDispatch()
 var openCandidateModal=()=>{
    dispatch(UiActions.openVoteCandidateModal())
    dispatch(voteActions.changeSelectedVoteCandidate(id))
 }


  return (
   <article className='candidates'>
    <div className='candidates_image'>
        <img src={image} alt={fullName}/>
    </div>
       <h5>{fullName ?.length >20 ? fullName.substring(0,20)+ "..." : fullName}</h5>
       <small>{motto ?.length >25 ? motto.substring(0,25)+ "...": motto}</small>
       <button className='btn primary' onClick={openCandidateModal}>vote</button>

   </article>
  )
}

export default Candidate
