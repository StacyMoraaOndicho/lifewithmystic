"use client";
import { useEffect } from "react";
import Particles from "./Particles";
import MotionContainer from "./MotionContainer";

export default function SensoryMount({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // nothing here yet; component exists to wrap client-only sensory UI
  }, []);

  return (
    <>
      <Particles />
      <MotionContainer>{children}</MotionContainer>
    </>
  );
}
