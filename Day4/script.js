const skills = [
  { name: "HTML", proficiency: "Intermediate", years: 2, category: "Frontend" },
  { name: "CSS", proficiency: "Advanced", years: 3, category: "Frontend" },
  { name: "JavaScript", proficiency: "Beginner", years: 1, category: "Frontend" },
  { name: "Node.js", proficiency: "Intermediate", years: 2, category: "Backend" }
];


function formatSkills(skillsArray) {
  return skillsArray.map(
    skill => `${skill.name} (${skill.proficiency}) – ${skill.years} yr(s)`
  );
}

console.log("Formatted:", formatSkills(skills));

//advance
function filterByProficiency(level) {
  return skills.filter(skill => skill.proficiency === level);
}
console.log("Advanced only:", filterByProficiency("Advanced"));


//sort
function sortByName() {
  return [...skills].sort((a, b) => a.name.localeCompare(b.name));
}
console.log("Sorted:", sortByName());


//group
function groupByCategory() {
  return skills.reduce((groups, skill) => {
    (groups[skill.category] = groups[skill.category] || []).push(skill);
    return groups;
  }, {});
}
console.log("Grouped:", groupByCategory());
