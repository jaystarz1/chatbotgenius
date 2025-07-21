// NATO Annex C Requirements Mapping for M&S Workflow

window.annexCRequirements = {
    1: {
        title: "Problem Definition & Requirements Analysis",
        requirements: [
            { id: "1.1", text: "Identify the objectives of the simulation", status: "✅", coverage: "AI Steps 1-A: Extract mission objectives" },
            { id: "1.2", text: "Define key requirements, constraints, and stakeholders", status: "✅", coverage: "AI Steps 1-B, 1-E, 1-F: Extract constraints and entities" },
            { id: "1.3", text: "Establish performance measures (KPI, MoE, MoP)", status: "✅", coverage: "AI Steps 1-C, 1-D: Classify and structure all three measure types" }
        ]
    },
    2: {
        title: "Conceptual Model Development",
        requirements: [
            { id: "2.1", text: "Develop an abstract representation of the system or problem", status: "✅", coverage: "AI Step 2-A: Generate entity class stubs with attributes" },
            { id: "2.2", text: "Identify key entities, processes, and interactions", status: "✅", coverage: "AI Step 2-B: Draft interaction matrix (who can shoot/move/detect whom)" },
            { id: "2.3", text: "Define assumptions, simplifications, and scope", status: "✅", coverage: "AI Steps 2-C, 2-D: Insert spatial/temporal scope and list assumptions" }
        ]
    },
    3: {
        title: "Model Design",
        requirements: [
            { id: "3.1", text: "Translate the conceptual model into a structured design", status: "✅", coverage: "AI Steps 3-A, 3-B: Heuristic rules + ML classification for design approach" },
            { id: "3.2", text: "Choose appropriate modelling techniques (e.g., discrete event, agent-based, system dynamics)", status: "✅", coverage: "AI Step 3-B: ML classifier outputs probability per design type" },
            { id: "3.3", text: "Define input parameters, algorithms, and data structures", status: "✅", coverage: "AI Steps 3-C, 3-D: Generate data schema YAML + seed parameters table" }
        ]
    },
    4: {
        title: "Model Implementation",
        requirements: [
            { id: "4.1", text: "Develop the model/s using programming languages", status: "✅", coverage: "AI Step 4-B: Fill Jinja placeholders with code-LLM" },
            { id: "4.2", text: "Integrate necessary data sources and computational methods", status: "✅", coverage: "AI Steps 4-A, 4-D: Template loader + dependency resolver" },
            { id: "4.3", text: "Optimize for performance and scalability", status: "✅", coverage: "AI Steps 4-E, 4-F: Build runner + automated patch generation" }
        ]
    },
    5: {
        title: "Verification & Validation (V&V)",
        requirements: [
            { id: "5.1", text: "Verification: Ensure the model/s is/are built correctly (debugging, code reviews, unit testing)", status: "✅", coverage: "AI Steps 5-A, 5-B: Unit tests + smoke scenario run" },
            { id: "5.2", text: "Validation: Ensure the model/s accurately represents the real-world system", status: "✅", coverage: "AI Steps 5-C, 5-D: Statistical fit + face-validity heuristics" }
        ]
    },
    6: {
        title: "Experimentation & Analysis",
        requirements: [
            { id: "6.1", text: "Develop the scenario (in accordance with doctrine: Blue, Red and Green/White)", status: "✅", coverage: "AI Steps 6-A, 6-B: NATO Doctrine Parser + Force Structure Generator" },
            { id: "6.2", text: "Design of experiment to cover the problem statement and KPI", status: "✅", coverage: "AI Step 6-C: DoE planner script" },
            { id: "6.3", text: "Conduct simulation runs and sensitivity analysis", status: "✅", coverage: "AI Steps 6-D, 6-E: Parallel runner + KPI extractor" },
            { id: "6.4", text: "Interpret results and assess the model's/models' effectiveness", status: "✅", coverage: "AI Steps 6-F, 6-G: SHAP analysis + chart renderer" },
            { id: "6.5", text: "Identify areas for improvement", status: "✅", coverage: "AI Step 6-H: Summarize top 5 insights with recommendations" }
        ]
    },
    7: {
        title: "Maintenance & Evolution",
        requirements: [
            { id: "7.1", text: "Update the model/s based on new data, technologies, or requirements", status: "✅", coverage: "AI Steps 7-C, 7-D: Action recommender + auto-patch draft" }
        ]
    }
};
