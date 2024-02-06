export const required = (
    message = 'Обязательное поле'
) => {
    return async (value) => (value ? null : message);
};

export const hasCyrillicSymbols = (
    message = 'Присутствует кириллица'
) => {
    const regexp = /[а-яё]/i
    return async (value) => (regexp.test(value) ? message : null);
};

export const minLength = (minCharCount = 1) => {
    if (minCharCount <= 0) {
        throw new Error(-
            `Валидатор minLength ожидает положительное минимальное значение длины строки, получил ${minCharCount}`
        )
    }

    return async value =>
        value.length >= minCharCount
            ? null
            : `Количество символов не должно быть меньше ${minCharCount}`
}

export const maxLength = (maxCharCount) => {
    if (maxCharCount <= 0) {
        throw new Error(
            `Валидатор maxLength ожидает положительное ограничение длины строки, получил ${maxCharCount}`
        )
    }

    return async value =>
        value.length <= maxCharCount
            ? null
            : `Количество символов не должно быть больше ${maxCharCount}`
}

export const isNumber = (
    message = 'Значение не является числом'
) => {
    const regexp = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/i
    return async (value) => (regexp.test(value) ? null : message);
};

export const isIpAdress = (
    message = 'Неверный формат IP-адреса'
) => {
    const regexp = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/i
    return async (value) => (regexp.test(value) ? null : message);
};

export const isMacAdress = (
    message = 'Неверный формат MAC-адреса'
) => {
    const regexp = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$/i
    return async (value) => (regexp.test(value) ? null : message);
};

export const isHexNumber = (
    message = 'Значение не является 16-ти разрядным числом'
) => {
    const regexp = /^0[xX][0-9a-fA-F]+/i
    return async (value) => (regexp.test(value) ? null : message);
};

export const isInNumRange = (minVal = 0, maxVal = 100000) => {
    return async value => {
        const dec_value = value % 1 == 0 ? parseInt(value) : parseFloat(value),
              dec_min = minVal % 1 == 0 ? parseInt(minVal) : parseFloat(minVal),
              dec_max = maxVal % 1 == 0 ? parseInt(maxVal) : parseFloat(maxVal)

        console.log(value % 1);

        if (isNaN(dec_value) || isNaN(dec_min) || isNaN(dec_max)) {
            return null
        }

        return (dec_value >= dec_min &&
               dec_value <= dec_max)
               ? null
               : `Значение должно быть в диапазоне: ${minVal} - ${maxVal}`
    }

}

export const isDate = (
    message = `Недопустимый формат даты, допустимый - YYYY-MM-DD`
) => {
    const regexp = /^([0-9]{4}|[0-9]{2})[./-]([0]?[1-9]|[1][0-2])[./-]([0]?[1-9]|[1|2][0-9]|[3][0|1])$/i
    return async (value) => (regexp.test(value) ? null : message);
};

export const isTime = (
    message = `Недопустимый формат времени`
) => {
    const regexp = /^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$/i
    return async (value) => (regexp.test(value) ? null : message);
};