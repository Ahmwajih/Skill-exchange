'use client'
import React from 'react'
import SkillProviderDetails from '@/app/components/SkillProviderDetails';
import Protect from "@/app/components/Protect"; 

function page() {
  return (
    <Protect>
    <div>
        <SkillProviderDetails />
    </div>
    </Protect>

  )
}

export default page