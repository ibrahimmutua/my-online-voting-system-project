import React from 'react'

const CandidateRating = ({fullName,image,voteCount,totalVotes}) => {
   const percent = totalVotes && totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0
   return (
 <li className="results_candidate">
      <div className="results_candidate-image">
         <img src={image} alt={fullName}/>
      </div>
      <div className='results_candidate-info'>

          <div>
            <h5>{fullName}</h5>
          <small>{`${voteCount} ${voteCount==1 ? "vote" :"votes"}`}</small>
          </div>
            <div className='results_candidate-rating'>
         <div className='results_candidate-loader'>
             <span style={{width: `${percent}%`}}></span>
         </div>
         <small>{`${percent.toFixed(0)}%`}</small>
         </div>
      </div>
 </li>
   )
}

export default CandidateRating
