function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow-tag">For students of every hostel block</span>
          <h1>Tell us what's broken. We'll get it fixed.</h1>
          <p>
            HostelDesk is the campus's shared line to hostel maintenance and warden staff — log a
            complaint in under a minute, and follow it from "Open" to "Resolved" without a single
            follow-up phone call.
          </p>
          <div className="hero-actions">
            <a className="btn btn-accent" href="submit-complaint.html">Submit a complaint</a>
            <a className="btn btn-ghost" href="my-complaints.html">Track a complaint</a>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <img src="/hostel.jpg" alt="Hostel building" />
        </div>
      </div>
    </section>
  );
}

export default Hero;