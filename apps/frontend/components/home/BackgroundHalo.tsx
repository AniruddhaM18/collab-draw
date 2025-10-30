"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/libs/hooks/redux";
import { setBackgroundHaloPosition } from "@/libs/features/collabdraw/appSlice";

const BackgroundHalo = () => {
  const position = useAppSelector((state) => state.app.backgroundHaloPosition);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (position) {
      dispatch(setBackgroundHaloPosition(position));
    }
  }, [position]);

  return (
    <div
      style={{
        position: "absolute",
        top: `${position?.y}px`,
        left: `${position?.x}px`,
      }}
      className="w-[70px] h-[70px] blur-xl bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2"
    />
  );
};

export default BackgroundHalo;