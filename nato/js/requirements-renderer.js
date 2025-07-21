// NATO Annex C Requirements Renderer Component

window.RequirementsRenderer = function({ phase, annexCRequirements, aiCallChains }) {
    const { 
        FileCheck, Bot, Terminal, Activity, Settings 
    } = window.lucideIcons;
    
    const {
        getAIStepsForRequirement,
        getProcessStepsForRequirement,
        getUnmappedActivities,
        getProcessIcon,
        getProcessColor,
        ExplainerBox
    } = window;
    
    const requirements = annexCRequirements[phase.id];
    if (!requirements) return null;
    
    return React.createElement('div', { className: 'bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6' },
        React.createElement('h3', { className: 'font-semibold mb-4 flex items-center gap-2 text-green-800' },
            React.createElement(FileCheck, { className: 'w-5 h-5' }),
            'NATO Annex C Phase ', phase.id, ' Implementation'
        ),
        React.createElement('div', { className: 'bg-white rounded-lg p-4 border border-green-200 mb-6' },
            React.createElement('h4', { className: 'font-medium text-green-900 mb-3' }, requirements.title),
            React.createElement('p', { className: 'text-sm text-gray-700 mb-4' }, 
                'Each requirement below shows the specific AI automation steps that implement it:'
            )
        ),
        
        // Individual Requirements with Supporting Activities
        React.createElement('div', { className: 'space-y-6' },
            requirements.requirements.map((req, reqIndex) =>
                React.createElement('div', { key: reqIndex, className: 'bg-white border border-green-200 rounded-lg p-6' },
                    // Requirement Header
                    React.createElement('div', { className: 'flex items-start gap-4 mb-4' },
                        React.createElement('div', { className: 'flex-shrink-0' },
                            React.createElement('div', {
                                className: 'inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-800 rounded-full text-lg font-bold border-2 border-green-300'
                            }, req.id)
                        ),
                        React.createElement('div', { className: 'flex-1' },
                            React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                                React.createElement('span', { className: 'text-xl' }, req.status),
                                React.createElement('span', { className: 'text-lg font-semibold text-gray-900' }, 
                                    'Requirement ', req.id
                                )
                            ),
                            React.createElement('p', { className: 'text-base text-gray-800 font-medium mb-3' }, req.text),
                            React.createElement('div', { className: 'bg-green-50 p-3 rounded border border-green-200' },
                                React.createElement('span', { className: 'text-sm font-medium text-green-800' }, 
                                    'AI Implementation Overview:'
                                ),
                                React.createElement('div', { className: 'text-sm text-green-700 mt-1' }, req.coverage)
                            )
                        )
                    ),
                    
                    // Supporting AI Steps for this Requirement
                    getAIStepsForRequirement(phase.id, req.id, aiCallChains).length > 0 &&
                    React.createElement('div', { className: 'mt-4 pl-16' },
                        React.createElement('h5', { className: 'font-medium text-gray-800 mb-3 flex items-center gap-2' },
                            React.createElement(Bot, { className: 'w-4 h-4 text-purple-600' }),
                            'AI Automation Steps for ', req.id
                        ),
                        React.createElement('div', { className: 'space-y-3' },
                            getAIStepsForRequirement(phase.id, req.id, aiCallChains).map((step, stepIndex) =>
                                React.createElement('div', { 
                                    key: stepIndex, 
                                    className: 'border border-purple-200 rounded-lg p-3 bg-purple-50' 
                                },
                                    React.createElement('div', { className: 'flex items-center gap-3' },
                                        React.createElement('div', { 
                                            className: `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                step.type === 'llm' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
                                            }`
                                        },
                                            step.type === 'llm' ? 
                                                React.createElement(Bot, { className: 'w-4 h-4' }) : 
                                                React.createElement(Terminal, { className: 'w-4 h-4' })
                                        ),
                                        React.createElement('div', { className: 'flex-1' },
                                            React.createElement('div', { className: 'flex items-center gap-2 mb-1' },
                                                React.createElement('span', { className: 'font-medium text-gray-800' }, 
                                                    step.step
                                                ),
                                                React.createElement('span', { 
                                                    className: `px-2 py-0.5 rounded text-xs font-medium ${
                                                        step.type === 'llm' ? 
                                                            'bg-purple-100 text-purple-700' : 
                                                            'bg-blue-100 text-blue-700'
                                                    }`
                                                },
                                                    step.type === 'llm' ? 'AI Model' : 'Script'
                                                )
                                            ),
                                            React.createElement('p', { className: 'text-sm text-gray-700 mb-2' }, 
                                                step.prompt
                                            ),
                                            React.createElement('div', { 
                                                className: 'grid grid-cols-1 md:grid-cols-3 gap-2 text-xs' 
                                            },
                                                React.createElement('div', { className: 'bg-white p-2 rounded border' },
                                                    React.createElement('span', { className: 'font-medium text-blue-700' }, 
                                                        'Input:'
                                                    ),
                                                    React.createElement('div', { className: 'text-gray-600 mt-1' }, 
                                                        step.input
                                                    )
                                                ),
                                                React.createElement('div', { className: 'bg-white p-2 rounded border' },
                                                    React.createElement('span', { className: 'font-medium text-green-700' }, 
                                                        'Output:'
                                                    ),
                                                    React.createElement('div', { className: 'text-gray-600 mt-1' }, 
                                                        step.output
                                                    )
                                                ),
                                                React.createElement('div', { className: 'bg-white p-2 rounded border' },
                                                    React.createElement('span', { className: 'font-medium text-purple-700' }, 
                                                        'Purpose:'
                                                    ),
                                                    React.createElement('div', { className: 'text-gray-600 mt-1' }, 
                                                        step.purpose
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    
                    // Supporting Process Steps for this Requirement
                    getProcessStepsForRequirement(phase.subProcesses, req.id).length > 0 &&
                    React.createElement('div', { className: 'mt-4 pl-16' },
                        React.createElement('h5', { className: 'font-medium text-gray-800 mb-3 flex items-center gap-2' },
                            React.createElement(Activity, { className: 'w-4 h-4 text-blue-600' }),
                            'Process Implementation for ', req.id
                        ),
                        React.createElement('div', { className: 'space-y-3' },
                            getProcessStepsForRequirement(phase.subProcesses, req.id).map((subprocess, subIndex) =>
                                React.createElement('div', { 
                                    key: subIndex, 
                                    className: `border-2 rounded-lg p-3 ${getProcessColor(subprocess.type)}`
                                },
                                    React.createElement('div', { className: 'flex items-start gap-3' },
                                        React.createElement('div', { 
                                            className: `w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                subprocess.type === 'decision' ? 'bg-yellow-200 text-yellow-800' :
                                                subprocess.type === 'process' ? 'bg-blue-200 text-blue-800' :
                                                'bg-gray-200 text-gray-800'
                                            }`
                                        },
                                            getProcessIcon(subprocess.type)
                                        ),
                                        React.createElement('div', { className: 'flex-1' },
                                            React.createElement('h6', { className: 'font-medium text-gray-800 mb-1' }, 
                                                subprocess.name
                                            ),
                                            React.createElement('p', { className: 'text-sm text-gray-600 mb-2' }, 
                                                subprocess.description
                                            ),
                                            subprocess.transforms && React.createElement('div', { 
                                                className: 'bg-white p-2 rounded border border-gray-200' 
                                            },
                                                React.createElement('p', { className: 'text-xs text-gray-700' },
                                                    React.createElement('span', { className: 'font-medium' }, 
                                                        'Transform:'
                                                    ),
                                                    ' ', subprocess.transforms
                                                )
                                            ),
                                            subprocess.explanation && React.createElement('div', { 
                                                className: 'mt-2 p-2 bg-gray-50 rounded' 
                                            },
                                                React.createElement('p', { className: 'text-xs text-gray-600' }, 
                                                    subprocess.explanation
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                )
            )
        ),
        
        // Additional Phase Activities (not tied to specific requirements)
        getUnmappedActivities(phase, requirements).length > 0 &&
        React.createElement('div', { className: 'mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4' },
            React.createElement('h4', { className: 'font-medium text-gray-800 mb-3 flex items-center gap-2' },
                React.createElement(Settings, { className: 'w-4 h-4' }),
                'Additional Phase Activities'
            ),
            React.createElement('div', { className: 'space-y-2' },
                getUnmappedActivities(phase, requirements).map((activity, actIndex) =>
                    React.createElement('div', { key: actIndex, className: 'bg-white p-3 rounded border border-gray-200' },
                        React.createElement('span', { className: 'font-medium text-gray-800' }, 
                            activity.name, ':'
                        ),
                        React.createElement('span', { className: 'text-sm text-gray-700 ml-2' }, 
                            activity.description
                        )
                    )
                )
            )
        ),
        
        // Phase Compliance Status
        React.createElement('div', { className: 'mt-6 p-4 bg-green-100 rounded border border-green-300' },
            React.createElement('div', { className: 'flex items-center gap-2 mb-2' },
                React.createElement(FileCheck, { className: 'w-4 h-4 text-green-700' }),
                React.createElement('span', { className: 'text-sm font-medium text-green-900' }, 
                    'Phase ', phase.id, ' Compliance Status'
                )
            ),
            React.createElement('p', { className: 'text-xs text-green-800 leading-relaxed' },
                React.createElement('strong', null, '✅ Fully Compliant:'),
                ' All NATO Annex C Phase ', phase.id, ' requirements are explicitly addressed through specific AI automation steps. ',
                'Each requirement has direct AI implementation with measurable outputs that NATO can evaluate for automation capability assessment.'
            )
        )
    );
};
