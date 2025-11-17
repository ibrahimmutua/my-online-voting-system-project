import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Congrats = () => {

 
  // const Candidates = () => {
  const navigate = useNavigate();
  var token=useSelector(state=>state?.vote?.currentVoter?.token)

  useEffect(()=>{
    if(!token){
      navigate('/')
      return
    }
    // Redirect to results after a short delay
    const t = setTimeout(() => navigate('/results'), 3000)
    return () => clearTimeout(t)
  },[token,navigate])

  return (
   <section className='congrats'>
    <div className='container congrats_container'>
      <h2>Thank you for your vote</h2>
      <p>You will be redirected shortly to see the results</p>
      <Link to='/results' className='btn sm primary'>See Results</Link>
    </div>
   </section>
  )
}

export default Congrats
