import * as React from "react"


export function Sidebar() {
    return (
        <aside id="sidebar">
            <img
                id="company-logo"
                src="./assets/company-logo.svg"
                alt="Construction Company"
            />
            <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
                <button id="new-project-btn" className="btn-secondary">
                <p style={{ width: "100%" }}>
                    <span className="material-icons-round">add</span>
                </p>
                </button>
                <input type="text" placeholder="Search Project" style={{ width: "100%" }} />
            </div>
            <div id="projects-list" className="nav-buttons" />
        </aside>
    )
}