export const validateValue = async (value, validators) => {
    let validationResult = null;
    let i = 0;

    if (Array.isArray(validators)) {
        while (validationResult === null && i < validators.length) {
            const res = await validators[i](value);
    
            if (res) {
                validationResult = res
            }
            
            i++;
        }
        
        return validationResult;
    } else return null

};