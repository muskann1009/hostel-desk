function CallToAction() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h3 className="mt-0">Something needs fixing right now?</h3>
            <p style={{ margin: 0 }}>Submit a complaint and we'll route it to the right hostel warden.</p>
          </div>
          <a className="btn btn-primary" href="submit-complaint.html">Submit a complaint</a>
        </div>
      </div>
    </section>
  );
}

export default CallToAction;