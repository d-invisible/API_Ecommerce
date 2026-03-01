


const checkRole = (authRole) => {
    return async (req, res, next) => {
        try {
            const { role } = req.user;
            if (role !== authRole) {
                return res.status(401).json({ success: false, error: `Unauthorized : Only ${authRole} allowed` });
            }
            next();

        } catch (error) {
            res.status(500).json({ success: false, error: error?.message || 'Internal Server Error' });
        }
    }
}

export default checkRole;