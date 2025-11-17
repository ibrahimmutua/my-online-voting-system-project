import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { voteActions } from '../store/vote-slice';
import { useDispatch } from "react-redux";

const Login = () => {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const loginVoter = async (e) => {
    e.preventDefault();
    try {
      const payload = { email: userData.email, password: userData.password };
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/voters/login`, payload);
      const newVoter = response.data;

      localStorage.setItem("currentUser", JSON.stringify(newVoter));
      dispatch(voteActions.changeCurrentVoter(newVoter));
      navigate("/results");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className='register'>
      <div className="container register_container">
        <h2>Sign In</h2>
        <form onSubmit={loginVoter}>
          {error && <p className='form_error-message'>{error}</p>}
          <input type="email" name="email" placeholder='Email Address' onChange={changeInputHandler} autoComplete='true' autoFocus />
          <input type="password" name="password" placeholder='Password' onChange={changeInputHandler} autoComplete='true' />
          <p>Don't have an account? <Link to='/register'>Sign Up</Link></p>
          <button type='submit' className='btn primary'>Login</button>
        </form>
      </div>
    </section>
  );
};

export default Login;
