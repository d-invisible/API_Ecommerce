


const checkRole = async (req, res, next) => {
    try {
        const { role } = req.user;
        console.log(role)
        if (role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Unauthorized : Only Admin allowed' });
        }
        next();

    } catch (error) {
        res.status(500).json({ success: false, error: error?.message || 'Internal Server Error' });
    }
}

export default checkRole;