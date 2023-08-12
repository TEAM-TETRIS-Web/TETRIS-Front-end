import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import "./report.css";

const Report = () => {
  let [focusTime, setFocusTime] = useState("02 : 10 : 25");
  let navigate = useNavigate();
  return (
    <div className="blue-bg">
      <div className="container">
        <p className="report-title">Focus MATE  분석 리포트</p>
        {/* 총 공부 시간 */}
        <div className="row report-detail">
          <div className="col">
            <p className="time-title">총 공부 시간</p>
            <div className="focus-time-div">
              <p className="time">{focusTime}</p>
            </div>
          </div>
          {/* 총 공부 시간 끝 */}
          {/* 실제 집중 시간 */}
          <div className="col">
            <p className="time-title">실제 집중 시간</p>
            <div className="focus-time-div">
              <p className="time">{focusTime}</p>
            </div>
          </div>
          {/* 실제 집중 시간 */}
        </div>
        <div className="focus-percent-title">
          총 공부 시간의 <span className="focus-percent">{"89"}%</span>를
          집중했어요!
        </div>
        {/* 실제 집중 시간 끝 */}
        <input
          className="back-main-btn"
          type="button"
          value="메인 화면으로"
          onClick={() => {
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

export default Report;
