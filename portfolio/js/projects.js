/**
 * Projects Loader with GitHub Integration
 * Dynamically loads projects from JSON file and GitHub API
 */

class ProjectsLoader {
    constructor() {
        this.projectsGrid = document.getElementById('projects-grid');
        this.projectsData = [];

        if (!this.projectsGrid) return;

        this.init();
    }

    async init() {
        await this.loadProjects();
        this.renderProjects();
    }

    async loadProjects() {
        try {
            const response = await fetch('data/projects.json?v=' + new Date().getTime());
            const data = await response.json();
            this.projectsData = data.projects || [];

            // Fetch additional details from GitHub for each project
            await this.enrichWithGitHubData();
        } catch (error) {
            console.log('Loading sample projects...');
            // Fallback to sample projects if JSON doesn't exist
            this.projectsData = this.getSampleProjects();
        }
    }

    async enrichWithGitHubData() {
        const enrichedProjects = [];

        for (const project of this.projectsData) {
            try {
                // If project has a GitHub URL, fetch details from GitHub API
                if (project.githubUrl && project.githubUrl !== '#' && project.githubUrl.includes('github.com')) {
                    const githubData = await this.fetchGitHubRepoData(project.githubUrl);

                    // Merge GitHub data with existing project data
                    enrichedProjects.push({
                        ...project,
                        description: project.description || githubData.description,
                        image: project.image || githubData.image,
                        tags: project.tags?.length > 0 ? project.tags : githubData.topics,
                        stars: githubData.stars,
                        language: githubData.language
                    });
                } else {
                    enrichedProjects.push(project);
                }
            } catch (error) {
                console.error(`Failed to fetch GitHub data for ${project.title}:`, error);
                enrichedProjects.push(project);
            }
        }

        this.projectsData = enrichedProjects;
    }

    async fetchGitHubRepoData(githubUrl) {
        // Extract owner and repo from GitHub URL
        // Format: https://github.com/owner/repo
        const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) throw new Error('Invalid GitHub URL');

        const [, owner, repo] = match;
        const cleanRepo = repo.replace(/\.git$/, ''); // Remove .git if present

        // Fetch repository data from GitHub API
        const response = await fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`);
        if (!response.ok) throw new Error('GitHub API request failed');

        const repoData = await response.json();

        return {
            description: repoData.description || 'No description available',
            image: repoData.owner.avatar_url, // Use owner's avatar as fallback
            topics: repoData.topics || [],
            stars: repoData.stargazers_count,
            language: repoData.language
        };
    }

    getSampleProjects() {
        return [
            {
                id: 1,
                title: "Soul Search",
                description: "A powerful search application with advanced filtering and real-time results.",
                image: "assets/projects/project1.jpg",
                tags: ["Next.js", "Prisma", "TypeScript"],
                liveUrl: "#",
                githubUrl: "#",
                featured: true
            },
            {
                id: 2,
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce solution with payment integration and admin dashboard.",
                image: "assets/projects/project2.jpg",
                tags: ["React", "Node.js", "MongoDB"],
                liveUrl: "#",
                githubUrl: "#",
                featured: true
            },
            {
                id: 3,
                title: "Task Management App",
                description: "Collaborative task management tool with real-time updates and team features.",
                image: "assets/projects/project3.jpg",
                tags: ["Vue.js", "Firebase", "Tailwind"],
                liveUrl: "#",
                githubUrl: "#",
                featured: false
            },
            {
                id: 4,
                title: "Weather Dashboard",
                description: "Beautiful weather application with location-based forecasts and animations.",
                image: "assets/projects/project4.jpg",
                tags: ["JavaScript", "API", "CSS"],
                liveUrl: "#",
                githubUrl: "#",
                featured: false
            }
        ];
    }

    renderProjects() {
        if (!this.projectsGrid) return;

        this.projectsGrid.innerHTML = this.projectsData.map((project, index) => {
            const liveLink = project.liveUrl && project.liveUrl !== '#' ? `
                <a href="${project.liveUrl}" target="_blank" class="project-link" title="Open Live Site">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    <span>Live Demo</span>
                </a>
            ` : '';

            const githubLink = project.githubUrl && project.githubUrl !== '#' ? `
                <a href="${project.githubUrl}" target="_blank" class="project-link" title="View GitHub Repo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    <span>GitHub Repo</span>
                </a>
            ` : '';

            const stats = project.stars !== undefined ? `
                <div class="project-stats">
                    <span class="project-stat">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        ${project.stars}
                    </span>
                    ${project.language ? `<span class="project-stat">${project.language}</span>` : ''}
                </div>
            ` : '';

            const tags = project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('');
            const featured = project.featured ? '<span class="project-featured">Featured</span>' : '';

            return `
                <article class="project-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="project-image">
                        <img src="${project.image}" alt="${project.title}" onerror="this.src='data:image/svg+xml,%3csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 220%22%3e%3crect fill=%22%23111111%22 width=%22400%22 height=%22220%22/%3e%3ctext x=%22200%22 y=%22110%22 fill=%22%23D4AF37%22 font-size=%2240%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3e${project.title.charAt(0)}%3c/text%3e%3c/svg%3e'">
                        <div class="project-overlay">
                            <div class="project-links">
                                ${liveLink}
                                ${githubLink}
                            </div>
                        </div>
                    </div>
                    <div class="project-content">
                        ${featured}
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-description">${project.description}</p>
                        ${stats}
                        <div class="project-tags">
                            ${tags}
                        </div>
                    </div>
                </article>
            `;
        }).join('');

        // Trigger AOS animations
        setTimeout(() => {
            document.querySelectorAll('.project-card').forEach(card => {
                card.classList.add('aos-animate');
            });
        }, 100);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProjectsLoader();
});
