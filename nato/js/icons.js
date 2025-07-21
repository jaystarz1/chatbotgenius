// Icon components for NATO M&S Workflow
// Simplified versions of Lucide React icons

window.lucideIcons = {
    ChevronDown: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" })
        )
    ),
    
    ChevronUp: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 15l7-7 7 7" })
        )
    ),
    
    FileText: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
            React.createElement('polyline', { points: "14 2 14 8 20 8" }),
            React.createElement('line', { x1: 16, y1: 13, x2: 8, y2: 13 }),
            React.createElement('line', { x1: 16, y1: 17, x2: 8, y2: 17 }),
            React.createElement('polyline', { points: "10 9 9 9 8 9" })
        )
    ),
    
    Cpu: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('rect', { x: 4, y: 4, width: 16, height: 16, rx: 2, ry: 2 }),
            React.createElement('rect', { x: 9, y: 9, width: 6, height: 6 }),
            React.createElement('line', { x1: 9, y1: 1, x2: 9, y2: 4 }),
            React.createElement('line', { x1: 15, y1: 1, x2: 15, y2: 4 }),
            React.createElement('line', { x1: 9, y1: 20, x2: 9, y2: 23 }),
            React.createElement('line', { x1: 15, y1: 20, x2: 15, y2: 23 }),
            React.createElement('line', { x1: 20, y1: 9, x2: 23, y2: 9 }),
            React.createElement('line', { x1: 20, y1: 14, x2: 23, y2: 14 }),
            React.createElement('line', { x1: 1, y1: 9, x2: 4, y2: 9 }),
            React.createElement('line', { x1: 1, y1: 14, x2: 4, y2: 14 })
        )
    ),
    
    AlertTriangle: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
            React.createElement('line', { x1: 12, y1: 9, x2: 12, y2: 13 }),
            React.createElement('line', { x1: 12, y1: 17, x2: 12.01, y2: 17 })
        )
    ),
    
    RefreshCw: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('polyline', { points: "23 4 23 10 17 10" }),
            React.createElement('polyline', { points: "1 20 1 14 7 14" }),
            React.createElement('path', { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
        )
    ),
    
    Zap: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('polygon', { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
        )
    ),
    
    Settings: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('circle', { cx: 12, cy: 12, r: 3 }),
            React.createElement('path', { d: "M12 1v6m0 6v6m4.22-10.22l4.24-4.24m-4.24 14.14l4.24 4.24M20 12h6m-6 0h-6m-2.22-4.22l-4.24-4.24m4.24 14.14l-4.24 4.24M6 12H0" })
        )
    ),
    
    Activity: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('polyline', { points: "22 12 18 12 15 21 9 3 6 12 2 12" })
        )
    ),
    
    FileJson: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
            React.createElement('polyline', { points: "14 2 14 8 20 8" }),
            React.createElement('text', { x: 8, y: 16, fontSize: 8, fontFamily: "monospace" }, "{ }")
        )
    ),
    
    FolderOpen: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" })
        )
    ),
    
    ArrowRight: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 }),
            React.createElement('polyline', { points: "12 5 19 12 12 19" })
        )
    ),
    
    Info: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('circle', { cx: 12, cy: 12, r: 10 }),
            React.createElement('line', { x1: 12, y1: 16, x2: 12, y2: 12 }),
            React.createElement('line', { x1: 12, y1: 8, x2: 12.01, y2: 8 })
        )
    ),
    
    Database: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('ellipse', { cx: 12, cy: 5, rx: 9, ry: 3 }),
            React.createElement('path', { d: "M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" }),
            React.createElement('path', { d: "M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" })
        )
    ),
    
    Code: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('polyline', { points: "16 18 22 12 16 6" }),
            React.createElement('polyline', { points: "8 6 2 12 8 18" })
        )
    ),
    
    TestTube: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2" }),
            React.createElement('path', { d: "M8.5 2h7" }),
            React.createElement('path', { d: "M14.5 16H9.5" })
        )
    ),
    
    FileCheck: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
            React.createElement('polyline', { points: "14 2 14 8 20 8" }),
            React.createElement('path', { d: "M9 15l2 2 4-4" })
        )
    ),
    
    BarChart3: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('line', { x1: 18, y1: 20, x2: 18, y2: 10 }),
            React.createElement('line', { x1: 12, y1: 20, x2: 12, y2: 4 }),
            React.createElement('line', { x1: 6, y1: 20, x2: 6, y2: 14 })
        )
    ),
    
    Hash: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('line', { x1: 4, y1: 9, x2: 20, y2: 9 }),
            React.createElement('line', { x1: 4, y1: 15, x2: 20, y2: 15 }),
            React.createElement('line', { x1: 10, y1: 3, x2: 8, y2: 21 }),
            React.createElement('line', { x1: 16, y1: 3, x2: 14, y2: 21 })
        )
    ),
    
    Bot: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('rect', { x: 3, y: 11, width: 18, height: 10, rx: 2, ry: 2 }),
            React.createElement('circle', { cx: 12, cy: 5, r: 2 }),
            React.createElement('path', { d: "M12 7v4" }),
            React.createElement('line', { x1: 8, y1: 16, x2: 8, y2: 16 }),
            React.createElement('line', { x1: 16, y1: 16, x2: 16, y2: 16 })
        )
    ),
    
    Terminal: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('polyline', { points: "4 17 10 11 4 5" }),
            React.createElement('line', { x1: 12, y1: 19, x2: 20, y2: 19 })
        )
    ),
    
    GitBranch: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('line', { x1: 6, y1: 3, x2: 6, y2: 15 }),
            React.createElement('circle', { cx: 18, cy: 6, r: 3 }),
            React.createElement('circle', { cx: 6, cy: 18, r: 3 }),
            React.createElement('path', { d: "M18 9a9 9 0 0 1-9 9" })
        )
    ),
    
    Workflow: ({ className = "w-4 h-4" }) => (
        React.createElement('svg', { className, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('rect', { x: 3, y: 3, width: 8, height: 8, rx: 1 }),
            React.createElement('rect', { x: 13, y: 3, width: 8, height: 8, rx: 1 }),
            React.createElement('rect', { x: 3, y: 13, width: 8, height: 8, rx: 1 }),
            React.createElement('rect', { x: 13, y: 13, width: 8, height: 8, rx: 1 }),
            React.createElement('path', { d: "M7 11v2m10-2v2M7 7h10v10" })
        )
    )
};
