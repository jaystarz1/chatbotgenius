// Blog posts data - Add new posts to the beginning of this array
const blogPostsData = [
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
        image: "images/generals-1.jpeg",
        imageAlt: "Grid of AI-generated military general images",
        url: "blog/ai-bias-army-general.html",
        sortDate: new Date("2024-07-01")
    },
    {
        title: "The Personal Medical Dictation Tool I Built for My Brother",
        excerpt: "How a Custom GPT transformed a Nuclear Medicine specialist's most frustrating task into a seamless workflow, demonstrating AI's potential to improve professional lives.",
        date: "March 2024",
        image: "images/doctor-1.jpeg",
        imageAlt: "Medical professional using dictation technology",
        url: "blog/medical-dictation-tool.html",
        sortDate: new Date("2024-03-01")
    }
];

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = blogPostsData;
}
