// Blog posts data - Add new posts to the beginning of this array
const blogPostsData = [
    {
        title: "The 59% Problem: Why Workforce Unpreparedness is AI's Real Threat, Not Job Replacement",
        excerpt: "While tech leaders debate AI job replacement, research reveals the real crisis: 59% of workers need reskilling by 2030 but most won't get it. The workforce preparedness gap threatens economic stability more than automation.",
        extendedExcerpt: "McKinsey and World Economic Forum data exposes a workforce crisis hiding in plain sight: while 92% of companies are investing in AI, only 16% of leaders feel prepared for the skills gap. With 59% of workers needing reskilling by 2030 and 120 million at risk without training, the real threat isn't AI replacing jobs—it's leaving millions of workers behind without the skills to adapt.",
        date: "August 2025",
        image: "blog/images/ai-workforce-preparedness-crisis-header.svg",
        imageAlt: "Infographic showing 59% workforce reskilling statistics",
        url: "blog/ai-workforce-preparedness-crisis.html",
        sortDate: new Date("2025-08-29"),
        readingTime: "11 min read"
    },
    {
        title: "The AI Jobs Expectation Gap: Workers Think 30% Job Loss is Coming, But It's Already Here",
        excerpt: "Workers expect AI to replace 20-30% of jobs in 5-10 years, but Stanford data shows entry-level workers already face 13% decline. The gap between perception and reality reveals we're preparing for tomorrow's disruption while today's transformation reshapes the workforce.",
        extendedExcerpt: "New research from Indeed Hiring Lab, Stanford, and Goldman Sachs reveals a dangerous disconnect: while workers expect gradual AI job displacement over 10 years, entry-level positions have already declined 13% in just 2 years. With 300 million jobs at risk globally and 491 people losing jobs to AI daily, the future isn't coming—it's here, and most are still looking at the horizon.",
        date: "August 2025",
        image: "blog/images/ai-job-expectations-reality-gap-ai-2025-08-29T15-11-49.png",
        imageAlt: "AI job displacement infographic showing expectation vs reality gap",
        url: "blog/ai-job-expectations-reality-gap.html",
        sortDate: new Date("2025-08-29"),
        readingTime: "12 min read"
    },
    {
        title: "When AI Orders 18,000 Water Cups: The Taco Bell Drive-Through Fiasco",
        excerpt: "Taco Bell's AI drive-through crashed after ordering 18,000 water cups. Explore the viral failures, McDonald's bacon ice cream incident, and why AI struggles with human chaos.",
        extendedExcerpt: "The fast food industry's rush to automate hit a wall when Taco Bell's AI drive-through system was defeated by a simple prank: ordering 18,000 water cups. This deep dive explores the viral failures at Taco Bell and McDonald's, revealing the fundamental challenges of AI automation in customer service and why the future lies in human-AI collaboration, not replacement.",
        date: "August 2025",
        image: "blog/images/ai-drive-through-fiasco-header.svg",
        imageAlt: "AI robot confused at drive-through with overflowing water cups",
        url: "blog/ai-drive-through-fiasco.html",
        sortDate: new Date("2025-08-29"),
        readingTime: "10 min read"
    },
    {
        title: "An Airing of Grievances: The Essential Guide Every CAF Grievance Analyst Needs",
        excerpt: "After five years analyzing hundreds of grievances at CFGA, Jay Tarzwell shares essential knowledge for CAF and DND analysts in this comprehensive guide to military grievance management.",
        extendedExcerpt: "Drawing from five years of hands-on experience at the Canadian Forces Grievance Authority, this comprehensive guide provides essential knowledge that every CAF and DND grievance analyst needs. From understanding procedural fairness to navigating complex regulatory frameworks, this book demystifies the grievance process and offers practical strategies for effective case management.",
        date: "August 2025",
        image: "blog/images/airing-of-grievances-header.svg",
        imageAlt: "An Airing of Grievances book cover - The Unofficial Guide to Grievance Management in the Canadian Armed Forces",
        url: "blog/airing-of-grievances-book.html",
        sortDate: new Date("2025-08-18"),
        readingTime: "12 min read"
    },
    {
        title: "CanLII Search: AI-Powered Boolean Search for Canadian Legal Research",
        excerpt: "Transform plain English or French queries into precise Boolean searches for Canadian case law and legislation. Built for lawyers, paralegals, students, and anyone researching Canadian law.",
        extendedExcerpt: "Revolutionize your legal research with an AI-powered tool that instantly converts natural language queries into sophisticated Boolean searches. Whether you're a seasoned lawyer, paralegal, or law student, this tool dramatically reduces research time while improving accuracy. Seamlessly search through millions of Canadian legal documents with the precision of an expert researcher.",
        date: "August 2025",
        image: "blog/images/canlii-search-tool-header.svg",
        imageAlt: "CanLII Search Tool - AI-powered Boolean search for Canadian law",
        url: "blog/canlii-search-tool.html",
        sortDate: new Date("2025-08-17"),
        readingTime: "8 min read"
    },
    {
        title: "No, AI Doesn't Make You Stupid",
        excerpt: "AI enhances human intelligence rather than diminishing it. Learn why AI tools amplify our cognitive abilities and make us more capable, not less.",
        extendedExcerpt: "Contrary to popular fears, AI isn't making us intellectually lazy – it's supercharging our cognitive capabilities. This article explores how AI tools act as intellectual force multipliers, enabling us to tackle more complex problems, generate creative solutions faster, and focus our mental energy on high-value thinking. Discover why the smartest professionals are those who embrace AI as a cognitive partner.",
        date: "July 2025",
        image: "blog/images/no-ai-doesnt-make-you-stupid.svg",
        imageAlt: "AI enhancing human cognitive abilities",
        url: "blog/no-ai-doesnt-make-you-stupid.html",
        sortDate: new Date("2025-07-16"),
        readingTime: "6 min read"
    },
    {
        title: "How I Built and Manage My Entire Website Using Claude Desktop and MCP Servers",
        excerpt: "Discover how I built a fully functional website in 6 hours using Claude Desktop and MCP servers, with no coding experience.",
        extendedExcerpt: "From zero to fully functional website in just 6 hours – without writing a single line of code myself. This detailed case study reveals how Claude Desktop and MCP servers transformed me from a non-coder into a website owner. Learn the exact workflow, tools, and strategies I used to build, deploy, and maintain a professional website that generates real business value.",
        date: "July 2025",
        image: "blog/images/claude-desktop-mcp-header.svg",
        imageAlt: "Claude Desktop and MCP servers powering website development",
        url: "blog/claude-desktop-mcp-website-experiment.html",
        sortDate: new Date("2025-07-16"),
        readingTime: "10 min read"
    },
    {
        title: "The AI Jobs Paradox: Why CEOs Are Wrong About AI Replacing Workers",
        excerpt: "While tech executives compete to make the most dramatic predictions about job losses, comprehensive data reveals AI is actually creating more jobs and boosting productivity by 400%.",
        extendedExcerpt: "Tech CEOs are racing to predict AI job apocalypse, but the data tells a completely different story. This deep dive into employment statistics, productivity metrics, and real-world case studies reveals that AI is creating more jobs than it eliminates while boosting worker productivity by an astounding 400%. Discover why the future of work is human-AI collaboration, not human replacement.",
        date: "July 2025",
        image: "blog/images/ai-jobs-paradox-header.svg",
        imageAlt: "AI and humans working together in modern workplace",
        url: "blog/ai-jobs-paradox-ceos-wrong.html",
        sortDate: new Date("2025-07-16"),
        readingTime: "15 min read"
    },
    {
        title: "What Does an Army General Look Like? Demonstrated Bias in Generative AI",
        excerpt: "An experiment using ChatGPT 4 that highlights bias in advanced AI models. Exploring how AI's image generation reveals deep-seated biases and the importance of diversity in AI development.",
        extendedExcerpt: "A simple prompt to generate images of army generals revealed profound biases embedded in AI systems. This eye-opening experiment exposes how AI models perpetuate stereotypes and why diversity in AI training data isn't just politically correct – it's essential for accurate, fair, and truly intelligent systems. The implications for military, corporate, and social applications are staggering.",
        date: "July 2024",
        image: "/images/generals-1.jpeg",
        imageAlt: "Grid of AI-generated military general images",
        url: "blog/ai-bias-army-general.html",
        sortDate: new Date("2024-07-01"),
        readingTime: "7 min read"
    },
    {
        title: "The Personal Medical Dictation Tool I Built for My Brother",
        excerpt: "How a Custom GPT transformed a Nuclear Medicine specialist's most frustrating task into a seamless workflow, demonstrating AI's potential to improve professional lives.",
        extendedExcerpt: "When my brother, a Nuclear Medicine specialist, was drowning in hours of medical report dictation, I built him a custom AI solution that changed everything. This personal story demonstrates how AI can transform tedious professional tasks into efficient workflows, saving hours daily while improving accuracy. Learn how one custom GPT tool revolutionized a doctor's practice and what it means for the future of professional work.",
        date: "March 2024",
        image: "/images/doctor-1.jpeg",
        imageAlt: "Medical professional using dictation technology",
        url: "blog/medical-dictation-tool.html",
        sortDate: new Date("2024-03-01"),
        readingTime: "9 min read"
    }
];

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = blogPostsData;
}