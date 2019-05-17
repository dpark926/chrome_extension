const ProgressBar = props => {
  return (
    <div>
      <p className="center">{`${props.numOfComplete} / ${
        props.numOfTotal
      } COMPLETED`}</p>
      <div className="flex mb1 mx2">
        <div
          className={`border ${
            props.numOfComplete === props.numOfTotal ? "green" : "yellow"
          }`}
          style={{
            width: (props.numOfComplete / props.numOfTotal) * 100 + "%"
          }}
        />
        <div
          className="border light-gray"
          style={{
            width: 100 - (props.numOfComplete / props.numOfTotal) * 100 + "%"
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
