"use client";
import React from 'react'
import SkillCardDetails from '@/app/components/SkillCardDetails';
import Protect from "@/app/components/Protect"; 

function page() {
  return (
    <Protect>
    <div>
        <SkillCardDetails />
    </div>
    </Protect>

  )
}

export default page