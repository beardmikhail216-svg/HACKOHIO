//weights of the different categories checked
const WEIGHTS = {
    interests: 40,
    languages: 30,
    frameworks: 20,
    databases: 10
};

//calculate how much two lists overlap
function getMatchRatio(userSkills, projectSkills) {
    if (!Array.isArray(projectSkills) || projectSkills.length === 0) {
        return null;
    }

    const userSet = new Set(
        (Array.isArray(userSkills) ? userSkills : [])
        .map(skill => skill.trim().toLowerCase())
    );

    const requirements = [
        ...new Set(
            projectSkills.map(skill => skill.trim().toLowerCase())
        )
    ];

    let matches = 0;

    for (const skill of requirements) {
        if (userSet.has(skill)) {
            matches++;
        }
    }

    return matches / requirements.length;    
}

function calculateMatch(user, project) {
    const categories = [
        {
            userSkills: user.interests,
            projectSkills: project.topics,
            weight: WEIGHTS.interests
        },
        {
            userSkills: user.languages,
            projectSkills: project.languages,
            weight: WEIGHTS.languages
        },
        {
            userSkills: user.frameworks,
            projectSkills: project.frameworks,
            weight: WEIGHTS.frameworks
        },
        {
            userSkills: user.databases,
            projectSkills: project.databases,
            weight: WEIGHTS.databases
        }
    ];

    let weightedScore = 0;
    let totalWeight = 0;

    for (const category of categories) {
        const ratio = getMatchRatio(
            category.userSkills,
            category.projectSkills
        );

        if (ratio !== null) {
            weightedScore += ratio * category.weight;
            totalWeight += category.weight;
        }
    }

    if (totalWeight === 0) {
        return 0;
    }

    return Math.round((weightedScore / totalWeight) * 100);
}

//rank all projectes from highest to lowest compatibility.
function rankProjects(user, projects) {
    const rankedProjects = projects.map(project => {
        return {
            ...project,
            matchScore: calculateMatch(user, project)
        };
    });

    rankedProjects.sort((a, b) => b.matchScore - a.matchScore);

    return rankedProjects; 
}

module.exports = {
    getMatchRatio,
    calculateMatch,
    rankProjects
};

