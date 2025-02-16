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
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000); // 3초 후 자동 삭제
  };

  const addToTimetable = (course, category) => {
    const startPeriod = parseInt(course.period.split("~")[0]) - 1;
    const endPeriod = parseInt(course.period.split("~")[1]) - 1;

    // 중복 확인: 동일한 요일, 동일한 시간에 이미 같은 수업이 있으면 추가 불가능
    for (let i = startPeriod; i <= endPeriod; i++) {
      if (timetable[course.day][i] !== null) {
        showError("중복된 시간이 존재합니다.");
        return;
      }
    }

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
    <div style={{ position: "relative", textAlign: "center" }}>
      <h1>정화예대 25-1 시간표 도우미</h1>

      {/* 중복 경고 메시지 (화면 중앙 고정) */}
      {errorMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#ff4444",
            color: "#fff",
            padding: "15px",
            borderRadius: "8px",
            fontWeight: "bold",
            zIndex: 1000,
            textAlign: "center",
            width: "300px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* 빈 시간표 (기본 높이 증가) */}
      <table border="1" style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ width: "50px", border: "1px solid black" }}>교시</th>
            {days.map((day) => (
              <th key={day} style={{ width: `${100 / days.length}%`, border: "1px solid black" }}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {periods.map((period) => (
            <tr key={period} style={{ height: "60px" }}> {/* 행 기본 높이 증가 */}
              <td style={{ border: "1px solid black" }}>{period}교시</td>
              {days.map((day) => {
                const course = timetable[day][period - 1];
                const isStartPeriod = course && course.startPeriod === period - 1;
                const bgColor = course ? categoryColors[course.category] : "#fff";

                // 텍스트 길이에 따라 글자 크기 조절
                const fontSize = course && course.subject.length > 10 ? "12px" : "16px";

                return isStartPeriod ? (
                  <td
                    key={`${day}-${period}`}
                    style={{
                      cursor: "pointer",
                      background: bgColor,
                      textAlign: "center",
                      verticalAlign: "middle",
                      fontWeight: "bold",
                      border: "1px solid black",
                      fontSize: fontSize,
                    }}
                    rowSpan={course.endPeriod - course.startPeriod + 1}
                    onClick={() => removeFromTimetable(day, period - 1)}
                  >
                    {course.subject}
                  </td>
                ) : <td key={`${day}-${period}`} style={{ border: "1px solid black" }}></td>;
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
