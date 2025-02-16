import React, { useState } from "react";
import courseData from "./courseData";

const days = ["월", "화", "수", "목", "금"];
const periods = Array.from({ length: 14 }, (_, i) => i + 1);

function App() {
  const [timetable, setTimetable] = useState(
    days.reduce((acc, day) => {
      acc[day] = Array(14).fill(null);
      return acc;
    }, {})
  );

  const addToTimetable = (course) => {
    const startPeriod = parseInt(course.period.split("~")[0]) - 1;
    const endPeriod = parseInt(course.period.split("~")[1]) - 1;

    setTimetable((prev) => {
      const newTimetable = { ...prev };
      for (let i = startPeriod; i <= endPeriod; i++) {
        newTimetable[course.day][i] = course;
      }
      return newTimetable;
    });
  };

  const removeFromTimetable = (day, period) => {
    setTimetable((prev) => {
      const newTimetable = { ...prev };
      newTimetable[day][period] = null;
      return newTimetable;
    });
  };

  return (
    <div>
      <h1>시간표 웹앱</h1>

      {/* 빈 시간표 생성 */}
      <table border="1">
        <thead>
          <tr>
            <th>교시</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period}>
              <td>{period}교시</td>
              {days.map((day) => (
                <td
                  key={`${day}-${period}`}
                  style={{ cursor: "pointer", background: timetable[day][period - 1] ? "#90ee90" : "#fff" }}
                  onClick={() => timetable[day][period - 1] && removeFromTimetable(day, period - 1)}
                >
                  {timetable[day][period - 1] ? timetable[day][period - 1].subject : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 수업 리스트 */}
      {Object.entries(courseData).map(([category, courses]) => (
        <div key={category}>
          <h2>{category}</h2>
          <table border="1">
            <thead>
              <tr>
                <th>과목명</th>
                <th>교수</th>
                <th>요일</th>
                <th>교시</th>
                <th>강의실</th>
                <th>학점</th>
                <th>추가</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.subject}</td>
                  <td>{course.professor}</td>
                  <td>{course.day}</td>
                  <td>{course.period}</td>
                  <td>{course.location}</td>
                  <td>{course.credits}</td>
                  <td>
                    <button onClick={() => addToTimetable(course)}>추가</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default App;
