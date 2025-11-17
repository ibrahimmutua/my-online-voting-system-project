import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux'
import { UiActions } from '../store/ui-slice';
// import { voteActions } from '../store/vote-slice'
import { voteActions } from '../store/vote-slice';



const Election = ({_id:id,title,description,thumbnail}) => {
   

  var dispatch=useDispatch()
  var openModal=()=>{
    dispatch(UiActions.openUpdateElectionModal())
    dispatch(voteActions.changeIdOfElectionToUpdate(id))
  }


  var isAdmin =useSelector(state => state?.vote?.currentVoter?.isAdmin)
  return (
   <article className="elections">
    <img src={thumbnail} alt={title}/>
    <div className='elections_info'>
        <Link to={`/elections/${id}`}><h4>{title}</h4></Link>
        <p>{description?.length > 255 ? description.substring(0,255)+ '...':
            description}</p>
            <div className='elections_cta'>
                <Link to={`/elections/${id}`} className='btn sm'>View</Link>
                {isAdmin &&<button className="btn sm primary" onClick={openModal}>Edit</button>}
            </div>
    </div>
   </article>
  )
}

export default Election
