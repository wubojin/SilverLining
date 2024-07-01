import React from "react";
import { NavLink } from "react-router-dom";

function ProfileNav() {
  return (
    <div className="profileNav">
      <NavLink to="tutor-requests" activeClassName="active">
        <div className="line-break">Tutor</div>
        <div className="line-break">Requests</div>{" "}
      </NavLink>
      <NavLink to="tuition-applications" activeClassName="active">
        <div className="line-break">Tuition</div>
        <div className="line-break">Applications</div>{" "}
      </NavLink>
      <NavLink to="formed-study-groups" activeClassName="active">
        <div className="line-break">Formed</div>
        <div className="line-break">Study Groups</div>{" "}
      </NavLink>
      <NavLink to="joined-study-groups" activeClassName="active">
        <div className="line-break">Joined</div>
        <div className="line-break">Study Groups</div>{" "}
      </NavLink>
    </div>
  );
}

export default ProfileNav;
