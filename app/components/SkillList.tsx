"use client";

import React, { useEffect, useState } from "react";
import SkillCard from "./SkillCard";

interface Skill {
  _id: string;
  title: string;
  description: string;
  category: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  photo: string;
}

const SkillsList: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/skills/");
        const result = await response.json();

        if (result.success) {
          setSkills(result.data);
        } else {
          console.error("Failed to fetch skills");
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  return (
<div className="container  bg-white mx-auto lg:px-2">
  <div className="grid cardContainer  md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-3 gap-6 justify-items-center">
    {skills.map((skill) => (
      <SkillCard
        key={skill._id}
        imageSrc={skill.photo || "no photo"}
        title={skill.title}
        category={skill.category}
      />
    ))}
  </div>
</div>
  );
};

export default SkillsList;
