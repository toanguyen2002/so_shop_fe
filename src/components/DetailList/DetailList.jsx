import React from "react";
import "./DetailList.css";

const DetailList = ({ details }) => {
  return (
    <div className="detail-list">
      {details.map((detail, index) => (
        <div key={index} className="detail-item">
          <span className="detail-key">{detail.key}</span>
          <span
            className="detail-value"
            dangerouslySetInnerHTML={{ __html: detail.value }}
          ></span>
        </div>
      ))}
    </div>
  );
};

export default DetailList;
