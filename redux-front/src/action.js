export const action = {
    increase: (number) => ({
        type: actionName.INC,
        plusAmount: number
    }),
    decrease: (number) => ({
        type: actionName.DEC,
        minusAmount: number
    })
}
export const actionName = {
    INC: "INREASE",
    DEC: "DECREASE" 
}

