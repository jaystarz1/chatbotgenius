// Phases data for NATO M&S Workflow
// Extracted from InteractiveWorkflow.jsx

window.phases = [
    {
      id: 0,
      name: "Scenario Handoff (NATO Input Reception)",
      cli: "scenario_handoff",
      primaryInput: {
        file: "nato_input.{any}",
        description: "Raw scenario file from HQ SACT (provided 1 October 2025) - any format"
      },
      primaryOutput: {
        file: "nato_scenario.json",
        description: "Raw scenario passed through for Phase 1 processing"
      },
      color: "bg-gray-400",
      description: "Simple handoff point - receive NATO scenario and pass to Phase 1",
      rfpContext: "Receives the HQ SACT problem domain and statement per RFP Phase 2 (1 October 2025) and passes it directly to Phase 1 for complete processing",
      annexCNote: "Not part of NATO Annex C - this is simply the handoff point where NATO provides the scenario. All actual processing begins with Annex C Phase 1.",
      phaseExplanation: "This is simply the moment when NATO hands over the scenario file. No processing occurs here - just receiving the input and making it available to Phase 1. All validation, parsing, and analysis happens in Phase 1 per Annex C requirements.",
      subProcesses: [
        { 
          name: "Receive File", 
          type: "process",
          description: "Accept scenario file from HQ SACT in any format (PDF, Word, JSON, etc.)",
          transforms: "NATO input → Raw file available for processing",
          explanation: "Simply receives whatever format NATO provides - could be a PDF document, Word file, structured JSON, or any other format. No validation or processing occurs."
        },
        { 
          name: "Stage for Processing", 
          type: "process",
          description: "Make file available to Phase 1 without modification",
          transforms: "Raw file → Staged input for Phase 1",
          explanation: "Places the raw NATO input in a location where Phase 1 can access it. No changes to content, format, or structure - just staging for the actual M&S lifecycle to begin."
        }
      ],
      dataFlow: {
        input: "Any format scenario from NATO",
        internal: "File receipt → Staging for Phase 1",
        output: "Raw scenario ready for Annex C Phase 1 processing"
      },
      // Detail-anchor metadata keys
      sourceMeta: null,
      schemaRef: null,
      sizeLimits: null
    },
    {
      id: 1,
      name: "Problem Definition & Requirements Analysis",
      cli: "p1_requirements",
      primaryInput: {
        file: "nato_scenario.json",
        description: "Raw NATO scenario from Phase 0 handoff"
      },
      primaryOutput: {
        file: "requirements.json",
        description: "Complete problem definition with objectives, constraints, stakeholders, and NATO performance measures (KPI/MoE/MoP)"
      },
      color: "bg-green-500",
      description: "AI automation of Annex C Phase 1: complete problem definition including file processing, objectives identification, and performance measures",
      phaseExplanation: "This phase implements the complete NATO Annex C Phase 1 through AI automation. It starts by processing the raw NATO input (validation, parsing, format conversion), then extracts simulation objectives, defines key requirements and constraints, identifies stakeholders, and establishes NATO-standard performance measures (KPIs, MoEs, MoPs). This demonstrates AI's capability to handle the full problem definition process from raw input to structured requirements.",
      subProcesses: [
        { 
          name: "File Validation & Format Processing", 
          type: "process",
          description: "Check file integrity, detect format (PDF/Word/JSON), convert to processable text",
          transforms: "Raw NATO file → Validated, parsed text content",
          explanation: "Validates the NATO input file, handles any format (PDF, Word, JSON, etc.), and extracts the textual content for analysis. This is the first step in problem definition - you can't analyze requirements without first accessing the content."
        },
        { 
          name: "Document Structure Analysis", 
          type: "process",
          description: "Parse document structure, identify sections (situation, mission, execution, etc.)",
          transforms: "Text content → Structured document sections",
          explanation: "Analyzes the document structure to identify key sections like situation description, mission statement, execution details, etc. This helps the AI understand the context and organization of the scenario information."
        },
        { 
          name: "Objectives Identification (Task 1.1)", 
          type: "process",
          description: "NLP extraction of simulation objectives from mission statements and commander's intent",
          transforms: "Document sections → Structured objectives list",
          explanation: "Uses natural language processing to identify and extract the specific objectives that the simulation needs to address, directly implementing Annex C Task 1.1."
        },
        { 
          name: "Requirements & Constraints Analysis (Task 1.2)", 
          type: "process",
          description: "Extract key requirements, operational constraints, stakeholder roles, and environmental factors",
          transforms: "Document content → Requirements matrix with constraints",
          explanation: "Identifies all the requirements, limitations, and constraints that will shape the simulation, plus stakeholder roles and responsibilities. This implements Annex C Task 1.2."
        },
        { 
          name: "Performance Measures Establishment (Task 1.3)", 
          type: "process",
          description: "Extract and classify KPIs (operational metrics), MoEs (mission effectiveness), MoPs (system performance)",
          transforms: "Requirements → Categorized NATO performance measures",
          explanation: "Identifies and properly categorizes all performance measures according to NATO standards: KPIs for operational tracking, MoEs for mission effectiveness assessment, and MoPs for system performance evaluation. This implements Annex C Task 1.3."
        },
        { 
          name: "Entity & Stakeholder Mapping", 
          type: "process",
          description: "Map identified entities to NATO ontology IDs and establish stakeholder relationships",
          transforms: "Raw entities → Standardized NATO IDs with relationships",
          explanation: "Converts informal references into standardized military terminology and establishes clear stakeholder relationships that will inform the simulation design."
        },
        { 
          name: "Requirements Integration & Validation", 
          type: "decision",
          description: "Validate completeness of problem definition, check for contradictions, assess confidence",
          transforms: "All analysis components → Validated requirements package",
          explanation: "Ensures all Annex C Phase 1 tasks are complete, checks for internal consistency, and provides confidence assessment for the overall problem definition."
        }
      ],
      feedbackLoops: [
        { from: "Requirements Integration & Validation", to: "Objectives Identification", condition: "missing critical objectives" },
        { from: "Requirements Integration & Validation", to: "Performance Measures Establishment", condition: "insufficient KPI/MoE/MoP coverage" }
      ],
      dataFlow: {
        input: "Raw NATO scenario file (any format)",
        internal: "File processing → Document analysis → Objectives extraction → Requirements analysis → Performance measures → Entity mapping → Integration validation",
        output: "Complete problem definition with all Annex C Phase 1 deliverables"
      },
      // Detail-anchor metadata keys with explainers
      nlpModels: {
        data: [
          { name: "spacy-en-core-web-lg", version: "3.7.2", purpose: "NER and sentence parsing" },
          { name: "military-bert-base", version: "1.2.0", purpose: "Military terminology classification" }
        ],
        explainer: "These are the specific AI language models that read and understand military documents. Think of them as specialized translators that can read NATO documents and extract the important requirements, constraints, and stakeholder information automatically instead of requiring humans to manually parse through lengthy texts."
      },
      ontologyMap: {
        data: [
          { raw: "blue forces", natoId: "FRIENDLY_FORCE", confidence: 0.95 },
          { raw: "red team", natoId: "HOSTILE_FORCE", confidence: 0.87 },
          { raw: "objective alpha", natoId: "PRIMARY_OBJECTIVE", confidence: 0.92 }
        ],
        explainer: "This shows how the AI translates informal military language into official NATO terminology. For example, when someone writes 'blue forces' in a document, the AI recognizes this means 'FRIENDLY_FORCE' in NATO's standardized system. This ensures everyone speaks the same official military language regardless of how scenarios are originally written."
      },
      performanceCatalog: {
        data: [
          { id: "KPI-01", type: "KPI", name: "TimeToSecure", unit: "minutes", threshold: 60, description: "Time to secure primary objective" },
          { id: "KPI-02", type: "KPI", name: "ResourceConsumption", unit: "percentage", threshold: 80, description: "Logistics resource utilization" },
          { id: "MoE-01", type: "MoE", name: "MissionSuccess", unit: "boolean", threshold: true, description: "Overall mission completion effectiveness" },
          { id: "MoE-02", type: "MoE", name: "CasualtyRate", unit: "percentage", threshold: 5, description: "Blue force attrition effectiveness measure" },
          { id: "MoE-03", type: "MoE", name: "TerrainControl", unit: "percentage", threshold: 75, description: "Percentage of key terrain under friendly control" },
          { id: "MoP-01", type: "MoP", name: "SystemReliability", unit: "percentage", threshold: 95, description: "Equipment and system operational readiness" },
          { id: "MoP-02", type: "MoP", name: "CommunicationLatency", unit: "seconds", threshold: 3, description: "Average command and control response time" },
          { id: "MoP-03", type: "MoP", name: "CivilianImpact", unit: "count", threshold: 0, description: "Unintended civilian casualties (performance measure)" }
        ],
        explainer: "These are the specific ways NATO measures success in military operations. The AI automatically identifies and categorizes these from scenario documents into three types:",
        typeExplainers: {
          KPI: "Operational metrics you track during the mission (like time, resources used)",
          MoE: "How well the mission achieved its goals (like mission success rate, casualty rates)", 
          MoP: "How well systems and equipment performed (like equipment reliability, communication speed)"
        }
      }
    },
    {
      id: 2,
      name: "Conceptual Model Development",
      cli: "p2_concept",
      primaryInput: {
        file: "requirements.json",
        description: "NATO requirements from Phase 1"
      },
      primaryOutput: {
        file: "concept_model.json",
        description: "Abstract system representation with entities, processes, interactions, assumptions, and scope"
      },
      color: "bg-purple-500",
      description: "AI automation of Annex C Phase 2: abstract system representation, entity identification, and scope definition",
      phaseExplanation: "This phase implements NATO Annex C Phase 2 by developing an abstract representation of the operational system, identifying key military entities and their interactions, and defining assumptions and scope. AI automation creates the conceptual blueprint that bridges operational requirements to executable simulation models.",
      subProcesses: [
        { 
          name: "Ontology Lookup", 
          type: "process", 
          description: "Pull canonical definitions (weapon types, unit hierarchies) from local ontology.db",
          transforms: "Entity IDs → Full entity definitions with properties",
          explanation: "The system looks up standard definitions for all the military units and equipment mentioned. For example, if 'tank platoon' was identified, it retrieves details like how many tanks that includes, their capabilities, and command structure."
        },
        { 
          name: "LLM Draft Entities/Processes", 
          type: "process",
          description: "Generate JSON blocks for entities with attributes and process flow edges",
          transforms: "Requirements → Entity objects + Process flows",
          explanation: "An AI model creates detailed descriptions of all entities in your scenario and maps out how they interact. It's like drawing a flowchart showing which units can engage which targets and under what conditions."
        },
        { 
          name: "Scope & Assumption Engine", 
          type: "process",
          description: "Insert spatial/temporal bounds and explicit simplifications list",
          transforms: "Raw model → Bounded model with assumptions",
          explanation: "This sets realistic boundaries for the simulation (like the geographic area and time period) and documents any simplifying assumptions. For instance, it might assume perfect communications or ignore weather effects to keep the model manageable."
        },
        { 
          name: "Consistency Checker", 
          type: "decision", 
          description: "Detect duplicate IDs, orphan processes, circular dependencies",
          transforms: "Model graph → Error report or Pass",
          explanation: "The system checks for logical errors in the model, such as units that are supposed to interact but can't reach each other, or circular command relationships. It's like proofreading to ensure the story makes sense."
        }
      ],
      crossPhaseLinks: [
        { to: 1, condition: "Consistency Checker fails badly", description: "refine requirements" }
      ],
      dataFlow: {
        input: "requirements.json with objectives and KPIs",
        internal: "Ontology enrichment → Entity generation → Scope definition → Consistency check",
        output: "concept_model.json with complete abstract model"
      },
      // Detail-anchor metadata keys
      entitySchema: null,
      assumptionsLog: null,
      scopeBounds: null
    },
    {
      id: 3,
      name: "Model Design",
      cli: "p3_design",
      primaryInput: {
        file: "concept_model.json",
        description: "Abstract conceptual model from Phase 2"
      },
      primaryOutput: {
        file: "design_spec.json",
        description: "Structured design with modeling techniques, input parameters, algorithms, and data structures"
      },
      color: "bg-yellow-500",
      description: "AI automation of Annex C Phase 3: structured design translation, modeling technique selection, and parameter definition",
      phaseExplanation: "This phase implements NATO Annex C Phase 3 by translating the conceptual model into a structured technical design, automatically selecting appropriate modeling techniques (discrete event, agent-based, system dynamics), and defining input parameters, algorithms, and data structures required for implementation.",
      subProcesses: [
        { 
          name: "Heuristic Rulebank", 
          type: "process", 
          description: "IF entity-count > 500 THEN suggest agent-based; ELSE discrete-event",
          transforms: "Model stats → Initial approach recommendation",
          explanation: "Simple rules help decide the simulation style. For scenarios with many individual entities (like tracking every vehicle), it suggests agent-based modeling. For simpler scenarios, it might recommend event-based simulation that's faster to run."
        },
        { 
          name: "ML Classifier", 
          type: "process", 
          description: "XGBoost model outputs probability per design type; boosts or overrides heuristic",
          explanation: "A machine learning model that has learned from thousands of previous simulations provides a second opinion on the best approach. It can override the simple rules if it recognizes patterns that suggest a different method would work better.",
          transforms: "Model features → Design type probabilities"
        },
        { 
          name: "Data-Schema Synthesizer", 
          type: "process",
          description: "Auto-create class/property tables for entities; writes to schema.yaml",
          transforms: "Entity definitions → Data schemas",
          explanation: "This creates the data templates for every type of entity in your simulation - defining what information needs to be tracked for each tank, soldier, or supply truck. It's like creating forms that will be filled out during simulation."
        },
        { 
          name: "Parameter Seed Generator", 
          type: "process",
          description: "Default numerical values (tick length, sensor ranges) from doctrine CSV",
          transforms: "Entity types → Initial parameter values",
          explanation: "The system fills in realistic starting values for all the numbers in your simulation, pulling from military manuals and doctrine. For example, it knows a tank's typical speed and how far its sensors can detect enemies."
        },
        { 
          name: "Design Review Gate", 
          type: "decision", 
          description: "Combine confidence + policy; set approach = high_fidelity if complex",
          transforms: "Design components → Final design decision",
          explanation: "A final check ensures the chosen approach can handle your scenario's complexity. If the scenario is particularly challenging or important, it may upgrade to a more detailed (but slower) simulation method for better accuracy."
        }
      ],
      specialFeatures: [
        { name: "High-Fidelity Branch", description: "Allocates more CPU/GPU for complex designs" }
      ],
      dataFlow: {
        input: "concept_model.json with entities and processes",
        internal: "Heuristic rules → ML enhancement → Schema generation → Parameter defaults",
        output: "design_spec.json with simulation approach, schemas, initial parameters"
      },
      // Detail-anchor metadata keys
      designRationale: null,
      paramSeeds: null,
      resourcePlan: null
    },
    {
      id: 4,
      name: "Model Implementation",
      cli: "p4_codegen",
      primaryInput: {
        file: "design_spec.json",
        description: "Technical design specification from Phase 3"
      },
      primaryOutput: {
        file: "sim_build/ directory",
        description: "Complete executable simulation with integrated data sources and optimized performance"
      },
      secondaryOutputs: [
        { file: "model.py", description: "Main simulation implementation" },
        { file: "requirements.txt", description: "Integrated dependencies" },
        { file: "tests_unit.py", description: "Automated test suite" },
        { file: "build_report.json", description: "Performance optimization report" }
      ],
      color: "bg-red-500",
      description: "AI automation of Annex C Phase 4: model development, data integration, and performance optimization",
      phaseExplanation: "This phase implements NATO Annex C Phase 4 by developing executable simulation models using programming languages, integrating necessary data sources and computational methods, and optimizing for performance and scalability. AI automation demonstrates the capability to translate design specifications into fully functional simulation software.",
      subProcesses: [
        { 
          name: "Template Loader", 
          type: "process", 
          description: "Load skeleton SimPy/Mesa project with Jinja placeholders",
          transforms: "Design type → Code template selection",
          explanation: "The system selects a pre-built code framework that matches your simulation type. Think of it like choosing the right blueprint before building a house - it provides the basic structure that will be customized for your specific needs."
        },
        { 
          name: "Code-LLM Fill-In", 
          type: "process",
          description: "Fill entity classes, event handlers, parameters into template",
          transforms: "Template + Design → Populated Python code",
          explanation: "An AI model writes the specific code for your scenario, filling in the template with logic for how units move, fight, and make decisions. It's like a very fast programmer writing custom software based on your requirements."
        },
        { 
          name: "Dependency Resolver", 
          type: "process",
          description: "Scan code, build requirements.txt (versions pinned)",
          transforms: "Import statements → Dependency list",
          explanation: "The system identifies all the software libraries needed to run your simulation and creates a list with specific versions. This ensures the simulation will run the same way on any computer, like a recipe listing exact ingredients."
        },
        { 
          name: "Unit-Scaffold Writer", 
          type: "process",
          description: "Generate pytest cases for each public method",
          transforms: "Code methods → Test functions",
          explanation: "Automated tests are created to verify each piece of code works correctly in isolation. It's like quality control checks at each step of an assembly line, catching errors before they can cause bigger problems."
        },
        { 
          name: "Auto-Build Runner", 
          type: "decision", 
          description: "pip install, mypy, flake8, pytest; produce build_report.json",
          transforms: "Code + Tests → Pass/Fail report",
          explanation: "The system attempts to build and run the simulation code, checking for syntax errors, type mismatches, and failed tests. If everything passes, you have working software; if not, it reports what needs fixing."
        },
        { 
          name: "Regenerate/SME", 
          type: "process", 
          condition: "Build FAIL",
          description: "Try prompt variant once; if still fails, raise SME flag",
          transforms: "Failed code → Revised code or SME alert",
          explanation: "If the code doesn't work on the first try, the AI attempts one more time with adjusted instructions. If it still fails, it flags the issue for a human expert to review, preventing endless failed attempts."
        }
      ],
      resourceHooks: [
        { name: "Extra vCPU/RAM", trigger: "Build failures" }
      ],
      dataFlow: {
        input: "design_spec.json with approach, schemas, parameters",
        internal: "Template selection → Code generation → Dependency resolution → Test creation → Build validation",
        output: "sim_build/ directory with executable simulation + build_report.json"
      },
      // Detail-anchor metadata keys
      templateId: "sim-template-agent-based-v2.1.3",
      generatedFiles: [
        { file: "model.py", sha256: "ab12cd34ef56789012345678901234567890abcdef123456", size: "15.2KB", purpose: "Main simulation engine" },
        { file: "requirements.txt", sha256: "cd34ef5678901234567890abcdef123456789012345678ab", size: "0.8KB", purpose: "Python dependencies" },
        { file: "entities.py", sha256: "ef567890123456789012abcdef123456789012345678abcd", size: "8.7KB", purpose: "Entity class definitions" },
        { file: "tests_unit.py", sha256: "567890abcdef123456789012345678901234567890abcdef", size: "4.3KB", purpose: "Unit test suite" }
      ],
      buildLogs: "[2025-07-20 14:23:15] INFO: Template loaded successfully\\n[2025-07-20 14:23:16] INFO: Code generation started\\n[2025-07-20 14:23:18] INFO: Entity classes generated (12 classes)\\n[2025-07-20 14:23:19] INFO: Event handlers generated (8 handlers)\\n[2025-07-20 14:23:20] INFO: Dependencies resolved: SimPy 4.0.1, NumPy 1.24.3\\n[2025-07-20 14:23:21] INFO: Unit tests generated (24 test cases)\\n[2025-07-20 14:23:23] INFO: Build completed successfully\\n[2025-07-20 14:23:24] INFO: All tests passed (24/24)",
      licenseScan: {
        compliant: true,
        issues: [],
        summary: "All dependencies use permissive licenses (MIT, BSD, Apache-2.0)"
      }
    },
    {
      id: 5,
      name: "Verification & Validation (V&V)",
      cli: "p5_vv",
      primaryInput: {
        file: "sim_build/ directory",
        description: "Complete simulation implementation from Phase 4"
      },
      primaryOutput: {
        file: "vv_report.json",
        description: "Verification results (correct build) and validation results (real-world accuracy) with confidence assessments"
      },
      color: "bg-indigo-500",
      description: "AI automation of Annex C Phase 5: verification (correct build) and validation (real-world accuracy)",
      phaseExplanation: "This phase implements NATO Annex C Phase 5 through automated verification (ensuring models are built correctly via debugging, code reviews, unit testing) and validation (ensuring models accurately represent real-world systems by comparing outputs with empirical data). AI automation tests the limits of autonomous quality assurance in military simulation.",
      subProcesses: [
        { 
          name: "Unit Tests", 
          type: "process", 
          description: "Execute scaffold; must be 100% pass",
          transforms: "Test suite → Pass/Fail per test",
          explanation: "Every individual component of the simulation is tested in isolation to ensure it works as designed. It's like testing each part of a car engine separately before assembling them together."
        },
        { 
          name: "Smoke Scenario Run", 
          type: "process", 
          description: "60-second miniature sim; abort if crashes",
          transforms: "Simulation → Runtime stability check",
          explanation: "The system runs a quick, simplified version of your scenario to ensure the simulation doesn't crash or hang. It's like a test drive around the parking lot before taking a car on the highway."
        },
        { 
          name: "Statistical Fit", 
          type: "process", 
          description: "Compare output metrics to baseline via KS-test/χ²; score 0-1",
          transforms: "Sim outputs → Statistical comparison scores",
          explanation: "The simulation results are compared against known military data or doctrine to see if they fall within expected ranges. For example, checking if casualty rates or mission completion times match historical averages."
        },
        { 
          name: "Face-Validity Heuristics", 
          type: "process",
          description: "Quick plausibility checks (e.g., casualties not negative)",
          transforms: "Output values → Sanity check results",
          explanation: "Basic reality checks ensure the simulation isn't producing impossible results, like units moving faster than physically possible or negative casualties. These catch obvious errors that statistical tests might miss."
        },
        { 
          name: "Aggregate Validator", 
          type: "decision",
          description: "Combine results; set overall confidence, list issues[]",
          transforms: "All test results → Combined V&V score + issues",
          explanation: "All test results are combined into an overall assessment of how much you can trust this simulation. Any problems found are listed so they can be addressed before using the simulation for real analysis."
        }
      ],
      feedbackLoops: [
        { from: "Face-Validity", to: 2, condition: "Face-Validity fails", description: "adjust conceptual assumptions" }
      ],
      dataFlow: {
        input: "sim_build/ with model.py and tests",
        internal: "Unit testing → Runtime check → Statistical validation → Plausibility check → Aggregation",
        output: "vv_report.json with confidence score and issues list"
      },
      // Detail-anchor metadata keys
      testMatrix: null,
      statBenchmarks: null,
      vvScore: null
    },
    {
      id: 6,
      name: "Experimentation & Analysis",
      cli: "p6_experiment",
      primaryInput: {
        file: "sim_build/ + requirements.json",
        description: "Validated simulation + NATO requirements"
      },
      primaryOutput: {
        file: "analysis_results/ directory",
        description: "NATO doctrinal scenarios, experimental results, and analytical insights"
      },
      secondaryOutputs: [
        { file: "nato_scenarios.json", description: "Blue/Red/Green force scenarios per doctrine" },
        { file: "runs.csv", description: "All simulation runs with sensitivity analysis" },
        { file: "charts/*.png", description: "Result visualizations and effectiveness assessments" },
        { file: "analysis_report.json", description: "Interpreted results and improvement recommendations" }
      ],
      color: "bg-teal-500",
      description: "AI automation of Annex C Phase 6: NATO doctrinal scenario development, experimental design, sensitivity analysis, and results interpretation",
      phaseExplanation: "This phase implements NATO Annex C Phase 6 by developing scenarios with proper Blue/Red/Green force structures per NATO doctrine, designing and conducting simulation experiments with sensitivity analysis, interpreting results to assess model effectiveness, and identifying areas for improvement. AI automation demonstrates autonomous capability for comprehensive operational analysis.",
      subProcesses: [
        { 
          name: "NATO Doctrine Parser", 
          type: "process", 
          description: "Extract Blue/Red/Green force doctrine from NATO database per Annex C 6.1 requirements",
          transforms: "Doctrine DB + Requirements → NATO force doctrine JSON",
          explanation: "Parses NATO doctrinal database to extract proper Blue (friendly/allied), Red (hostile/enemy), and Green/White (neutral/civilian) force structures, ensuring compliance with NATO standards for scenario development."
        },
        { 
          name: "Force Structure Generator", 
          type: "process", 
          description: "Generate NATO-compliant force layouts with proper Blue/Red/Green designations",
          transforms: "Force Doctrine → NATO Scenario Structure",
          explanation: "Creates detailed force structures following NATO doctrine, with appropriate command hierarchies, equipment allocations, and behavioral patterns for each force type as specified in NATO operational planning standards."
        },
        { 
          name: "DoE Planner", 
          type: "process", 
          description: "Generate Latin-Hypercube sample of key parameters respecting KPI ranges",
          transforms: "Parameter space → Experiment design matrix",
          explanation: "The system creates a smart plan for which parameter combinations to test, ensuring good coverage without running every possible combination. It's like efficiently sampling ice cream flavors without trying every possible mix."
        },
        { 
          name: "Parallel Runner", 
          type: "process", 
          description: "Spawn N worker procs; each runs sim + dumps run-level CSV",
          transforms: "Design matrix → Multiple simulation outputs",
          explanation: "Multiple simulations run simultaneously on different processors, each testing different scenarios or random variations. This dramatically speeds up the analysis, like having multiple labs running experiments at once."
        },
        { 
          name: "KPI Extractor", 
          type: "process",
          description: "Post-process logs into runs.csv with KPI columns",
          transforms: "Raw outputs → Structured KPI table",
          explanation: "The system extracts the important metrics from each simulation run and organizes them into a spreadsheet format. This makes it easy to compare how different scenarios performed against your success criteria."
        },
        { 
          name: "ML Post-analysis", 
          type: "process", 
          description: "Random forest/SHAP to rank parameter importance; cluster outcomes",
          transforms: "KPI data → Feature importance + clusters",
          explanation: "Machine learning algorithms analyze all the results to identify which factors most strongly influence success or failure. It can also group similar outcomes together to reveal distinct patterns or strategies that work."
        },
        { 
          name: "Chart Render", 
          type: "process",
          description: "Matplotlib PNGs: KPI distributions, pareto fronts",
          transforms: "Data → Visualization files",
          explanation: "The system automatically creates graphs and charts showing how different parameters affect outcomes. These visual aids make it easy to see trends and trade-offs at a glance, like seeing which strategies minimize casualties while maximizing mission success."
        },
        { 
          name: "Insight Synthesizer", 
          type: "process",
          description: "Summarize top 5 findings in analysis_report.json",
          transforms: "All results → Key insights document",
          explanation: "An AI reviews all the data and identifies the most important discoveries, writing a summary of actionable recommendations. It's like having an analyst write an executive summary highlighting what commanders need to know."
        }
      ],
      performanceLoops: [
        { name: "CPU Budget Monitor", action: "auto-throttle batch size or request more resources" }
      ],
      dataFlow: {
        input: "sim_build/ code + requirements.json KPIs",
        internal: "NATO doctrine parsing → Force structure generation → DoE planning → Parallel execution → KPI extraction → ML analysis → Visualization → Synthesis",
        output: "analysis_results/ with runs.csv, charts, and analysis_report.json"
      },
      // Detail-anchor metadata keys
      doePlan: null,
      runConfig: null,
      analysisNotebooks: null
    },
    {
      id: 7,
      name: "Maintenance & Evolution",
      cli: "p7_maintenance",
      primaryInput: {
        file: "analysis_results/ + prior run_meta.json",
        description: "Current analysis results + historical baselines"
      },
      primaryOutput: {
        file: "maintenance_actions.json",
        description: "Model update recommendations based on new data, technologies, or requirements"
      },
      secondaryOutputs: [
        { file: "updated_design_spec.json", description: "Revised parameters and specifications" },
        { file: "evolution_log.json", description: "Change tracking and rationale" }
      ],
      color: "bg-gray-500",
      description: "AI automation of Annex C Phase 7: model updates based on new data, technologies, or requirements",
      phaseExplanation: "This phase implements NATO Annex C Phase 7 by automatically updating models based on new data, technologies, or evolving requirements. AI automation monitors model performance over time, detects drift from baseline expectations, and recommends appropriate updates to maintain model relevance and accuracy in changing operational environments.",
      subProcesses: [
        { 
          name: "Baseline Compare", 
          type: "process",
          description: "Load historical KPI means; compute z-scores for new run",
          transforms: "Current + Historical → Deviation metrics",
          explanation: "The system compares your latest results against established baselines to measure how much things have changed. It's like comparing this year's performance against last year's to spot significant shifts or trends."
        },
        { 
          name: "Drift Detector", 
          type: "process", 
          description: "Two-sample tests; flag if p < 0.05 on > 30% of KPIs",
          transforms: "Deviations → Statistical significance flags",
          explanation: "Statistical tests determine whether observed changes are meaningful or just random variation. If too many metrics show significant changes, it suggests the simulation may need updating to reflect new realities."
        },
        { 
          name: "Version Recommender", 
          type: "process",
          description: "Suggest 'retune params' vs 'regen design' vs 'full rebuild'",
          transforms: "Drift analysis → Action recommendation",
          explanation: "Based on the type and severity of drift detected, the system recommends appropriate action: minor parameter tweaks for small changes, redesign for moderate issues, or complete rebuild for fundamental shifts."
        },
        { 
          name: "Auto-Patch Draft", 
          type: "process",
          description: "If retune, output updated design_spec.json with new param seeds",
          transforms: "Recommendation → Updated specifications",
          explanation: "For minor adjustments, the system can automatically generate updated configuration files with new parameter values. This allows quick fixes without rebuilding the entire simulation from scratch."
        }
      ],
      crossPhaseLinks: [
        { to: 3, condition: "severe drift", description: "regenerate design" },
        { to: 4, condition: "severe drift", description: "regenerate code" }
      ],
      dataFlow: {
        input: "analysis_results/ + historical run_meta.json",
        internal: "Baseline comparison → Drift detection → Action recommendation → Patch generation",
        output: "maintenance_actions.json (+ optional updated_design_spec.json)"
      },
      // Detail-anchor metadata keys
      baselineRef: null,
      driftMetrics: null,
      actionRules: null
    }
  ];
