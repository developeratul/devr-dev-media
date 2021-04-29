import React from "react";

const Error = () => {
  return (
    <div className="notfoundPage">
      <div className="ErrorImg">
        <img
          src="https://devr-dev-media.herokuapp.com/static/media/error.ae76adc4.svg"
          alt="Page Not Found"
        />
      </div>
      <h1>This Page Could not be found</h1>
      <p>404 Client Error</p>
    </div>
  );
};

export default Error;
