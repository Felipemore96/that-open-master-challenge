import * as React from "react"

interface Props {
    onChange: (value: string) => void
}

export function SearchBox(props: Props) {

    return (
        <input 
        onChange={(e) => {props.onChange(e.target.value)}}
        type="text"
        placeholder="Search projects by name..."
        style={{ width: "100%" }}
        />
    )
}