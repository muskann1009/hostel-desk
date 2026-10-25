function StepCard(props) {
  return (
    <div className="card step-card">
      <span className="step-num">{props.number}</span>
      <h3>{props.title}</h3>
      <p>{props.text}</p>
    </div>
  );
}

export default StepCard;