import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="PNFpage">
      <h1 className="header">Page Not Found :/</h1>
      <h3 className="subheader">
        Go to <Link to="/">Home</Link>
      </h3>
    </div>
  );
}

export default PageNotFound;
