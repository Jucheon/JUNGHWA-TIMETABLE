import React from "react";
import courseData from "./courseData"; 

function App() {
  return (
    <div>
      <h1>시간표 웹앱</h1>
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
