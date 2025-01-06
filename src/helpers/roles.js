export const ROLES = {
    "user": 0,
    "admin": 1,
    "agent": 2
}

export function checkRole(name, value) {
    if("*" == name) return true;
    const roleNames = Array.isArray(name) ? name : [name]
    return roleNames.some(r => ROLES[r] === Number(value));
}