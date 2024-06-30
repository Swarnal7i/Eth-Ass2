// src/components/AttendanceTracker.js

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AttendanceTrackerABI from "./AttendanceTracker.json"; // Import ABI JSON
import "./AttendanceTracker.css"; // Import CSS

const AttendanceTracker = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [studentAddress, setStudentAddress] = useState("");
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);

  const contractAddress = "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9";

  useEffect(() => {
    const loadWeb3 = async () => {
      const provider = new Web3.providers.HttpProvider(
        "http://127.0.0.1:8545/"
      );
      const web3 = new Web3(provider);
      const instance = new web3.eth.Contract(
        AttendanceTrackerABI.abi,
        contractAddress
      );
      const accounts = await web3.eth.getAccounts();
      console.log(instance, accounts);
      setContract(instance);
      setAccounts(accounts);
      setAccount(accounts[0]);
    };

    loadWeb3();
  }, []);

  const markAttendance = async () => {
    await contract.methods
      .markAttendance(studentAddress)
      .send({ from: account });
    alert(`student address ${studentAddress} is marked present !`);
    setStudentAddress("");
  };

  const unmarkAttendance = async () => {
    await contract.methods
      .unmarkAttendance(studentAddress)
      .send({ from: account });
    alert(`student address ${studentAddress} is marked absent !`);
    setStudentAddress("");
  };

  const checkAttendance = async () => {
    const isPresent = await contract.methods
      .isMarkedPresent(studentAddress)
      .call();
    setAttendance({ ...attendance, [studentAddress]: isPresent });
    alert(
      `student address : ${studentAddress} is ${
        isPresent ? "present" : "absent"
      }`
    );
    setStudentAddress("");
  };

  const getAllAttendance = async () => {
    const response = await contract.methods.getAllAttendance().call();
    const students = response[0];
    const statuses = response[1];
    console.log(students, statuses);
    const attendance = {};
    students.forEach((student, index) => {
      attendance[student] = statuses[index];
    });
    setStudents(students);
    setAttendance(attendance);
  };

  return (
    <div className="container">
      <h1>Attendance Tracker</h1>
      <p>Account: {account}</p>
      <div className="form">
        <input
          type="text"
          placeholder="Student Address"
          value={studentAddress}
          onChange={(e) => setStudentAddress(e.target.value)}
          list="accounts"
        />
        <datalist id="accounts">
          {accounts.map((acc, index) => (
            <option key={index} value={acc} />
          ))}
        </datalist>
        <button onClick={markAttendance}>Mark Attendance</button>
        <button onClick={unmarkAttendance}>Unmark Attendance</button>
        <button onClick={checkAttendance}>Check Attendance</button>
        <button onClick={getAllAttendance}>Get All Attendance</button>
      </div>
      <h2>Attendance Status</h2>
      <div className="attendance-list">
        {students.map((student, index) => (
          <div className="attendance-item" key={index}>
            <p>{student}</p>
            <p>{attendance[student] ? "Present" : "Absent"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceTracker;
