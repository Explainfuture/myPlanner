/**
 * 生成日历显示所需的日期矩阵
 * @param {number} year 
 * @param {number} month (0-11)
 * @returns {Array} 包含日期对象的数组
 */
export const generateMonthDays = (year,month) => {
    //getDay方法，获取1号是周几
    const firstDayOfMonth = new Date(year,month,1).getDay()
    //getDate,本月有多少天
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days = []
    // 1. 填充上个月的残余格子 (为了让周一开头)
    // 如果周日是0，我们希望周一排在第一列，需要特殊处理偏移
    const prefixDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

    for (let i = 0; i < prefixDays; i++) {
        days.push({type: 'prey', day: ''})
    }

    // 2.填充这个月的日期
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({
            type: 'current',
            day: i,
            dateString: `${year}-${month + 1}-${i}`
        })
    }
    return days
}
