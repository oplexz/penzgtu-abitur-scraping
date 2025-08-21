/**
 * Функция для правильного склонения слов в зависимости от числа
 * @param num число, от которого будет зависеть форма слова
 * @param formFor1 первая форма слова, например "направление"
 * @param formFor2 вторая форма слова - "направления"
 * @param formFor5 третья форма множественного числа слова - "направлений"
 * @returns правильная форма слова
 */
export function pluralize(
    num: number,
    formFor1: string,
    formFor2: string,
    formFor5: string
): string {
    const absNum = Math.abs(num) % 100; // берем число по модулю и сбрасываем сотни
    const numX = absNum % 10; // сбрасываем десятки

    if (absNum > 10 && absNum < 20) {
        // если число принадлежит отрезку [11;19]
        return formFor5;
    }
    if (numX > 1 && numX < 5) {
        // иначе если число оканчивается на 2,3,4
        return formFor2;
    }
    if (numX === 1) {
        // иначе если оканчивается на 1
        return formFor1;
    }
    return formFor5;
}

/**
 * Функция для получения правильной формы слова "направление"
 * @param count количество направлений
 * @returns правильная форма слова "направление"
 */
export function pluralizeDirections(count: number): string {
    return pluralize(count, 'направление', 'направления', 'направлений');
}
