import { useEffect } from "react";

/**
 * 현재 테마 상태에 따라 모달 내부의 code 블록 색상 변경
 * @param themeMode 현재 테마 상태
 */
const useCodeTheme = (themeMode: "light" | "dark") => {
  useEffect(() => {
    console.log(themeMode);
    let styleMapping = {};

    if (themeMode === "light") {
      styleMapping = {
        "rgb(36, 41, 46)": { backgroundColor: "rgb(245, 245, 245)" }, // 배경색
        "rgb(201, 209, 217)": { color: "rgb(31, 35, 40)" }, // 기본 텍스트
        "rgb(249, 117, 131)": { color: "rgb(199, 37, 78)" }, // 키워드
        "rgb(179, 146, 240)": { color: "rgb(136, 97, 205)" }, // 함수 이름
        "rgb(225, 228, 232)": { color: "rgb(51, 51, 51)" }, // 기호
        "rgb(158, 203, 255)": { color: "rgb(50, 120, 100)" }, // 문자열
        "rgb(247, 140, 108)": { color: "rgb(41, 101, 214)" }, // 숫자
        "rgb(106, 115, 125)": { color: "rgb(153, 153, 153)" }, // 주석
        "rgb(255, 203, 107)": { color: "rgb(245, 124, 0)" }, // 속성
        "rgb(84, 174, 255)": { color: "rgb(33, 150, 243)" }, // 태그
        "rgb(240, 113, 120)": { color: "rgb(199, 94, 94)" }, // 변수
        "rgb(129, 233, 129)": { color: "rgb(0, 92, 230)" }, // 연산자
        // "rgb(255, 203, 107)": { color: "rgb(100, 130, 245)" }, // CSS 속성
      };
    } else {
      styleMapping = {
        "rgb(245, 245, 245)": { backgroundColor: "rgb(36, 41, 46)" }, // 배경색
        "rgb(31, 35, 40)": { color: "rgb(201, 209, 217)" }, // 기본 텍스트
        "rgb(199, 37, 78)": { color: "rgb(249, 117, 131)" }, // 키워드
        "rgb(136, 97, 205)": { color: "rgb(179, 146, 240)" }, // 함수 이름
        "rgb(51, 51, 51)": { color: "rgb(225, 228, 232)" }, // 기호
        "rgb(50, 120, 100)": { color: "rgb(158, 203, 255)" }, // 문자열
        "rgb(41, 101, 214)": { color: "rgb(247, 140, 108)" }, // 숫자
        "rgb(153, 153, 153)": { color: "rgb(106, 115, 125)" }, // 주석
        "rgb(245, 124, 0)": { color: "rgb(255, 203, 107)" }, // 속성
        "rgb(33, 150, 243)": { color: "rgb(84, 174, 255)" }, // 태그
        "rgb(199, 94, 94)": { color: "rgb(240, 113, 120)" }, // 변수
        "rgb(0, 92, 230)": { color: "rgb(129, 233, 129)" }, // 연산자
        // "rgb(100, 130, 245)": { color: "rgb(255, 203, 107)" }, // CSS 속성 (주석 처리)
      };
    }

    const figureElements = document.querySelectorAll("figure");
    figureElements.forEach((element) => {
      const children = element.querySelectorAll("*");
      children.forEach((child) => {
        const computedStyle = getComputedStyle(child);
        Object.entries(styleMapping).forEach(([key, style]) => {
          if (computedStyle.backgroundColor === key || computedStyle.color === key) {
            Object.assign((child as HTMLElement).style, style);
          }
        });
      });
    });
  }, [themeMode]);
};

export default useCodeTheme;
