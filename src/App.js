import React from "react";
import courseData from "./courseData"; // courseData.js 가져오기

function App() {
  return (
    <div>
      <h1>시간표 웹앱</h1>
      <pre>{JSON.stringify(courseData, null, 2)}</pre> {/* 데이터 출력 */}
    </div>
  );
}

export default App;

