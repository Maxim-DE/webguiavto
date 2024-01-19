import React from "react"
import { filter_obj } from "../utilites"

export const useFormValidation = () => {
    const [validInputList, setValidInputList] = React.useState({})

    const validStatus_getter = ({id, valid_status}) => {
        setValidInputList(prevState => ({
            ...prevState,
            [id]: valid_status
        }))
    }

    const checkFormValid = (inputValidState) => {
        if (Object.keys(inputValidState).length > 0) {
            for (const key in inputValidState) {
                if (!inputValidState[key]) {
                    return false
                }
            }
            return true

        } else {
            return true
        }
    }

    const isFormValid = checkFormValid(validInputList)

    return {
        isFormValid,
        validStatus_getter,
        validInputList
    }
}