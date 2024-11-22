export default function dashboardLoading() {
  return (
    <>
      <div className="container text-center upper_margin">
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
          <button className="btn btn-primary disable placeholder col-3"></button>
        </div>
      </div>
    </>
  );
}
