import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrackSideBar from "../Components/tracks/TrackSidebar";
import StepTemplate from "../Components/StepTemplate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../store/store'
import { fetchTrack, setTrack, updateTrack } from "../store/trackSlice";
import { fetchVacancy } from "../store/vacancySlice";
import { fetchRecruiter } from "../store/recruiterSlice";
import { fetchApplicant } from "../store/applicantSlice";


const TrackPage = () => {
  const [userRole, setUserRole] = useState('')
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const track = useSelector((state: RootState) => state.track);
  const vacancy = useSelector((state: RootState) => state.vacancy.vacancy)
  const applicant = useSelector((state: RootState) => state.applicant)
  const recruiter = useSelector((state: RootState) => state.recruiter)

  useEffect(() => {
    const searchQuery = new URLSearchParams(window.location.search);
    const queryObj = Object.fromEntries(searchQuery.entries());
    dispatch(fetchTrack({ getTrackByWhat: 'getTrackById', id: +queryObj.trackId }))
    dispatch(fetchVacancy(+queryObj.vacancyId));
    setUserRole(queryObj.userRole)
  }, []);

  useEffect(() => {
    if (track.track?.applicantID) {
      dispatch(fetchApplicant(track.track.applicantID));
    }
  }, [track.track?.applicantID]);

  useEffect(() => {
    if (track.track?.recruiterID) {
      dispatch(fetchRecruiter(track.track.recruiterID));
    }
  }, [track.track?.recruiterID]);



  return (
    <div id='track-container' className="flex h-screen fixed top-[70px] w-screen overflow-scroll">
      <TrackSideBar trackId={track.track?.id} />
      <div className="w-full mx-5">
        <div id='Info' className="mb-10 hover:cursor-pointer">
          <a onClick={() => navigate(`/vacancy/${vacancy.data?.id}`)}>
            <h2 className="text-3xl font-extrabold my-2 hover:text-stone-100 hover:bg-gray-800 w-fit rounded-lg" >
              {vacancy.data?.title}
            </h2>
          </a>
          {userRole === 'applicant'
            ?
            <div className="w-full">
              <a onClick={() => navigate(`/recruiter/${recruiter.recruiter?.id}`)}
                className="flex items-center bg-white border border-gray-200 rounded-lg md:flex-row hover:bg-gray-800 hover:text-white 
           shadow shadow-sm shadow-gray w-full">
                <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                  alt="Company Logo"
                  src={ recruiter.recruiter?.logo }/>
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight "> at {recruiter.recruiter.name}</h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{vacancy.data?.about}</p>
                </div>
              </a>
            </div>
            :
            <div className="w-full">
              <a onClick={() => {
                if (userRole === 'applicant') return navigate(`/vacancy/${vacancy.data?.id}`);
                else return navigate(`/vacancy/${vacancy.data?.id}`)
              }
              }
                className="flex items-center bg-white border border-gray-200 rounded-lg md:flex-row hover:bg-gray-800 hover:text-white 
           shadow shadow-sm shadow-gray w-full">
                <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" alt="company logo" />
                <div className="flex flex-col justify-between p-4 leading-normal">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight ">{vacancy.data?.title}</h5>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{vacancy.data?.about}</p>
                </div>
              </a>
            </div>
          }
        </div>

        <div id="steps-container"
          className="flex flex-col items-center">
          <StepTemplate step='Apply' />
        </div>
      </div >
    </div>

  );
};

export default TrackPage;
