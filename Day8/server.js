const express = require("express");
const app = express();

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution",
    technologies: ["React", "Node.js", "MongoDB"],
    githubUrl: "https://github.com/user/ecommerce",
    liveUrl: "https://ecommerce-demo.com",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative project management tool",
    technologies: ["Vue.js", "Express", "PostgreSQL"],
    githubUrl: "https://github.com/user/taskapp",
    liveUrl: "https://taskapp-demo.com",
  },
   {
    id: 3,
    title: "Personal Portfolio",
    description: "Responsive portfolio website to showcase work",
    technologies: ["HTML", "CSS", "JavaScript", "React"],
    githubUrl: "https://github.com/user/portfolio",
    liveUrl: "https://portfolio-demo.com"
  },
  {
    id: 4,
    title: "Chat Application",
    description: "Real-time chat application with rooms and private messaging",
    technologies: ["Node.js", "Socket.io", "Express", "MongoDB"],
    githubUrl: "https://github.com/user/chatapp",
    liveUrl: "https://chatapp-demo.com"
  },
  {
    id: 5,
    title: "Blog Platform",
    description: "Platform to write and publish blogs with authentication",
    technologies: ["Next.js", "Firebase", "TailwindCSS"],
    githubUrl: "https://github.com/user/blogplatform",
    liveUrl: "https://blogplatform-demo.com"
  }
];

const workExperience = [
  {
    id: 1,
    company: "Tech Corp",
    position: "Full Stack Developer",
    duration: "2022 - Present",
    description: "Developed scalable web applications",
    technologies: ["React", "Node.js", "AWS"],
  },
  {
    id: 2,
    company: "Innovate Solutions",
    position: "Frontend Developer",
    duration: "2021 - 2022",
    description: "Implemented responsive UIs and interactive dashboards",
    technologies: ["Vue.js", "HTML", "CSS", "JavaScript"]
  },
  {
    id: 3,
    company: "NextGen Labs",
    position: "Backend Developer",
    duration: "2020 - 2021",
    description: "Built RESTful APIs and integrated third-party services",
    technologies: ["Node.js", "Express", "MongoDB", "PostgreSQL"]
  },
  {
    id: 4,
    company: "Creative Soft",
    position: "Intern",
    duration: "2019 - 2020",
    description: "Assisted in web development projects and testing",
    technologies: ["HTML", "CSS", "JavaScript"]
  }
];


app.use(express.json());



app.get("/", (req, res) => {
  res.send("<h2>Resume API is running 🚀</h2>");
});


app.get("/api/projects", (req, res) => {
  res.json({
    success: true,
    count: projects.length,
    data: projects,
  });
});


app.get("/api/projects/:id", (req, res) => {
  const projectId = parseInt(req.params.id, 10);
  const project = projects.find((p) => p.id === projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: "Project not found",
    });
  }

  res.json({
    success: true,
    data: project,
  });
});


app.get("/api/experience", (req, res) => {
  res.json({
    success: true,
    count: workExperience.length,
    data: workExperience,
  });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
