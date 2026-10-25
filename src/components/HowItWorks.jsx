import StepCard from "./StepCard.jsx";

function HowItWorks() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>How it works</h2>
          <p>Three steps between a broken tap and a warden who knows about it.</p>
        </div>
        <div className="grid-3">
          <StepCard
            number="1"
            title="Describe the issue"
            text="Pick your hostel, room and a category, then explain what's wrong. Takes about a minute."
          />
          <StepCard
            number="2"
            title="Get a reference number"
            text="Every complaint gets a unique ID so you can find it again without digging through email."
          />
          <StepCard
            number="3"
            title="Watch it move"
            text="Check My Complaints any time to see status change from Open to In Progress to Resolved."
          />
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;