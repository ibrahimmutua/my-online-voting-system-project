import React,{useState, useEffect} from 'react'
//import {elections as dummyElections} from '../data'
import Election from '../components/Election';
import AddElectionModal from '../components/AddElectionModal';
import {useSelector,useDispatch} from 'react-redux'
import {UiActions} from '../store/ui-slice'
import axios from 'axios'
import UpdateElectionModal from '../components/UpdateElectionModal';
import Loader from '../components/Loader'
import {useNavigate} from 'react-router-dom'
const Elections = () => {
var token=useSelector(state=>state?.vote?.currentVoter?.token)
  const navigate = useNavigate();
    
  
    useEffect(()=>{
      if(!token){
        navigate('/')
      }
    },[])
  var [elections,setElections]=useState([])

  var [isLoading,setIsLoading]=useState(false)

  var dispatch=useDispatch()

  var openModal=() =>{
    dispatch(UiActions.openElectionModal())
  }


  
   var isAdmin=useSelector(state=>state?.vote?.currentVoter?.isAdmin)
  var electionModalShowing=useSelector(state => state.ui.electionModalShowing)
  var updateElectionModalShowing=useSelector(state => state.ui.updateElectionModalShowing)

  var getElections=async()=>{
    setIsLoading(true)
    try {
      console.log(`Bearer ${token}`)
      var response=await axios.get(`${process.env.REACT_APP_API_URL}/elections`,{withCredentials:true,headers:{Authorization:`Bearer ${token}`}})
      console.log("Response>",response.data)
      // Sort elections: ongoing first, then completed
      const sortedElections = response.data.sort((a, b) => {
        const aEnded = new Date(a.endDate) < new Date()
        const bEnded = new Date(b.endDate) < new Date()
        return aEnded - bEnded
      })
      setElections(sortedElections)
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }



  useEffect(()=>{
    getElections()
  },[])
  console.log(elections)
  return (
   <>
    <section style={{ marginTop: '0rem', paddingTop: '8rem' }}>
      <header className='elections_header_sticky'>
        <h1>Ongoing Elections</h1>
        {isAdmin &&<button className='btn primary' onClick={openModal}>Create New Election</button>}
      </header>
      <div className='container elections_container'>
        {isLoading ? <Loader /> :<menu className='elections_menu'>  
          {
            elections.map(election=><Election key={election._id} {...election} />)
          }
        </menu>}
      </div>
    </section>
    {electionModalShowing && <AddElectionModal />}
    {updateElectionModalShowing && <UpdateElectionModal />}
   </>
   
  )
}

export default Elections
