export default function dashboardLoading() {
  return (
    <>
      <div className="upper_margin update container">
        <div className="col-lg-2">
          <img
            src="..."
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#868e96",
            }}
          />
        </div>
        <div className="text-center col-lg-8">
          <>
            <h5 className="placeholder-glow">
              <span className="placeholder col-3"></span>
            </h5>
            <h5 className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </h5>
          </>
        </div>
        <div className="col-lg-2 d-flex justify-content-end align-items-start">
          <h1 className="placeholder-glow">
            <button className="btn  disable placeholder col-2"></button>
          </h1>
        </div>
      </div>
      {/* <div className="container text-center">
        <div>
          <h2 className="placeholder-glow">
            <span className="placeholder col-4"></span>
          </h2>
          <p className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </p>
          <img
            src="..."
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "#868e96",
            }}
          />
          <p className="placeholder-glow">
            <span className="placeholder col-3"></span>
          </p>
          <p className="placeholder-glow">
            <span className="placeholder col-3"></span>
          </p>
        </div>
      </div> */}
    </>
  );
}
