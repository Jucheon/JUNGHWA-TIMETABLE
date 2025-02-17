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
  const [successMessage, setSuccessMessage] = useState("");
  const [onlineCourse, setOnlineCourse] = useState(null);

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 3000);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const calculateCredits = () => {
    let totalCredits = 0;
    const countedCourses = new Set(); // 중복 계산 방지

    days.forEach((day) => {
      timetable[day].forEach((course) => {
        if (course && !countedCourses.has(`${course.subject}-${day}`)) {
          totalCredits += course.credits; // 정확한 학점 추가
          countedCourses.add(`${course.subject}-${day}`);
        }
      });
    });

    if (onlineCourse) totalCredits += 2; // 온라인 수업 포함
    return totalCredits;
  };

  const addToTimetable = (course, category) => {
    if (course.subject === "행복한시민되기") {
      setOnlineCourse({ subject: "행복한시민되기(온라인, 2학점)", category });
      showSuccess("수업을 추가하였습니다.");
      return;
    }

    const startPeriod = parseInt(course.period.split("~")[0]) - 1;
    const endPeriod = parseInt(course.period.split("~")[1]) - 1;

    if (!days.includes(course.day)) {
      showError("잘못된 요일 데이터입니다.");
      return;
    }

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

    showSuccess("수업을 추가하였습니다.");
  };

  const removeFromTimetable = (day, period) => {
    setTimetable((prev) => {
      const newTimetable = { ...prev };
      const course = newTimetable[day][period];
      if (!course) return prev;

      for (let i = course.startPeriod; i <= course.endPeriod; i++) {
        newTimetable[day][i] = null;
      }
      return newTimetable;
    });
  };

  const removeOnlineCourse = () => {
    setOnlineCourse(null);
  };

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <h1 style={{ marginBottom: "30px" }}>정화예대 25-1 시간표 도우미</h1>

      {/* 학점 계산기 */}
      <div style={{ position: "absolute", top: "20px", right: "20px", fontSize: "18px", fontWeight: "bold" }}>
        현재: {calculateCredits()}학점
      </div>

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

      {successMessage && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#000",
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
          {successMessage}
        </div>
      )}

      {/* 빈 시간표 */}
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
            <tr key={period} style={{ height: "60px" }}>
              <td style={{ border: "1px solid black" }}>{period}교시</td>
              {days.map((day) => {
                const course = timetable[day][period - 1];
                const isStartPeriod = course && course.startPeriod === period - 1;
                const bgColor = course ? categoryColors[course.category] : "#fff";
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
    </div>
  );
}

export default App;
