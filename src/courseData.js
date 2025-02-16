import React, { useState } from "react";
import { Card, CardContent } from "./components/ui/card";  
import { Button } from "./components/ui/button";  
import { Select } from "./components/ui/select";  
import { motion } from "framer-motion";

const days = ["월", "화", "수", "목", "금"];
const periods = [
  "09:00 - 09:50", "10:00 - 10:50", "11:00 - 11:50", "12:00 - 12:50",
  "13:00 - 13:50", "14:00 - 14:50", "15:00 - 15:50", "16:00 - 16:45",
  "16:50 - 17:35", "17:40 - 18:25", "18:30 - 19:15", "19:20 - 20:05",
  "20:10 - 20:55", "21:00 - 21:45"
];

const courseData = {
  "보컬전공 공통선택": [
    { subject: "보컬스튜디오세션1(레코딩)", professor: "박은주", day: "월", period: "8~10", location: "외산B동201", credits: 3 },
    { subject: "보컬스튜디오세션1(레코딩)", professor: "박은주", day: "월", period: "11~13", location: "외산B동201", credits: 3 },
    { subject: "보컬Lab3(보컬스타일링)", professor: "지성배", day: "화", period: "8~9", location: "백암705", credits: 2 },
    { subject: "보컬Lab3(보컬스타일링)", professor: "지성배", day: "화", period: "10~11", location: "백암705", credits: 2 },
    { subject: "보컬Lab3(보컬스타일링)", professor: "지성배", day: "화", period: "12~13", location: "백암705", credits: 2 },
    { subject: "보컬Lab3(보컬스타일링)", professor: "여수진", day: "수", period: "9~10", location: "백암204", credits: 2 },
    { subject: "보컬Lab3(보컬스타일링)", professor: "여수진", day: "수", period: "11~12", location: "백암204", credits: 2 },
    { subject: "보컬앨범프로듀싱&마케팅", professor: "이형은", day: "목", period: "8~9", location: "백암705", credits: 2 },
    { subject: "보컬앨범프로듀싱&마케팅", professor: "이형은", day: "목", period: "11~12", location: "백암705", credits: 2 },
    { subject: "보컬앨범프로듀싱&마케팅", professor: "이형은", day: "목", period: "12~13", location: "백암705", credits: 2 },
    { subject: "보컬Lab3(보컬스타일링)", professor: "신소이", day: "목", period: "8~9", location: "백암204", credits: 2 },
    { subject: "보컬스튜디오세션1(레코딩)", professor: "김기원", day: "목", period: "8~10", location: "외산B동201", credits: 3 },
    { subject: "보컬스튜디오세션1(레코딩)", professor: "김기원", day: "목", period: "11~13", location: "외산B동201", credits: 3 },
    { subject: "보컬앨범프로듀싱&마케팅", professor: "김지선", day: "금", period: "8~9", location: "백암402", credits: 2 },
    { subject: "보컬앨범프로듀싱&마케팅", professor: "김지선", day: "금", period: "10~11", location: "백암402", credits: 2 },
    { subject: "보컬앨범프로듀싱&마케팅", professor: "김지선", day: "금", period: "12~13", location: "백암402", credits: 2 },
    { subject: "보컬스튜디오세션1(레코딩)", professor: "김기원", day: "금", period: "8~10", location: "외산B동201", credits: 3 },
    { subject: "보컬스튜디오세션1(레코딩)", professor: "김기원", day: "금", period: "11~13", location: "외산B동201", credits: 3 }
  ],
  "보컬전공 자유선택": [
    { subject: "백그라운드보컬앙상블", professor: "정유신", day: "월", period: "8~10", location: "백암203", credits: 3 },
    { subject: "백그라운드보컬앙상블", professor: "정유신", day: "월", period: "11~13", location: "백암203", credits: 3 },
    { subject: "백그라운드보컬앙상블", professor: "이선화", day: "화", period: "4~6", location: "백암203", credits: 3 },
    { subject: "백그라운드보컬앙상블", professor: "주은총", day: "수", period: "5~7", location: "백암203", credits: 3 },
    { subject: "백그라운드보컬앙상블", professor: "주은총", day: "수", period: "8~10", location: "백암203", credits: 3 },
    { subject: "백그라운드보컬앙상블", professor: "임주현", day: "목", period: "5~7", location: "백암203", credits: 3 },
    { subject: "믹스&마스터링1", professor: "김원준", day: "목", period: "4~5", location: "백암303", credits: 2 },
    { subject: "믹스&마스터링1", professor: "김원준", day: "목", period: "6~7", location: "백암303", credits: 2 },
    { subject: "비트&트랙프로듀싱1", professor: "오승현", day: "목", period: "8~9", location: "백암303", credits: 2 }
  ],
  "보컬/작편곡전공 자유선택": [
    { subject: "작곡법1", professor: "성기준", day: "수", period: "4~5", location: "백암402", credits: 2 },
    { subject: "작곡법1", professor: "성기준", day: "수", period: "6~7", location: "백암402", credits: 2 },
    { subject: "작곡법1", professor: "성기준", day: "목", period: "5~6", location: "백암302", credits: 2 }
  ],
  "교양선택": [
    { subject: "알기쉬운생활경제", professor: "임성은", day: "월", period: "2~3", location: "석화203", credits: 2 },
    { subject: "알기쉬운생활경제", professor: "임성은", day: "월", period: "5~6", location: "석화203", credits: 2 },
    { subject: "글쓰기와토론", professor: "이혜정", day: "월", period: "8~9", location: "석화203", credits: 2 },
    { subject: "직업의식과서비스", professor: "김현숙", day: "월", period: "2~3", location: "석화204", credits: 2 },
    { subject: "자기개발과취업", professor: "유우경", day: "월", period: "5~6", location: "석화204", credits: 2 },
    { subject: "자기개발과취업", professor: "유우경", day: "월", period: "8~9", location: "석화204", credits: 2 },
    { subject: "자기개발과취업", professor: "유우경", day: "월", period: "11~12", location: "석화204", credits: 2 },
    { subject: "다이어트와건강", professor: "장순남", day: "화", period: "2~3", location: "석화203", credits: 2 },
    { subject: "심쿵가치위드같이", professor: "김옥연", day: "화", period: "5~7", location: "석화203", credits: 3 },
    { subject: "정보보안이해와실습", professor: "이태우", day: "수", period: "2~3", location: "외산B동101", credits: 2 },
    { subject: "자기개발과취업", professor: "유우경", day: "수", period: "5~6", location: "석화203", credits: 2 },
    { subject: "자기개발과취업", professor: "유우경", day: "수", period: "8~9", location: "석화203", credits: 2 },
    { subject: "생활영어1", professor: "손정미", day: "수", period: "5~6", location: "석화204", credits: 2 },
    { subject: "생활영어1", professor: "손정미", day: "수", period: "8~9", location: "석화204", credits: 2 },
    { subject: "생활영어1", professor: "손정미", day: "수", period: "11~12", location: "석화204", credits: 2 },
    { subject: "글쓰기와토론", professor: "이정안", day: "수", period: "2~3", location: "외산A동303", credits: 2 },
    { subject: "글쓰기와토론", professor: "이정안", day: "수", period: "5~6", location: "외산A동303", credits: 2 },
    { subject: "글쓰기와토론", professor: "이정안", day: "수", period: "8~9", location: "외산A동303", credits: 2 },
    { subject: "비주얼씽킹", professor: "강보람", day: "목", period: "2~3", location: "석화204", credits: 2 },
    { subject: "비주얼씽킹", professor: "강보람", day: "목", period: "5~6", location: "석화204", credits: 2 },
    { subject: "행복한시민되기", professor: "온라인", day: "원격", period: "", location: "", credits: 2 }
  ]
};

export default courseData;
