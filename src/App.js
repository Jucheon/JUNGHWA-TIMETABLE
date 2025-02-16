import React, { useState } from "react";
import courseData from "./courseData";

const days = ["월", "화", "수", "목", "금"];
const periods = Array.from({ length: 14 }, (_, i) => i + 1);
const categoryColors = {
  "보컬전공 공통선택": "#ffb6c1", // 분홍색
  "보컬전공 자유선택": "#90ee90", // 연두색
  "보컬/작편곡전공 자유선택": "#fffacd", // 노란색
  "교양선택": "#add8e6" // 하늘색
};

function App() {
  const [timetable, setTimetable] = useState(
    days.reduce((acc, day) => {
      acc[day] = Array(14).fill(null);
      return acc;
    }, {})
  );

  const addToTimetable = (course, category) => {
    const startPeriod = parseInt(course.period.split("~")[0]) - 1;
    const endPeriod = parseInt(course.period.split("~")[1]) - 1;

    setTimetable((prev) => {
      const newTimetable = { ...prev };
      for (let i = startPeriod; i <= endPeriod; i++) {
        newTimetable[course.day][i] = { ...course, startPeriod, endPeriod, category };
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
                const bgColor = course ? categoryColors[course.category] : "#fff";

                return isStartPeriod ? (
                  <td
                    key={`${day}-${period}`}
                    style={{
                      cursor: "pointer",
                      background: bgColor,
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                    }}
                    rowSpan={course.endPeriod - course.startPeriod + 1}
                    onClick={() => removeFromTimetable(day, period - 1)}
                  >
                    {course.subject}
                  </td>
                ) : null;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 수업 리스트 */}
      {Object.entries(courseData).map(([category, courses]) => (
        <div key={category}>
          <h2 style={{ backgroundColor: categoryColors[category], padding: "5px" }}>{category}</h2>
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
                    <button onClick={() => addToTimetable(course, category)}>추가</button>
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
