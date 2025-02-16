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
        newTimetable[course.day][i] = { ...course, startPeriod, endPeriod };
      }
      return newTimetable;
    });
  };

  const removeFromTimetable = (day, period) => {
    setTimetable((prev) => {
      const newTimetable = { ...prev };
      const course = newTimetable[day][period];
      if (!course) return prev; // 빈 칸 클릭 방지

      for (let i = course.startPeriod; i <= course.endPeriod; i++) {
        newTimetable[day][i] = null;
      }
      return newTimetable;
    });
  };

  return (
    <div>
      <h1>시간표 웹앱</h1>

      {/* 빈 시간표 (고정 너비 설정) */}
      <table border="1" style={{ width: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: "50px" }}>교시</th>
            {days.map((day) => (
              <th key={day} style={{ width: "18%" }}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period}>
              <td>{period}교시</td>
              {days.map((day) => {
                const course = timetable[day][period - 1];
                const isStartPeriod = course && course.startPeriod === period - 1;

                return (
                  <td
                    key={`${day}-${period}`}
                    style={{
                      cursor: course ? "pointer" : "default",
                      background: course ? "#90ee90" : "#fff",
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: isStartPeriod ? "bold" : "normal",
                    }}
                    rowSpan={isStartPeriod ? course.endPeriod - course.startPeriod + 1 : 1}
                    onClick={() => isStartPeriod && removeFromTimetable(day, period - 1)}
                  >
                    {isStartPeriod ? course.subject : ""}
                  </td>
                );
              })}
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

