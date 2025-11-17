import {createSlice} from "@reduxjs/toolkit"

var initialState={addCandidateModalShowing:false,voteCandidateModalShowing:false,electionModalShowing:
        false,updateElectionModalShowing:false}
var uiSlice=createSlice({
    name:'ui',
    initialState,
    reducers:{
        openAddCandidateModal(state){
           state.addCandidateModalShowing=true
        },
         closeAddCandidateModal(state){
           state.addCandidateModalShowing=false
        },

         openVoteCandidateModal(state){
           state.voteCandidateModalShowing=true
        },
         closeVoteCandidateModal(state){
           state.voteCandidateModalShowing=false
        },

         openElectionModal(state){
           state.electionModalShowing=true
        },
         closeElectionModal(state){
           state.electionModalShowing=false
        },
         openUpdateElectionModal(state){
           state.updateElectionModalShowing=true
        },
         closeUpdateElectionModal(state){
           state.updateElectionModalShowing=false
        },
    }
})

export const UiActions=uiSlice.actions;
export default uiSlice;


