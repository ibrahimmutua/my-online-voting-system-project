import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom'
import {candidates} from '../data';
import CandidateRating from './CandidateRating';
import axios from "axios"
import {useSelector} from 'react-redux'
import Loader from './Loader';


const ResultElection = ({_id:id,thumbnail,title}) => {

    var [totalVotes,setTotalVotes]=useState(0)

    // const electionCandidates=candidates.filter(candidate =>{
    //     return candidate.election==id
    // })
  var [electionCandidates,setElectionCandidates]=useState([])
  var [isLoading,setIsLoading]=useState(false)
  var token=useSelector(state=>state?.vote?.currentVoter?.token)
  var getCandidate=async ()=>{
    setIsLoading(true)
    try {
      var response=await axios.get(`${process.env.REACT_APP_API_URL}/elections/${id}/candidates`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      var candidates=await response.data
      setElectionCandidates(candidates)
      // compute total votes once
      const sum = candidates.reduce((acc, c) => acc + (c.voteCount || 0), 0)
      setTotalVotes(sum)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    getCandidate()
  },[])

  return (
  <>
  {isLoading && <Loader />}
  <article className='results'>
    <header className='results_header'>
        <h4>{title}</h4>
        <div className='results_header-image'>
        <img src={thumbnail} alt= {title} />
      </div>
      </header>
      <ul>
        {
            electionCandidates.map(candidate => <CandidateRating key={candidate._id || candidate.id} {...candidate} totalVotes={totalVotes} />)
        }
      </ul>
    <Link to={`/elections/${id}/candidates`} className='btn primary full'>Enter Election</Link>
  </article>
  </>
  )
}

export default ResultElection
