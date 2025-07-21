// AI Call-Chain Map data structure for NATO M&S Workflow

window.aiCallChains = {
    0: [
        { step: '0-A', prompt: 'Heuristic script (no LLM)', input: 'raw file', output: 'raw_buffer.txt', purpose: 'Verify size ≤ 50 MB, encoding UTF-8/16', type: 'script' },
        { step: '0-B', prompt: '"Detect format" prompt', input: 'raw_buffer.txt', output: 'format.json (keys: is_json, is_plain)', purpose: 'Decide whether to wrap', type: 'llm' },
        { step: '0-C', prompt: '"Wrap to JSON" prompt (only if plain)', input: 'raw_buffer.txt', output: 'scenario_draft.json', purpose: 'Build minimal JSON shell', type: 'llm' },
        { step: '0-D', prompt: 'Schema-fill prompt', input: 'previous JSON', output: 'scenario.json', purpose: 'Add missing required keys with null placeholders', type: 'llm' }
    ],
    1: [
        { step: '1-A', prompt: 'File format detection and validation', input: 'nato_scenario.json (raw)', output: 'file_status.json', purpose: 'Validate file integrity and detect format type', type: 'script' },
        { step: '1-B', prompt: 'Document parsing (PDF/Word/JSON extraction)', input: 'validated file', output: 'raw_text.txt', purpose: 'Extract readable content from any format', type: 'script' },
        { step: '1-C', prompt: 'Document structure analysis', input: 'raw_text.txt', output: 'document_structure.json', purpose: 'Identify sections and organize content', type: 'llm' },
        { step: '1-D', prompt: 'Extract simulation objectives (Annex C 1.1)', input: 'document_structure.json', output: 'objectives.json', purpose: 'Identify specific simulation objectives', type: 'llm' },
        { step: '1-E', prompt: 'Extract requirements and constraints (Annex C 1.2)', input: 'same', output: 'requirements_constraints.json', purpose: 'Define key requirements and operational constraints', type: 'llm' },
        { step: '1-F', prompt: 'Identify stakeholders and roles (Annex C 1.2)', input: 'same', output: 'stakeholders.json', purpose: 'Map stakeholder relationships and responsibilities', type: 'llm' },
        { step: '1-G', prompt: 'Establish performance measures (Annex C 1.3): classify KPI/MoE/MoP', input: 'objectives + requirements', output: 'performance_measures.json', purpose: 'Categorize all NATO performance measure types', type: 'llm' },
        { step: '1-H', prompt: 'Entity extraction and NATO ontology mapping', input: 'all content', output: 'entities_mapped.json', purpose: 'Standardize military entities to NATO IDs', type: 'llm' },
        { step: '1-I', prompt: 'Integration validation and confidence assessment', input: 'all outputs', output: 'validation_report.json', purpose: 'Ensure completeness of problem definition', type: 'llm' },
        { step: '1-J', prompt: 'Final requirements compilation', input: 'all validated components', output: 'requirements.json', purpose: 'Complete Annex C Phase 1 deliverable', type: 'script' }
    ],
    2: [
        { step: '2-A', prompt: 'Generate entity class stubs w/ attributes', input: 'entities.json', output: 'entity_classes.json', purpose: 'Name, properties, default state', type: 'llm' },
        { step: '2-B', prompt: 'Draft interaction matrix (who can shoot / move / detect whom)', input: 'entity_classes.json', output: 'interaction_matrix.csv', purpose: 'Pure relations', type: 'llm' },
        { step: '2-C', prompt: 'Insert spatial & temporal scope', input: 'objectives + constraints', output: 'scope.json', purpose: 'BBOX, time window', type: 'llm' },
        { step: '2-D', prompt: 'List simplifying assumptions → numbered list', input: 'narrative', output: 'assumptions.md', purpose: 'Textual', type: 'llm' },
        { step: '2-E', prompt: 'Graph-validator script', input: 'all above', output: 'consistency_report.txt', purpose: 'Loops, orphans', type: 'script' },
        { step: '2-F', prompt: 'Merge', input: '·', output: 'concept_model.json', purpose: 'Unified model', type: 'script' }
    ],
    3: [
        { step: '3-A', prompt: 'Heuristic rule script', input: 'concept_model.json', output: 'initial_approach.txt', purpose: 'IF entity-count > 500 THEN suggest agent-based; ELSE discrete-event', type: 'script' },
        { step: '3-B', prompt: '"Classify best simulation style" LLM', input: 'same', output: 'ml_vote.txt', purpose: 'ML-enhanced approach selection', type: 'llm' },
        { step: '3-C', prompt: 'Generate data schema YAML for each entity', input: 'same', output: 'schema.yaml', purpose: 'Entity data structures', type: 'llm' },
        { step: '3-D', prompt: 'Seed parameters table (speed, sensorRange)', input: 'doctrine CSV + entities', output: 'param_seed.csv', purpose: 'Default parameter values', type: 'llm' },
        { step: '3-E', prompt: 'Risk/complexity rating 0-1 + resource estimate', input: 'concept', output: 'design_rationale.txt', purpose: 'Complexity assessment', type: 'llm' },
        { step: '3-F', prompt: 'Merge', input: 'all', output: 'design_spec.json', purpose: 'Final design specification', type: 'script' }
    ],
    4: [
        { step: '4-A', prompt: 'Template loader script', input: 'design_spec.json', output: 'template.zip', purpose: 'Load appropriate code template', type: 'script' },
        { step: '4-B', prompt: '"Fill Jinja placeholders" code-LLM', input: 'template + param seeds', output: 'model.py', purpose: 'Generate actual simulation code', type: 'llm' },
        { step: '4-C', prompt: 'Draft pytest unit tests for every public method', input: 'model.py', output: 'tests_unit.py', purpose: 'Automated test generation', type: 'llm' },
        { step: '4-D', prompt: 'Dependency scanner (script)', input: 'model.py', output: 'requirements.txt', purpose: 'Extract Python dependencies', type: 'script' },
        { step: '4-E', prompt: 'Build runner (shell)', input: 'all files', output: 'build_report.json (pass/fail)', purpose: 'Compile and test code', type: 'script' },
        { step: '4-F', prompt: '"If fail, propose patch diff" LLM → re-inject once', input: 'fail log', output: 'patch.diff / retry', purpose: 'One-shot error recovery', type: 'llm' },
        { step: '4-G', prompt: 'Manifest writer', input: 'dir hash', output: 'sim_build/', purpose: 'Package final code', type: 'script' }
    ],
    5: [
        { step: '5-A', prompt: 'pytest run', input: 'sim_build/', output: 'unit_results.json', purpose: 'Execute all unit tests', type: 'script' },
        { step: '5-B', prompt: 'Smoke run driver', input: 'same', output: 'smoke_metrics.csv', purpose: 'Quick runtime validation', type: 'script' },
        { step: '5-C', prompt: 'Compare metrics to doctrine ranges; output 0–1 score & rationale', input: 'smoke_metrics.csv + baseline', output: 'stat_fit.json', purpose: 'Statistical validation', type: 'llm' },
        { step: '5-D', prompt: 'Plausibility Q/A LLM ("Any negative casualties?")', input: 'logs', output: 'face_validity.txt', purpose: 'Reality check validation', type: 'llm' },
        { step: '5-E', prompt: 'Aggregator script', input: 'all', output: 'vv_report.json', purpose: 'Combine all V&V results', type: 'script' }
    ],
    6: [
        { step: '6-A', prompt: 'NATO Doctrine Parser - Extract Blue/Red/Green force doctrine', input: 'doctrine_db + requirements.json', output: 'force_doctrine.json', purpose: 'NATO-compliant force structures per Annex C 6.1', type: 'llm' },
        { step: '6-B', prompt: 'Force Structure Generator per NATO doctrine', input: 'force_doctrine.json', output: 'nato_scenario.json', purpose: 'Blue/Red/Green force layout compliance', type: 'llm' },
        { step: '6-C', prompt: 'DoE planner script', input: 'nato_scenario.json', output: 'experiment_matrix.csv', purpose: 'Design of experiments', type: 'script' },
        { step: '6-D', prompt: 'Parallel runner', input: 'matrix + sim', output: 'runs_raw/ (×N CSVs)', purpose: 'Execute multiple simulation runs', type: 'script' },
        { step: '6-E', prompt: 'KPI extractor script', input: 'raw runs', output: 'runs.csv', purpose: 'Extract metrics from runs', type: 'script' },
        { step: '6-F', prompt: 'Explain parameter importance using SHAP; produce markdown bullets', input: 'runs.csv', output: 'importance.md', purpose: 'ML-driven analysis', type: 'llm' },
        { step: '6-G', prompt: 'Chart renderer', input: 'runs.csv', output: 'charts/*.png', purpose: 'Generate visualizations', type: 'script' },
        { step: '6-H', prompt: 'Summarise top 5 insights', input: 'importance + charts', output: 'analysis_report.json', purpose: 'Executive summary', type: 'llm' }
    ],
    7: [
        { step: '7-A', prompt: 'Baseline compare script', input: 'new runs.csv vs baseline', output: 'z_scores.csv', purpose: 'Compare against historical', type: 'script' },
        { step: '7-B', prompt: 'Drift detector (SciPy)', input: 'z-scores', output: 'drift_flags.json', purpose: 'Statistical drift detection', type: 'script' },
        { step: '7-C', prompt: 'Recommend retune / redesign / rebuild; justify in 2 sentences', input: 'drift flags', output: 'action_rec.txt', purpose: 'Action recommendation', type: 'llm' },
        { step: '7-D', prompt: 'If "retune", "Generate patched param_seed.csv"', input: 'drift flags', output: 'updated_design_spec.json', purpose: 'Parameter updates', type: 'llm' },
        { step: '7-E', prompt: 'Pack', input: 'all', output: 'maintenance_actions.json', purpose: 'Final recommendations', type: 'script' }
    ]
};
