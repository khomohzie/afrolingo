import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
	payload: Object,
	options: SignOptions = {}
) => {

	return jwt.sign(payload, process.env.JWT_SECRET, {
		...(options && options),
	});
};

export const verifyJwt = <T>(
	token: string,
): T | null => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET) as T;
	} catch (error) {
		console.log(error);
		return error as T;
	}
};
