function Stat(props) {
  return (
    <div>
      <div className="stat-num">{props.number}</div>
      <div className="stat-label">{props.label}</div>
    </div>
  );
}

export default Stat;