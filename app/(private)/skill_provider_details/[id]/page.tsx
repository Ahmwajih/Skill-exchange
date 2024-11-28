"use client";
import React from "react";
import SkillProviderDetails from "@/app/components/SkillProviderDetails";
import Protect from "@/app/components/Protect";

function page() {
  return (
    <Protect>
      <SkillProviderDetails />
    </Protect>
  );
}

export default page;
