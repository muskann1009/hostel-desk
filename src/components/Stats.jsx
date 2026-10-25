import Stat from "./Stat.jsx";

function Stats() {
  var all = JSON.parse(localStorage.getItem("hd_complaints")) || [];
  var inProgress = all.filter(function (c) { return c.status === "In Progress"; }).length;
  var resolved = all.filter(function (c) { return c.status === "Resolved"; }).length;

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="stat-row">
          <Stat number={137 + all.length} label="Complaints logged this term" />
          <Stat number={17 + inProgress} label="Currently being worked on" />
          <Stat number={122 + resolved} label="Resolved" />
          <Stat number="24 hrs" label="Typical first response" />
        </div>
      </div>
    </section>
  );
}

export default Stats;