interface ColorProps {
    type: "error" | "recommend" | undefined
}

const settingRowColor = ({type}:ColorProps) => {
    switch(type){
        case "error":
            return "red"
        case "recommend":
            return "#585874"
        default:
            return "none"
    }

}

export default settingRowColor