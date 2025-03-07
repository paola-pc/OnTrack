import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { CurrentUserType, Track } from "../Interfaces";
import { getVacancy, getRecruiter, getApplicant } from "../api.fetch";
import { deleteTrack } from "../store/trackSlice";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useNavigate } from "react-router-dom";
import { extractItemsByOrder } from "../library";

export default function TrackTrack({ track }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stepArr, setStepArr] = useState([]);
  const [vacancy, setVacancy] = useState({});
  const [recruiter, setRecruiter] = useState({});
  const [applicant, setApplicant] = useState({});
  const scrollRef = useRef(null);

  const currentUser = useSelector(
    (s: RootState) => s.currentUser
  ) as unknown as CurrentUserType;

  useEffect(() => {
    getVacancy(track.vacancyId, null).then((res) => setVacancy(res.data));
    getRecruiter(track.recruiterID, null).then((res) => {
      setRecruiter(res);
    });
    getApplicant(track.applicantID, null).then((res) => setApplicant(res));
  }, []);

  useEffect(() => {
    setStepArr(extractItemsByOrder(track));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [stepArr]);

  function handleDeleteTrack() {
    if (window.confirm("Are you sure you want to delete this track?")) {
      dispatch(deleteTrack(track.id))
        .unwrap()
        .then(() => {
          navigate("/dashboard");
        })
        .catch((error: Error) => {
          console.error("Error deleting vacancy:", error);
        });
    }
  }

  return (
    <>
      {track.reject === false ? (
        <>
          {stepArr.map((step, index) => (
            <button
              type="submit"
              onClick={() =>
                navigate(
                  `/track/?trackId=${track.id}&vacancyId=${track.vacancyId}`
                )
              }
            >
              <div key={index}>
                {/* ref={step.checked === true ? scrollRef : null}> */}
                <div className="bg-yellow-100 rounded-lg py-5 h-200 ">
                  <p className="text-xl text-[#026767] font-semibold pb-2 tracking-widest">
                    Step {index + 1}
                  </p>
                  <p> {step.type}</p>
                </div>
                <div
                  style={{
                    width: "5px",
                    backgroundColor: "#026767",
                    height: "100px",
                    display: "flex",
                    justifyContent: "center",
                    alignSelf: "center",
                    marginLeft: "130px",
                  }}
                ></div>
              </div>
            </button>
          ))}
          <button
            type="submit"
            onClick={() =>
              navigate(
                `/track/?trackId=${track.id}&vacancyId=${track.vacancyId}`
              )
            }
          >
            <div className="bg-yellow-100 rounded-lg py-5 mb-8 text-center">
              <p>all steps completed</p>
            </div>
          </button>
        </>
      ) : (
        <>
          <div className="bg-blue-100 rounded-lg py-5 mb-8 text-center">
            <p>Track closed for {vacancy.title}</p>
            {currentUser.role === "applicant" ? (
              <DeleteOutlineOutlinedIcon
                onClick={handleDeleteTrack}
              ></DeleteOutlineOutlinedIcon>
            ) : null}
          </div>
        </>
      )}
    </>
  );
}
