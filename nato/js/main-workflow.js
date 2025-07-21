// Main InteractiveWorkflow component for NATO M&S Workflow

window.InteractiveWorkflow = function() {
    const { useState, useRef, useEffect } = React;
    const [expandedPhase, setExpandedPhase] = useState(null);
    const [hoveredProcess, setHoveredProcess] = useState(null);
    
    // Import icons
    const { Settings } = window.lucideIcons;
    
    // Import all data
    const phases = window.phases;
    const globalFeatures = window.globalFeatures;
    const annexCRequirements = window.annexCRequirements;
    const aiCallChains = window.aiCallChains;
    
    // Import components
    const PhaseRenderer = window.PhaseRenderer;
    const RequirementsRenderer = window.RequirementsRenderer;
    
    const handlePhaseClick = (phaseId) => {
        setExpandedPhase(expandedPhase === phaseId ? null : phaseId);
    };
    
    return React.createElement('div', { className: 'max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen' },
        // Header
        React.createElement('div', { className: 'mb-8 text-center' },
            React.createElement('h1', { className: 'text-3xl font-bold text-gray-800 mb-2' },
                'RFP-ACT-SACT-25-64: AI Support to NATO M&S Lifecycle'
            ),
            React.createElement('p', { className: 'text-gray-600' },
                'Full automation design implementing NATO Annex C requirements to systematically determine AI capabilities and limits'
            ),
            React.createElement('div', { 
                className: 'mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 max-w-5xl mx-auto' 
            },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                    React.createElement('div', { className: 'text-left' },
                        React.createElement('p', { className: 'text-sm text-blue-800 leading-relaxed mb-2' },
                            React.createElement('strong', null, 'RFP Context:'),
                            ' NATO problem domain and statement will be provided ',
                            React.createElement('strong', null, '1 October 2025'),
                            ' per RFP Phase 2 requirements.'
                        ),
                        React.createElement('p', { className: 'text-sm text-blue-800 leading-relaxed' },
                            React.createElement('strong', null, 'Full Automation Design:'),
                            ' Each phase implements complete AI automation with zero human intervention to systematically test where AI succeeds vs. where human expertise becomes essential.'
                        )
                    ),
                    React.createElement('div', { className: 'text-left' },
                        React.createElement('p', { className: 'text-sm text-indigo-800 leading-relaxed mb-2' },
                            React.createElement('strong', null, 'Annex C Compliance:'),
                            ' Phases 1-7 directly implement NATO\'s M&S lifecycle tasks. Phase 0 enables automated processing of HQ SACT scenario inputs.'
                        ),
                        React.createElement('p', { className: 'text-sm text-indigo-800 leading-relaxed' },
                            React.createElement('strong', null, 'AI Failure Analysis:'),
                            ' When automation fails, we capture exactly where and why - providing NATO empirical data on AI boundaries rather than theoretical assumptions.'
                        )
                    )
                )
            ),
            React.createElement('p', { className: 'text-sm text-gray-500 mt-4' },
                'Click any phase to expand Annex C compliance and AI automation details'
            )
        ),
        
        // Global Features
        React.createElement('div', { 
            className: 'mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200' 
        },
            React.createElement('h3', { className: 'text-lg font-semibold mb-4 flex items-center gap-2' },
                React.createElement(Settings, { className: 'w-5 h-5' }),
                'AI Automation Architecture Principles'
            ),
            React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
                globalFeatures.map((feature, index) =>
                    React.createElement('div', { 
                        key: index, 
                        className: 'bg-white p-4 rounded border border-gray-200' 
                    },
                        React.createElement('h4', { className: 'font-medium text-gray-800 mb-2' }, 
                            feature.name
                        ),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, 
                            feature.description
                        )
                    )
                )
            )
        ),
        
        // Phases Accordion
        React.createElement('div', { className: 'space-y-6' },
            phases.map((phase, index) =>
                React.createElement(PhaseRenderer, {
                    key: phase.id,
                    phase: phase,
                    expandedPhase: expandedPhase,
                    annexCRequirements: annexCRequirements,
                    aiCallChains: aiCallChains,
                    onPhaseClick: handlePhaseClick
                })
            )
        )
    );
};
