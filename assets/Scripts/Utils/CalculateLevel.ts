const CONSTANT = 0.07
const POWER = 2

export const calculateLevel = (xp: number) => {
	const level = Math.round(Math.pow(xp, 1 / POWER) * CONSTANT)
	return (level)
}