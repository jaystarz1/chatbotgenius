// Phase rendering component for NATO M&S Workflow

window.PhaseRenderer = function({ phase, expandedPhase, annexCRequirements, aiCallChains, onPhaseClick }) {
    const { useState, useRef, useEffect } = React;
    const phaseRef = useRef(null);
    
    const isExpanded = expandedPhase === phase.id;
    
    // Icon components from window.lucideIcons
    const {
        ChevronDown, ChevronUp, FileText, Cpu, AlertTriangle, RefreshCw, Zap, Settings,
        Activity, FileJson, FolderOpen, ArrowRight, Info, Database, Code, TestTube,
        FileCheck, BarChart3, Hash, Bot, Terminal, GitBranch, Workflow
    } = window.lucideIcons;
    
    // Import utility functions
    const {
        getAIStepsForRequirement,
        getProcessStepsForRequirement,
        getUnmappedActivities,
        getProcessIcon,
        getProcessColor,
        FileIcon,
        DetailBlock,
        ExplainerBox
    } = window;
    
    useEffect(() => {
        if (isExpanded && phaseRef.current) {
            phaseRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isExpanded]);
    
    const getIconComponent = (iconName) => {
        const iconMap = {
            'AlertTriangle': AlertTriangle,
            'Activity': Activity,
            'Cpu': Cpu,
            'Bot': Bot,
            'Terminal': Terminal,
            'Hash': Hash,
            'Database': Database,
            'BarChart3': BarChart3,
            'Code': Code,
            'FileCheck': FileCheck,
            'TestTube': TestTube,
            'FileText': FileText
        };
        return iconMap[iconName] || Cpu;
    };
    
    return React.createElement('div', {
        ref: phaseRef,
        className: 'scroll-mt-6'
    },
        React.createElement('div', {
            className: `bg-white border-2 rounded-lg transition-all cursor-pointer ${
                isExpanded ? 'border-blue-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'
            }`,
            onClick: () => onPhaseClick(phase.id)
        },
            // Phase Header
            React.createElement('div', { className: 'p-6' },
                React.createElement('div', { className: 'flex items-start gap-4' },
                    // Phase Number Circle
                    React.createElement('div', {
                        className: `w-14 h-14 ${phase.color} rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0`
                    }, phase.id),
                    
                    // Phase Info
                    React.createElement('div', { className: 'flex-1' },
                        React.createElement('div', { className: 'flex items-center gap-3 mb-2' },
                            React.createElement('h3', { className: 'text-xl font-semibold text-gray-800' }, phase.name),
                            React.createElement('code', { className: 'text-sm bg-gray-100 px-2 py-1 rounded font-mono' }, phase.cli)
                        ),
                        React.createElement('p', { className: 'text-gray-600 mb-3' }, phase.description),
                        
                        // Input/Output Preview
                        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mt-4' },
                            // Input
                            React.createElement('div', { className: 'bg-blue-50 p-3 rounded-lg' },
                                React.createElement('div', { className: 'flex items-center gap-2 mb-1' },
                                    React.createElement(FileIcon, { type: phase.primaryInput.file.includes('/') ? 'directory' : 'file' }),
                                    React.createElement('span', { className: 'text-sm font-medium text-blue-800' }, 'Input:')
                                ),
                                React.createElement('code', { className: 'text-xs block text-blue-700' }, phase.primaryInput.file)
                            ),
                            
                            // Arrow
                            React.createElement('div', { className: 'flex items-center justify-center' },
                                React.createElement(ArrowRight, { className: 'w-5 h-5 text-gray-400' })
                            ),
                            
                            // Output
                            React.createElement('div', { className: 'bg-green-50 p-3 rounded-lg' },
                                React.createElement('div', { className: 'flex items-center gap-2 mb-1' },
                                    React.createElement(FileIcon, { type: phase.primaryOutput.file.includes('/') ? 'directory' : 'file' }),
                                    React.createElement('span', { className: 'text-sm font-medium text-green-800' }, 'Output:')
                                ),
                                React.createElement('code', { className: 'text-xs block text-green-700' }, phase.primaryOutput.file)
                            )
                        )
                    ),
                    
                    // Chevron
                    React.createElement('div', { className: 'flex-shrink-0' },
                        isExpanded ? 
                            React.createElement(ChevronUp, { className: 'w-5 h-5 text-gray-400' }) :
                            React.createElement(ChevronDown, { className: 'w-5 h-5 text-gray-400' })
                    )
                )
            ),
            
            // Expanded Content
            isExpanded && React.createElement('div', { className: 'border-t border-gray-200 bg-gray-50 p-6 space-y-6' },
                // Phase Explanation
                phase.phaseExplanation && React.createElement('div', { className: 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6' },
                    React.createElement('p', { className: 'text-gray-700 leading-relaxed' }, phase.phaseExplanation)
                ),
                
                // RFP Context for Phase 0
                phase.rfpContext && React.createElement('div', { className: 'bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6' },
                    React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                        React.createElement(FileText, { className: 'w-4 h-4 text-indigo-600' }),
                        React.createElement('span', { className: 'text-sm font-medium text-indigo-900' }, 'RFP Phase 2 Context')
                    ),
                    React.createElement('p', { className: 'text-gray-700 leading-relaxed' }, phase.rfpContext)
                ),
                
                // Annex C Note for Phase 0
                phase.annexCNote && React.createElement('div', { className: 'bg-green-50 border border-green-200 rounded-lg p-4 mb-6' },
                    React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                        React.createElement(FileCheck, { className: 'w-4 h-4 text-green-600' }),
                        React.createElement('span', { className: 'text-sm font-medium text-green-900' }, 'Annex C Pipeline Enabler')
                    ),
                    React.createElement('p', { className: 'text-gray-700 leading-relaxed' }, phase.annexCNote)
                ),
                
                // CLI Command Example
                React.createElement('div', { className: 'bg-gray-800 text-green-400 p-4 rounded-lg font-mono text-sm' },
                    React.createElement('span', { className: 'text-gray-400' }, '$'),
                    ' python ',
                    phase.cli,
                    '.py ',
                    phase.primaryInput.file
                ),
                
                // Input/Output Specification
                React.createElement('div', { className: 'bg-white border border-gray-200 rounded-lg p-6' },
                    React.createElement('h3', { className: 'font-semibold mb-4 flex items-center gap-2' },
                        React.createElement(FileText, { className: 'w-5 h-5' }),
                        'Module Interface Specification'
                    ),
                    
                    React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
                        // Input
                        React.createElement('div', { className: 'bg-blue-50 p-4 rounded-lg border border-blue-200' },
                            React.createElement('h4', { className: 'font-medium text-blue-900 mb-3 flex items-center gap-2' },
                                React.createElement(FileIcon, { type: phase.primaryInput.file.includes('/') ? 'directory' : 'file' }),
                                'Primary Input'
                            ),
                            React.createElement('code', { className: 'block text-sm bg-white px-3 py-2 rounded mb-2 border border-blue-200' },
                                phase.primaryInput.file
                            ),
                            React.createElement('p', { className: 'text-sm text-blue-800' }, phase.primaryInput.description)
                        ),
                        
                        // Output
                        React.createElement('div', { className: 'bg-green-50 p-4 rounded-lg border border-green-200' },
                            React.createElement('h4', { className: 'font-medium text-green-900 mb-3 flex items-center gap-2' },
                                React.createElement(FileIcon, { type: phase.primaryOutput.file.includes('/') ? 'directory' : 'file' }),
                                'Primary Output'
                            ),
                            React.createElement('code', { className: 'block text-sm bg-white px-3 py-2 rounded mb-2 border border-green-200' },
                                phase.primaryOutput.file
                            ),
                            React.createElement('p', { className: 'text-sm text-green-800' }, phase.primaryOutput.description),
                            
                            // Secondary outputs if any
                            phase.secondaryOutputs && React.createElement('div', { className: 'mt-3 pt-3 border-t border-green-300' },
                                React.createElement('p', { className: 'text-xs text-green-700 font-medium mb-2' }, 'Additional outputs:'),
                                phase.secondaryOutputs.map((output, idx) => 
                                    React.createElement('div', { key: idx, className: 'text-xs text-green-700 mb-1' },
                                        React.createElement('code', { className: 'bg-white px-2 py-0.5 rounded' }, output.file),
                                        React.createElement('span', { className: 'ml-2' }, '- ', output.description)
                                    )
                                )
                            )
                        )
                    )
                ),
                
                // Data Flow
                React.createElement('div', { className: 'bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg p-6' },
                    React.createElement('h3', { className: 'font-semibold mb-4 flex items-center gap-2' },
                        React.createElement(Zap, { className: 'w-5 h-5' }),
                        'Data Transformation Flow'
                    ),
                    React.createElement('div', { className: 'bg-white rounded-lg p-4 border border-gray-200' },
                        React.createElement('div', { className: 'space-y-3' },
                            React.createElement('div', { className: 'flex items-center gap-3' },
                                React.createElement('span', { className: 'text-sm font-medium text-blue-700 w-20' }, 'Input:'),
                                React.createElement('span', { className: 'text-sm text-gray-700 flex-1' }, phase.dataFlow.input)
                            ),
                            React.createElement('div', { className: 'flex items-center gap-3' },
                                React.createElement('span', { className: 'text-sm font-medium text-purple-700 w-20' }, 'Process:'),
                                React.createElement('span', { className: 'text-sm text-gray-700 flex-1' }, phase.dataFlow.internal)
                            ),
                            React.createElement('div', { className: 'flex items-center gap-3' },
                                React.createElement('span', { className: 'text-sm font-medium text-green-700 w-20' }, 'Output:'),
                                React.createElement('span', { className: 'text-sm text-gray-700 flex-1' }, phase.dataFlow.output)
                            )
                        )
                    )
                ),
                

                
                // NATO Annex C Requirements Compliance - Primary Organization
                annexCRequirements[phase.id] && React.createElement(RequirementsRenderer, {
                    phase: phase,
                    annexCRequirements: annexCRequirements,
                    aiCallChains: aiCallChains
                }),
                
                // Feedback Loops
                phase.feedbackLoops && phase.feedbackLoops.length > 0 &&
                React.createElement('div', { className: 'bg-orange-50 border border-orange-200 rounded-lg p-4' },
                    React.createElement('h3', { className: 'font-semibold mb-3 flex items-center gap-2 text-orange-800' },
                        React.createElement(RefreshCw, { className: 'w-4 h-4' }),
                        'Internal Feedback Loops'
                    ),
                    phase.feedbackLoops.map((loop, loopIndex) =>
                        React.createElement('div', { key: loopIndex, className: 'bg-white p-3 rounded border border-orange-200' },
                            React.createElement('div', { className: 'text-sm' },
                                React.createElement('span', { className: 'font-medium' }, loop.from),
                                React.createElement('span', { className: 'text-orange-600 mx-2' }, '↺'),
                                React.createElement('span', { className: 'font-medium' }, loop.to)
                            ),
                            loop.condition && React.createElement('p', { className: 'text-xs text-gray-600 mt-1' },
                                'Triggers when: ', loop.condition
                            )
                        )
                    )
                ),
                
                // Cross-Phase Links
                phase.crossPhaseLinks && phase.crossPhaseLinks.length > 0 &&
                React.createElement('div', { className: 'bg-purple-50 border border-purple-200 rounded-lg p-4' },
                    React.createElement('h3', { className: 'font-semibold mb-3 flex items-center gap-2 text-purple-800' },
                        React.createElement(Zap, { className: 'w-4 h-4' }),
                        'Cross-Phase Connections'
                    ),
                    phase.crossPhaseLinks.map((link, linkIndex) =>
                        React.createElement('div', { key: linkIndex, className: 'bg-white p-3 rounded border border-purple-200' },
                            React.createElement('div', { className: 'text-sm' },
                                React.createElement('span', { className: 'font-medium' }, 'Phase ', phase.id),
                                React.createElement('span', { className: 'text-purple-600 mx-2' }, '→'),
                                React.createElement('span', { className: 'font-medium' }, 'Phase ', link.to)
                            ),
                            React.createElement('p', { className: 'text-xs text-gray-600 mt-1' },
                                'When: ', link.condition, ' → Action: ', link.description
                            )
                        )
                    )
                ),
                
                // Detail Blocks for specific phases
                renderPhaseSpecificDetails(phase)
            )
        )
    );
};

// Helper function to render phase-specific detail blocks
window.renderPhaseSpecificDetails = function(phase) {
    const { DetailBlock, ExplainerBox } = window;
    const { Database, BarChart3, Hash, Code, FileCheck, TestTube, FileText } = window.lucideIcons;
    
    const elements = [];
    
    if (phase.id === 1) {
        // Performance Measures Catalog
        if (phase.performanceCatalog) {
            elements.push(
                React.createElement(DetailBlock, {
                    key: 'performance-catalog',
                    title: 'Performance Measures Catalog (KPI/MoE/MoP)',
                    icon: React.createElement(BarChart3, { className: 'w-4 h-4' }),
                    color: 'border-green-200'
                },
                    phase.performanceCatalog.explainer && React.createElement(ExplainerBox, null,
                        phase.performanceCatalog.explainer
                    ),
                    phase.performanceCatalog.typeExplainers && React.createElement('div', { className: 'mb-4 space-y-2' },
                        React.createElement('div', { className: 'p-2 bg-blue-50 rounded border border-blue-200' },
                            React.createElement('span', { className: 'font-medium text-blue-800' }, 'KPI:'),
                            ' ',
                            React.createElement('span', { className: 'text-sm text-blue-700' }, 
                                phase.performanceCatalog.typeExplainers.KPI
                            )
                        ),
                        React.createElement('div', { className: 'p-2 bg-green-50 rounded border border-green-200' },
                            React.createElement('span', { className: 'font-medium text-green-800' }, 'MoE:'),
                            ' ',
                            React.createElement('span', { className: 'text-sm text-green-700' }, 
                                phase.performanceCatalog.typeExplainers.MoE
                            )
                        ),
                        React.createElement('div', { className: 'p-2 bg-purple-50 rounded border border-purple-200' },
                            React.createElement('span', { className: 'font-medium text-purple-800' }, 'MoP:'),
                            ' ',
                            React.createElement('span', { className: 'text-sm text-purple-700' }, 
                                phase.performanceCatalog.typeExplainers.MoP
                            )
                        )
                    ),
                    React.createElement('div', { className: 'overflow-x-auto' },
                        React.createElement('table', { className: 'w-full text-sm' },
                            React.createElement('thead', null,
                                React.createElement('tr', { className: 'border-b border-gray-200' },
                                    React.createElement('th', { className: 'text-left py-2 px-3 font-medium' }, 'ID'),
                                    React.createElement('th', { className: 'text-left py-2 px-3 font-medium' }, 'Type'),
                                    React.createElement('th', { className: 'text-left py-2 px-3 font-medium' }, 'Name'),
                                    React.createElement('th', { className: 'text-left py-2 px-3 font-medium' }, 'Unit'),
                                    React.createElement('th', { className: 'text-left py-2 px-3 font-medium' }, 'Threshold'),
                                    React.createElement('th', { className: 'text-left py-2 px-3 font-medium' }, 'Description')
                                )
                            ),
                            React.createElement('tbody', null,
                                (phase.performanceCatalog.data || phase.performanceCatalog).map((metric, idx) =>
                                    React.createElement('tr', { key: idx, className: 'border-b border-gray-100 hover:bg-gray-50' },
                                        React.createElement('td', { className: 'py-2 px-3 font-mono text-xs' }, metric.id),
                                        React.createElement('td', { className: 'py-2 px-3' },
                                            React.createElement('span', { 
                                                className: `px-2 py-0.5 rounded text-xs font-medium ${
                                                    metric.type === 'KPI' ? 'bg-blue-100 text-blue-800' :
                                                    metric.type === 'MoE' ? 'bg-green-100 text-green-800' :
                                                    'bg-purple-100 text-purple-800'
                                                }`
                                            }, metric.type)
                                        ),
                                        React.createElement('td', { className: 'py-2 px-3 font-medium' }, metric.name),
                                        React.createElement('td', { className: 'py-2 px-3 text-gray-600' }, metric.unit),
                                        React.createElement('td', { className: 'py-2 px-3' }, String(metric.threshold)),
                                        React.createElement('td', { className: 'py-2 px-3 text-gray-600' }, metric.description)
                                    )
                                )
                            )
                        )
                    )
                )
            );
        }
        
        // NLP Models
        if (phase.nlpModels) {
            elements.push(
                React.createElement(DetailBlock, {
                    key: 'nlp-models',
                    title: 'NLP Models',
                    icon: React.createElement(Database, { className: 'w-4 h-4' }),
                    color: 'border-blue-200'
                },
                    phase.nlpModels.explainer && React.createElement(ExplainerBox, null,
                        phase.nlpModels.explainer
                    ),
                    React.createElement('div', { className: 'space-y-3' },
                        (phase.nlpModels.data || phase.nlpModels).map((model, idx) =>
                            React.createElement('div', { key: idx, className: 'p-3 bg-gray-50 rounded border' },
                                React.createElement('div', { className: 'flex items-center gap-2 mb-1' },
                                    React.createElement('code', { className: 'text-sm font-medium' }, model.name),
                                    React.createElement('span', { className: 'text-xs bg-blue-100 px-2 py-0.5 rounded' }, 
                                        'v', model.version
                                    )
                                ),
                                React.createElement('p', { className: 'text-sm text-gray-600' }, model.purpose)
                            )
                        )
                    )
                )
            );
        }
        
        // Ontology Map
        if (phase.ontologyMap) {
            elements.push(
                React.createElement(DetailBlock, {
                    key: 'ontology-map',
                    title: 'Ontology Mapping',
                    icon: React.createElement(Hash, { className: 'w-4 h-4' }),
                    color: 'border-purple-200'
                },
                    phase.ontologyMap.explainer && React.createElement(ExplainerBox, null,
                        phase.ontologyMap.explainer
                    ),
                    React.createElement('div', { className: 'space-y-2' },
                        (phase.ontologyMap.data || phase.ontologyMap).map((mapping, idx) =>
                            React.createElement('div', { key: idx, className: 'flex items-center justify-between p-2 bg-gray-50 rounded' },
                                React.createElement('div', { className: 'flex items-center gap-3' },
                                    React.createElement('code', { className: 'text-sm bg-white px-2 py-1 rounded border' }, 
                                        '"', mapping.raw, '"'
                                    ),
                                    React.createElement('span', { className: 'text-gray-400' }, '→'),
                                    React.createElement('code', { className: 'text-sm bg-purple-100 px-2 py-1 rounded' }, 
                                        mapping.natoId
                                    )
                                ),
                                React.createElement('span', { className: 'text-xs text-green-600 font-medium' }, 
                                    (mapping.confidence * 100).toFixed(0), '%'
                                )
                            )
                        )
                    )
                )
            );
        }
    }
    
    if (phase.id === 6) {
        // NATO Force Structure
        elements.push(
            React.createElement(DetailBlock, {
                key: 'nato-forces',
                title: 'NATO Force Designations',
                icon: React.createElement(Hash, { className: 'w-4 h-4' }),
                color: 'border-teal-200'
            },
                React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
                    React.createElement('div', { className: 'p-4 bg-blue-50 rounded-lg border border-blue-200' },
                        React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                            React.createElement('div', { className: 'w-4 h-4 bg-blue-600 rounded' }),
                            React.createElement('span', { className: 'font-medium text-blue-900' }, 'Blue Forces')
                        ),
                        React.createElement('p', { className: 'text-sm text-blue-800' }, 
                            'Friendly/Allied forces under NATO command or coalition partners. Includes own troops, equipment, and supporting elements.'
                        ),
                        React.createElement('div', { className: 'mt-2 text-xs text-blue-700' },
                            React.createElement('strong', null, 'Examples:'),
                            ' NATO units, coalition partners, host nation forces'
                        )
                    ),
                    
                    React.createElement('div', { className: 'p-4 bg-red-50 rounded-lg border border-red-200' },
                        React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                            React.createElement('div', { className: 'w-4 h-4 bg-red-600 rounded' }),
                            React.createElement('span', { className: 'font-medium text-red-900' }, 'Red Forces')
                        ),
                        React.createElement('p', { className: 'text-sm text-red-800' }, 
                            'Hostile/Enemy forces opposing NATO objectives. Includes opposing military units, irregular forces, and supporting infrastructure.'
                        ),
                        React.createElement('div', { className: 'mt-2 text-xs text-red-700' },
                            React.createElement('strong', null, 'Examples:'),
                            ' Enemy military, insurgents, opposing air defense'
                        )
                    ),
                    
                    React.createElement('div', { className: 'p-4 bg-green-50 rounded-lg border border-green-200' },
                        React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                            React.createElement('div', { className: 'w-4 h-4 bg-green-600 rounded' }),
                            React.createElement('span', { className: 'font-medium text-green-900' }, 'Green/White Forces')
                        ),
                        React.createElement('p', { className: 'text-sm text-green-800' }, 
                            'Neutral, civilian, or unknown forces. Includes non-combatants, third-party actors, and entities of uncertain allegiance.'
                        ),
                        React.createElement('div', { className: 'mt-2 text-xs text-green-700' },
                            React.createElement('strong', null, 'Examples:'),
                            ' Civilians, UN peacekeepers, NGOs, unknown entities'
                        )
                    )
                ),
                
                React.createElement('div', { className: 'mt-4 p-3 bg-gray-50 rounded border' },
                    React.createElement('p', { className: 'text-sm text-gray-700' },
                        React.createElement('strong', null, 'NATO Standard:'),
                        ' This color-coding system (per NATO doctrine) ensures clear force identification in multi-domain operations and reduces fratricide risk during complex scenarios.'
                    )
                )
            )
        );
    }
    
    if (phase.id === 4) {
        // Template ID
        if (phase.templateId) {
            elements.push(
                React.createElement(DetailBlock, {
                    key: 'template-id',
                    title: 'Code Template',
                    icon: React.createElement(Code, { className: 'w-4 h-4' }),
                    color: 'border-red-200'
                },
                    React.createElement('div', { className: 'p-3 bg-gray-50 rounded border' },
                        React.createElement('code', { className: 'text-sm font-medium' }, phase.templateId),
                        React.createElement('p', { className: 'text-xs text-gray-600 mt-1' }, 
                            'Git commit reference for simulation template'
                        )
                    )
                )
            );
        }
        
        // Generated Files
        if (phase.generatedFiles) {
            elements.push(
                React.createElement(DetailBlock, {
                    key: 'generated-files',
                    title: 'Generated Files',
                    icon: React.createElement(FileCheck, { className: 'w-4 h-4' }),
                    color: 'border-green-200'
                },
                    React.createElement('div', { className: 'space-y-2' },
                        phase.generatedFiles.map((file, idx) =>
                            React.createElement('div', { key: idx, className: 'p-3 bg-gray-50 rounded border' },
                                React.createElement('div', { className: 'flex items-center justify-between mb-1' },
                                    React.createElement('code', { className: 'text-sm font-medium' }, file.file),
                                    React.createElement('span', { className: 'text-xs text-gray-500' }, file.size)
                                ),
                                React.createElement('p', { className: 'text-xs text-gray-600 mb-2' }, file.purpose),
                                React.createElement('code', { className: 'text-xs text-gray-400 font-mono' }, 
                                    'SHA256: ', file.sha256.substring(0, 16), '...'
                                )
                            )
                        )
                    )
                )
            );
        }
        
        // Build Logs
        if (phase.buildLogs) {
            elements.push(
                React.createElement(DetailBlock, {
                    key: 'build-logs',
                    title: 'Build Logs',
                    icon: React.createElement(TestTube, { className: 'w-4 h-4' }),
                    color: 'border-yellow-200'
                },
                    React.createElement('div', { className: 'bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto' },
                        React.createElement('pre', null, phase.buildLogs)
                    )
                )
            );
        }
        
        // License Scan
        if (phase.licenseScan) {
            elements.push(
                React.createElement(DetailBlock, {
                    key: 'license-scan',
                    title: 'License Compliance',
                    icon: React.createElement(FileText, { className: 'w-4 h-4' }),
                    color: 'border-blue-200'
                },
                    React.createElement('div', { className: 'p-3 bg-gray-50 rounded border' },
                        React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                            React.createElement('span', { 
                                className: `w-3 h-3 rounded-full ${
                                    phase.licenseScan.compliant ? 'bg-green-500' : 'bg-red-500'
                                }`
                            }),
                            React.createElement('span', { className: 'font-medium' },
                                phase.licenseScan.compliant ? 'Compliant' : 'Issues Found'
                            )
                        ),
                        React.createElement('p', { className: 'text-sm text-gray-600' }, phase.licenseScan.summary)
                    )
                )
            );
        }
    }
    
    return React.createElement(React.Fragment, null, elements);
};
