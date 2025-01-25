"use client";

import { SvgIcon } from "@mui/material";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionSvgIcon = motion(SvgIcon);

const LanguageSwitch = ({ language, path }: { language: string; path: string }) => {
  if (language === "ko") {
    return (
      <Link href={`/ja/${path}`}>
        <MotionSvgIcon color="primary" height="24px" viewBox="0 -960 960 960" width="24px" whileHover={{ scale: 1.3 }}>
          <path d="M216-457q26 0 44.5-11.5T279-503q0-23-18.5-35T216-550q-26 0-44.5 12T153-503q0 23 18.5 34.5T216-457ZM75-608v-44h114v-56h52v56h115v44H75Zm141 195q-47 0-80.5-23.5T102-503q0-44 33.5-67t80.5-23q48 0 81.5 23t33.5 67q0 44-33.5 67T216-413Zm-73 161v-140h53v96h264v44H143Zm245-105v-351h51v150h69v44h-68v157h-52Zm314 23q28 0 54.5-13t48.5-37v-106q-23 3-42.5 7t-36.5 9q-45 14-67.5 35T636-390q0 26 18 41t48 15Zm-23 68q-57 0-90-32.5T556-387q0-52 33-85t106-53q23-6 50.5-11t59.5-9q-2-47-22-68.5T721-635q-26 0-51.5 9.5T604-592l-32-56q33-25 77.5-40.5T740-704q71 0 108 44t37 128v257h-67l-6-45q-28 25-61.5 39.5T679-266Z" />
        </MotionSvgIcon>
      </Link>
    );
  } else {
    return (
      <Link href={`/ko/${path}`}>
        <MotionSvgIcon color="primary" height="24px" viewBox="0 -960 960 960" width="24px" whileHover={{ scale: 1.3 }}>
          <path d="m326-240-30-48q80-8 125-43t45-90q0-30-20.5-55T392-512q-23 57-54.5 102T268-332q3 12 6.5 24t7.5 24l-50 15q-3-10-5-17.5t-4-13.5q-26 14-49 21.5t-45 7.5q-32 0-52-21t-20-56q0-53 40-105t103-82q1-19 2-37.5t3-37.5q-28 1-59-.5T79-615l-1-53q26 5 56 6.5t77 1.5q2-18 4.5-35.5t.5-35.5l60 1q-7 17-10 34.5t-6 34.5q58-3 107-9t92-16l1 52q-53 8-103.5 13.5T255-612q-2 14-2.5 29t-2.5 29q28-8 54.5-11t52.5-1q3-10 4.5-20t2.5-20l57 14q-3 8-6.5 16t-6.5 19q51 14 81.5 52t30.5 85q0 70-51.5 117.5T326-240Zm-188-85q17 0 35-7t38-21q-7-38-10-69t-3-59q-38 24-63 59t-25 66q0 13 8.5 22t19.5 9Zm118-65q29-28 50.5-60.5T342-520q-23 0-46.5 4T248-504q-2 26 .5 54t7.5 60Zm446 56q28 0 54.5-13t48.5-37v-106q-23 3-42.5 7t-36.5 9q-45 14-67.5 35T636-390q0 26 18 41t48 15Zm-23 68q-57 0-90-32.5T556-387q0-52 33-85t106-53q23-6 50.5-11t59.5-9q-2-47-22-68.5T721-635q-26 0-51.5 9.5T604-592l-32-56q33-25 77.5-40.5T740-704q71 0 108 44t37 128v257h-67l-6-45q-28 25-61.5 39.5T679-266Z" />
        </MotionSvgIcon>
      </Link>
    );
  }
};

export default LanguageSwitch;
