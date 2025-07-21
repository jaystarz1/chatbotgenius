// Utility functions for NATO M&S Workflow

// Helper functions for organizing content by Annex C requirements
window.getAIStepsForRequirement = function(phaseId, reqId, aiCallChains) {
    if (!aiCallChains[phaseId]) return [];
    
    // Map specific AI steps to Annex C requirements
    const requirementMappings = {
        1: {
            '1.1': ['1-D'], // Objectives identification
            '1.2': ['1-E', '1-F', '1-H'], // Requirements, constraints, stakeholders, entity mapping
            '1.3': ['1-G'] // Performance measures
        },
        2: {
            '2.1': ['2-A', '2-B'], // Abstract representation, entities and interactions
            '2.2': ['2-B', '2-E'], // Key entities, processes, interactions
            '2.3': ['2-C', '2-D'] // Assumptions, simplifications, scope
        },
        3: {
            '3.1': ['3-E', '3-F'], // Structured design translation
            '3.2': ['3-A', '3-B'], // Modeling technique selection
            '3.3': ['3-C', '3-D'] // Input parameters, algorithms, data structures
        },
        4: {
            '4.1': ['4-B', '4-F'], // Model development using programming languages
            '4.2': ['4-A', '4-D'], // Data sources and computational methods integration
            '4.3': ['4-E', '4-G'] // Performance and scalability optimization
        },
        5: {
            '5.1': ['5-A', '5-B'], // Verification: correct build
            '5.2': ['5-C', '5-D'] // Validation: real-world accuracy
        },
        6: {
            '6.1': ['6-A', '6-B'], // Scenario development per doctrine
            '6.2': ['6-C'], // Design of experiment
            '6.3': ['6-D', '6-E'], // Simulation runs and sensitivity analysis
            '6.4': ['6-F', '6-G'], // Results interpretation and effectiveness assessment
            '6.5': ['6-H'] // Areas for improvement identification
        },
        7: {
            '7.1': ['7-C', '7-D'] // Model updates based on new data/requirements
        }
    };
    
    const mappedSteps = requirementMappings[phaseId]?.[reqId] || [];
    return aiCallChains[phaseId].filter(step => 
        mappedSteps.some(mappedStep => step.step === mappedStep)
    );
};

window.getProcessStepsForRequirement = function(subProcesses, reqId) {
    // Map subprocess names to Annex C requirements based on their purpose
    const processMapping = {
        '1.1': ['Objectives Identification (Task 1.1)'],
        '1.2': ['Requirements & Constraints Analysis (Task 1.2)', 'Entity & Stakeholder Mapping'],
        '1.3': ['Performance Measures Establishment (Task 1.3)'],
        '2.1': ['LLM Draft Entities/Processes', 'Ontology Lookup'],
        '2.2': ['LLM Draft Entities/Processes', 'Consistency Checker'],
        '2.3': ['Scope & Assumption Engine'],
        '3.1': ['Design Review Gate'],
        '3.2': ['Heuristic Rulebank', 'ML Classifier'],
        '3.3': ['Data-Schema Synthesizer', 'Parameter Seed Generator'],
        '4.1': ['Code-LLM Fill-In', 'Regenerate/SME'],
        '4.2': ['Template Loader', 'Dependency Resolver'],
        '4.3': ['Auto-Build Runner'],
        '5.1': ['Unit Tests', 'Smoke Scenario Run'],
        '5.2': ['Statistical Fit', 'Face-Validity Heuristics'],
        '6.1': ['NATO Doctrine Parser', 'Force Structure Generator'],
        '6.2': ['DoE Planner'],
        '6.3': ['Parallel Runner', 'KPI Extractor'],
        '6.4': ['ML Post-analysis', 'Chart Render'],
        '6.5': ['Insight Synthesizer'],
        '7.1': ['Version Recommender', 'Auto-Patch Draft']
    };
    
    const mappedProcesses = processMapping[reqId] || [];
    return subProcesses.filter(proc => 
        mappedProcesses.some(mappedProc => proc.name.includes(mappedProc) || mappedProc.includes(proc.name))
    );
};

window.getUnmappedActivities = function(phase, annexCData) {
    // Return activities that don't map to specific Annex C requirements
    const unmappedActivities = [];
    
    // Check for special features, resource hooks, etc.
    if (phase.specialFeatures) {
        unmappedActivities.push(...phase.specialFeatures);
    }
    if (phase.resourceHooks) {
        unmappedActivities.push(...phase.resourceHooks);
    }
    if (phase.performanceLoops) {
        unmappedActivities.push(...phase.performanceLoops);
    }
    
    return unmappedActivities;
};

// Helper function to get supporting data for specific requirements
window.getSupportingDataForRequirement = function(phase, reqId) {
    const supportingData = [];
    
    // Map supporting data to specific requirements
    if (phase.id === 1) {
        switch (reqId) {
            case '1.1':
                // Objectives-related supporting data would go here
                break;
            case '1.2':
                // Requirements/constraints supporting data
                if (phase.ontologyMap) {
                    supportingData.push({
                        type: 'ontologyMap',
                        title: 'NATO Ontology Mapping',
                        icon: 'Hash',
                        data: phase.ontologyMap,
                        description: 'Maps informal entity references to standardized NATO IDs for stakeholder clarity'
                    });
                }
                if (phase.nlpModels) {
                    supportingData.push({
                        type: 'nlpModels',
                        title: 'NLP Models for Requirements Extraction',
                        icon: 'Database',
                        data: phase.nlpModels,
                        description: 'AI models used to parse and extract requirements from NATO documents'
                    });
                }
                break;
            case '1.3':
                // Performance measures supporting data
                if (phase.performanceCatalog) {
                    supportingData.push({
                        type: 'performanceCatalog',
                        title: 'Performance Measures Catalog (KPI/MoE/MoP)',
                        icon: 'BarChart3',
                        data: phase.performanceCatalog,
                        description: 'NATO-standard performance measures automatically extracted and categorized'
                    });
                }
                break;
        }
    }
    
    // Add more phases as needed...
    
    return supportingData;
};

// Helper to get process icon based on type
window.getProcessIcon = function(type) {
    const { AlertTriangle, Activity, Cpu } = window.lucideIcons;
    switch (type) {
        case 'decision': return AlertTriangle;
        case 'process': return Activity;
        default: return Cpu;
    }
};

// Helper to get process color based on type
window.getProcessColor = function(type) {
    switch (type) {
        case 'decision': return 'border-yellow-400 bg-yellow-50';
        case 'process': return 'border-blue-400 bg-blue-50';
        default: return 'border-gray-400 bg-gray-50';
    }
};
