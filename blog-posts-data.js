// Blog posts data - Add new posts to the beginning of this array
const blogPostsData = [
    {
        title: "No, AI Doesn't Make You Stupid",
        excerpt: "AI enhances human intelligence rather than diminishing it. Learn why AI tools amplify our cognitive abilities and make us more capable, not less.",
        date: "July 2025",
        image: "blog/images/no-ai-doesnt-make-you-stupid.svg",
        imageAlt: "AI enhancing human cognitive abilities",
        url: "blog/no-ai-doesnt-make-you-stupid.html",
        sortDate: new Date("2025-07-16")
    },
    {
        title: "How I Built and Manage My Entire Website Using Claude Desktop and MCP Servers",
        excerpt: "Discover how I built a fully functional website in 6 hours using Claude Desktop and MCP servers, with no coding experience.",
        date: "July 2025",
        image: "blog/images/claude-desktop-mcp-header.svg",
        imageAlt: "Claude Desktop and MCP servers powering website development",
        url: "blog/claude-desktop-mcp-website-experiment.html",
        sortDate: new Date("2025-07-16")
    },
    {
        title: "The AI Jobs Paradox: Why CEOs Are Wrong About AI Replacing Workers",
        excerpt: "While tech executives compete to make the most dramatic predictions about job losses, comprehensive data reveals AI is actually creating more jobs and boosting productivity by 400%.",
        date: "July 2025",
        image: "blog/images/ai-jobs-paradox-header.svg",
        imageAlt: "AI and humans working together in modern workplace",
        url: "blog/ai-jobs-paradox-ceos-wrong.html",
        sortDate: new Date("2025-07-16") // Today's date
    },
    {
        title: "What Does an Army General Look Like? Demonstrated Bias in Generative AI",
        excerpt: "An experiment using ChatGPT 4 that highlights bias in advanced AI models. Exploring how AI's image generation reveals deep-seated biases and the importance of diversity in AI development.",
        date: "July 2024",
        image: "/images/generals-1.jpeg",
        imageAlt: "Grid of AI-generated military general images",
        url: "blog/ai-bias-army-general.html",
        sortDate: new Date("2024-07-01")
    },
    {
        title: "The Personal Medical Dictation Tool I Built for My Brother",
        excerpt: "How a Custom GPT transformed a Nuclear Medicine specialist's most frustrating task into a seamless workflow, demonstrating AI's potential to improve professional lives.",
        date: "March 2024",
        image: "/images/doctor-1.jpeg",
        imageAlt: "Medical professional using dictation technology",
        url: "blog/medical-dictation-tool.html",
        sortDate: new Date("2024-03-01")
    }
];

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = blogPostsData;
}
