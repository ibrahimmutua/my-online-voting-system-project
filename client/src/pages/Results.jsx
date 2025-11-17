import React,{useState,useEffect } from 'react'
//import {elections as dummyElections} from '../data'
import ResultElection from '../components/ResultElection';
import Leaderboard from '../components/Leaderboard';
import axios from "axios"
import {useSelector} from "react-redux"
import { useNavigate } from 'react-router-dom';

const Results = () => {

  var token=useSelector(state=>state?.vote?.currentVoter?.token)
    const navigate = useNavigate();
      
    
      useEffect(()=>{
        if(!token){
          navigate('/')
        }
      },[])

  const [elections,setElections]=useState([])
  const [selectedElection, setSelectedElection] = useState(null)


  //var token=useSelector(state=>state?.vote?.currentVoter?.token)
 var getElections=async(e)=>{
  try {
    var response=await axios.get(`${process.env.REACT_APP_API_URL}/elections`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
    var elections=await response.data
    setElections(elections)
    // Set first election as default for leaderboard
    if(elections.length > 0) setSelectedElection(elections[0]._id)
  } catch (error) {
    console.log(error)
  }
 }
 
  useEffect(() =>{
    getElections()
  },[])

  return (
   <section className='results_page'>
    {/* Live Leaderboard Section */}
    {selectedElection && (
      <div className='leaderboard_section'>
        <div className='container'>
          <div className='election_selector'>
            <label htmlFor="election-select">Select Election for Leaderboard:</label>
            <select 
              id="election-select"
              value={selectedElection} 
              onChange={(e) => setSelectedElection(e.target.value)}
            >
              {elections.map(election => (
                <option key={election._id} value={election._id}>
                  {election.title}
                </option>
              ))}
            </select>
          </div>
          <Leaderboard electionId={selectedElection} />
        </div>
      </div>
    )}

    {/* Traditional Results */}
    <div className='traditional_results'>
      <div className='container results_container'>
        {
          elections.map(election => <ResultElection key={election._id} {...election} />)
        }
      </div>
    </div>
   </section>
  )
}

export default Results
