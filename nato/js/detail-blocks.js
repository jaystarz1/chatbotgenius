// Reusable UI components for NATO M&S Workflow

// DetailBlock component
window.DetailBlock = function({ title, icon, children, color = "border-gray-200" }) {
    return React.createElement('div', { className: `bg-white border ${color} rounded-lg p-4 mb-4` },
        React.createElement('h4', { className: "font-semibold flex items-center gap-2 mb-3 text-gray-800" },
            icon,
            title
        ),
        children
    );
};

// ExplainerBox component for technical sections
window.ExplainerBox = function({ title, children, colorClass = "bg-blue-100 border-blue-300 text-blue-900" }) {
    return React.createElement('div', { className: `p-3 ${colorClass} rounded-lg border mb-4` },
        React.createElement('p', { className: "text-sm leading-relaxed" },
            React.createElement('strong', null, "What this means:"),
            " ",
            children
        )
    );
};

// FileIcon component
window.FileIcon = function({ type }) {
    const iconClass = "w-4 h-4";
    if (type === 'directory') {
        return React.createElement(window.lucideIcons.FolderOpen, { className: iconClass });
    }
    return React.createElement(window.lucideIcons.FileJson, { className: iconClass });
};
