import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchFilteredApplicants } from "../store/applicantSlice";
import UserCard from "./UserCard";
import { Applicant } from "../Interfaces";

export default function Suggestion() {
  //THIS WILL BE THE FILTERED RESULT FROM BackEnd!
  const applicants = useSelector(
    (s: RootState) => s.applicant.applicant
  ) as unknown as Applicant[];

  console.log(applicants);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFilteredApplicants("?location=Barcelona"));
  }, []);

  return (
    <div className="bg-stone-100 py-24 sm:py-32 rounded-lg">
      <div className="mx-auto max-w-10xl lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-[#026767] sm:text-4xl mb-8">
            Your Personalized Suggestions
          </h2>
          <p className="mt-2 text-lg text-[#026767] leading-8 text-gray-600 ">
            We think these applicants will catch your eye
          </p>
        </div>
        <div className="overflow-x-scroll flex flex-nowrap  my-8 ">
          {applicants.length &&
            applicants.map((applicant) => (
              <UserCard applicant={applicant} key={applicant.idAuth}></UserCard>
            ))}
        </div>
      </div>
    </div>
  );
}
