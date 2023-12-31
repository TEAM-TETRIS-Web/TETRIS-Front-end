/* eslint-disable*/
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import "./login.css";
import "./common/common.css";
import focustudy from "./../assets/focustudy.jpg";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { authService, dbService } from "../fbase";
import {
  addDoc,
  collection,
} from "firebase/firestore";

const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const auth = getAuth();
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "name") {
      setName(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      //newAccount 를 통해 생성, 로그인 구분
      if (newAccount) {
        // 이메일과 비밀번호를 통해 새 계정 생성
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            //계정 정보 DB 생성 (시간, 이름, 투두가 들어감)
            const docRef = addDoc(collection(dbService, "user"), {
              email: email,
              name: name,
              time: {
                date: 0,
                end: 0,
                focus: 0,
                start: 0,
                total: 0,
              },
              todos: [],
            });
            // ...
            navigate("/");
          })
          .catch((error) => {
            const errorCode = error.code;
            setError(error.message);
            console.log(error);
            // ..
          });
      } else {
        //로그인인 경우 
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            setError(error.message);
          });
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col focus-img">
          <img src={focustudy} width="100%" />
        </div>
        <div className="col main-div">
            {/* 웹 title */}
          <div className="title-div">
            <p className="login-detail none-margin">집중하면서</p>
            <p className="login-detail none-margin">공부하고 싶다면,</p>
            <p className="login-main none-margin">FocuStudy</p>
          </div>
          {/* 로그인 화면 창 */}
          <div className="login-div">
            {/* 이름작성 - 새 계정 생성시만 출력 */}
            {newAccount ? (
              <input
                name="name"
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={onChange}
              />
            ) : null}
              {/* 이메일 작성 */}
            <input
              name="email"
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={onChange}
            />
            <br />
            {/* 비밀번호 작성 */}
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={onChange}
            />{" "}
            <br />
            {/* 계정 생성 및 로그인 선택 */}
            <button className="login-button btn" onClick={onSubmit}>
              {newAccount ? "계정 생성" : "로그인"}
            </button>
            <br />
            <div className="detail-bar">
              <span
                onClick={() => {
                  setNewAccount((prev) => !prev);
                }}
              >
                {newAccount ? "로그인" : "새로운 계정 만들기"}
              </span>
              {"   "}| {"   "}
              <span onClick={handleShow}>비밀번호 찾기</span>

              {/* 비밀번호 찾기 modal 창 */}

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>비밀번호 찾기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="name@example.com"
                        autoFocus
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    닫기
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleClose();
                      sendPasswordResetEmail(auth, email)
                        .then(() => {
                          // Password reset email sent!
                          // ..
                        })
                        .catch((error) => {
                          const errorCode = error.code;
                          const errorMessage = error.message;
                          // ..
                        });
                      alert("비밀번호 재설정 이메일이 전송되었습니다.");
                    }}
                  >
                    전송
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
