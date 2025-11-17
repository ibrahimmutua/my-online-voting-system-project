import {createSlice,current} from '@reduxjs/toolkit';



var currentVoter=JSON.parse(localStorage.getItem("currentUser"))
var initialState={selectedVoteCandidate:"",currentVoter,selectedElection:"",idOfElectionToUpdate:"",
    addCandidateElectionId:""}

var voteSlice=createSlice({
    name:"vote",
    initialState,
    reducers:{
        changeSelectedVoteCandidate(state,action){
            state.selectedVoteCandidate=action.payload;
        },
        changeCurrentVoter(state,action){
            state.currentVoter=action.payload;
        },
        changeSelectedElection(state,action){
            state.selectedElection=action.payload;
        },
        changeIdOfElectionToUpdate(state,action){
            state.idOfElectionToUpdate=action.payload;
        },
        changeAddCandidateElectionId(state,action){
            state.addCandidateElectionId=action.payload;
        }
    }
})

export var voteActions=voteSlice.actions
export default voteSlice