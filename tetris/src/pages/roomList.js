/* eslint-disable*/
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { dbService } from "../fbase";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import "./roomList.css";

const RoomList = (props) => {
  let navigate = useNavigate();
  const [userObj, setUserObj] = useState(props.userObj);

  let [room, setRoom] = useState([]);
  let [modal, setModal] = useState(Array(room.length).fill(false));

  let [title, setTitle] = useState();
  let [roomDetail, setDetail] = useState();
  let [roomMode, setRoomMode] = useState(false);
  let [totalTime, setTotalTime] = useState(0);
  let [userName, setUserName] = useState(null);

  //렌더링 시 방 목록 및 시간 데이터 가져오기 
  useEffect(() => {
    getData();
    getTimeData();
  }, []);

  //방 목록 가져오기
  async function getData() {
    const dbProblems = await getDocs(query(collection(dbService, "room")));
    dbProblems.forEach((doc) => {
      const roomObj = {
        ...doc.data(),
        id: doc.id,
      };
      //공개방인 경우 가져오기 
      if (roomObj.mode) {
        setRoom((prev) => [roomObj, ...prev]);
      }
    });
  }
  //사용자 시간 가져오기
  async function getTimeData() {
    const dbinfo = await getDocs(query(collection(dbService, "user")));
    dbinfo.forEach((doc) => {
      const dataObj = {
        ...doc.data(),
        id: doc.id,
      };
      //현재 로그인한 사용자인 경우 저장
      if (dataObj.email == userObj.email) {
        setTotalTime(dataObj.time.total);
        setUserName(dataObj.name);
      }
    });
  }
  
  //방 만들기
  async function addRoom(event) {
    const docRef = await addDoc(collection(dbService, "room"), {
      name: title,
      detail: roomDetail,
      mode : roomMode,
      user : [{name : userName, time : totalTime},],
    });
    navigate(`/room/${docRef.id}`,);
  }
  return (
    <div className="container">
      <div className="roomList-pg row">
        {/* 방 목록 */}
        <div className="col room-list-div blue-bg">
          <p className="make-room-title">공개 방</p>
          {room.map(function (room, i) {
            return (
              <div key={i}>
                <div className="room-div row white-bg">
                  <span
                    className="room-name col-8"
                    //클릭시 방 설명 모달 창 생성 
                    onClick={() => {
                      let copy_modal = [...modal];
                      copy_modal[i] = !copy_modal[i];
                      setModal(copy_modal);
                    }}
                  >
                    {room.name}
                  </span>
                  <span className=" col room-person"></span>
                  <button
                  //클릭 시 해당 방으로 이동 
                    onClick={() => {
                      navigate(`/room/${room.id}`, {
                        state: {
                          name: room.name,
                          person: room.person,
                        },
                      });
                    }}
                    className="btn room-btn white-font"
                  >
                    참여하기
                  </button>
                </div>
                {modal[i] ? <RoomMoadal detail={room.detail} /> : null}
              </div>
            );
          })}
        </div>
        {/* 방 만들기 화면 */}
        <div className="make-room-div col">
          <p className="make-room-title">방 만들기</p>
          <p className="make-room-detail">방 이름</p>
          <input
            type="text"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <p className="make-room-detail">방 설명</p>
          <textarea
            onChange={(e) => {
              setDetail(e.target.value);
            }}
            onClick={(e) => {
              setDetail(e.target.value);
            }}
          />
          <p className="make-room-detail">공개 여부</p>
          <div
            className="btn-group open-btn-div"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              autoComplete="off"
              defaultChecked
              onChange={() => {
                setRoomMode(false);
              }}
            />
            <label
              className="open-btn btn btn-outline-primary"
              htmlFor="btnradio1"
            >
              비공개
            </label>
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              autoComplete="off"
              onChange={() => {
                setRoomMode(true);
              }}
            />
            <label
              className=" open-btn btn btn-outline-primary"
              htmlFor="btnradio2"
            >
              공개
            </label>
          </div>
          <br />
          <button
            onClick={() => {
              addRoom();
            }}
            className="btn make-room-btn white-font"
          >
            방 만들기
          </button>
        </div>
      </div>
    </div>
  );
};

const RoomMoadal = (props) => {
  return (
    <div className="room-detail-div white-bg">
      <pre className="none-margin">{props.detail}</pre>
    </div>
  );
};

export default RoomList;
