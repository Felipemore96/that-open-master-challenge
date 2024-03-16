import * as React from "react"
import { Project } from "../class/projects"

interface Props {
  project: Project
}

export function HomePageProjectCard(props: Props) {
  return (
    <div className="dashboard-card" 
      style={{ 
        padding: "30px 10px",
        width: "20vw"

      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0px 30px",
          marginBottom: 10
        }}
      >
        <h2>{props.project.projectName}</h2>
      </div>
      <div style={{ padding: "0 30px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div className="card-content">
            <div className="card-property">
              <h5 style={{ color: "#969696" }}>Status</h5>
              <h5 id="project-status" data-project-info="status">{props.project.projectStatus}</h5>
            </div>
            <div className="card-property">
              <h5 style={{ color: "#969696" }}>Type</h5>
              <h5 id="project-type" data-project-info="type">{props.project.projectType}</h5>
            </div>
            <div className="card-property">
              <h5 style={{ color: "#969696" }}>Address</h5>
              <h5 id="project-address" data-project-info="address">{props.project.projectAddress}</h5>
            </div>
            <div
              className="card-property"
              style={{
                backgroundColor: "#404040",
                borderRadius: 9999,
                overflow: "auto"
              }}
            >
              <div
                id="project-progress"
                data-project-info="progress"
                style={{
                  width: `${props.project.projectProgress}%`,
                  backgroundColor: "#468f3f",
                  padding: "4px",
                  textAlign: "center"
                }}
                >
                  {props.project.projectProgress}%
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}